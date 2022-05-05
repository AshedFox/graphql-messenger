import {
    Arg,
    Ctx,
    FieldResolver,
    ID,
    Mutation,
    PubSub,
    PubSubEngine,
    Query,
    Resolver,
    Root,
    Subscription,
    UseMiddleware
} from "type-graphql";
import {User} from "../enitities/User";
import {SignUpInput} from "../inputs/SignUpInput";
import bcrypt from "bcrypt";
import {MyContext} from "../../types/MyContext";
import {RefreshToken} from "../enitities/RefreshToken";
import {createTokensCookies, removeTokensCookies} from "../../services/cookiesService";
import {LoginInput} from "../inputs/LoginInput";
import {generateAccessToken} from "../../services/authService";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {File} from "../enitities/File";
import {HttpQueryError} from "apollo-server-core";
import {UserStatus} from "../enitities/UserStatus";
import {UpdateProfileInput} from "../inputs/UpdateProfileInput";
import {SubscriptionType} from "./SubscriptionType";
import {ChatUser} from "../enitities/ChatUser";


@Resolver(User)
export class UserResolver {
    @FieldResolver(() => File, {nullable: true})
    async avatar(@Root() user: User): Promise<File | null> {
        return user.avatarId ? await File.findOneBy({id: user.avatarId}) : null;
    }

    @UseMiddleware(authMiddleware)
    @Query(() => [User])
    async users(): Promise<User[]> {
        return await User.find();
    }

    @UseMiddleware(authMiddleware)
    @Query(() => User)
    async user(@Arg("id", () => ID) id: string): Promise<User | null> {
        const user = await User.findOneBy({id});

        if (!user) {
            throw new HttpQueryError(404, "User not found");
        }

        return user;
    }

    @UseMiddleware(authMiddleware)
    @Query(() => User)
    async me(@Ctx() context: MyContext): Promise<User> {
        const me = await User.findOneBy({id: context.req.userId});

        if (!me) {
            throw new HttpQueryError(404, "User not found");
        }

        return me;
    }

    @Mutation(() => User)
    async signUp(@Arg("input") signUpInput: SignUpInput, @Ctx() context: MyContext): Promise<User> {
        const user = await User.findOne({where: {email: signUpInput.email}, withDeleted: true});

        if (user) {
            throw new HttpQueryError(409, "User already exists");
        }

        signUpInput.password = await bcrypt.hash(signUpInput.password, 8);
        const newUser = await User.create({...signUpInput}).save();

        const accessToken = generateAccessToken(newUser.id);
        const refreshLifetime = process.env.REFRESH_TOKEN_LIFETIME as string;
        const expiredAt = new Date(new Date().setDate(new Date().getDate() + Number.parseInt(refreshLifetime)));
        const refreshToken = await RefreshToken.create({userId: newUser.id, expiredAt}).save();
        createTokensCookies(context.res, accessToken, refreshToken.id);

        return newUser;
    }

    @Mutation(() => User)
    async login(@Arg("input") loginInput: LoginInput, @Ctx() context: MyContext): Promise<User> {
        const user = await User.findOneBy({email: loginInput.email});

        if (!user) {
            throw new HttpQueryError(404, "User not found");
        }

        if (!await bcrypt.compare(loginInput.password, user.password)) {
            throw new HttpQueryError(401, "Incorrect password");
        }

        const accessToken = generateAccessToken(user.id)
        const refreshLifetime = process.env.REFRESH_TOKEN_LIFETIME as string;
        const expiredAt = new Date(new Date().setDate(new Date().getDate() + Number.parseInt(refreshLifetime)));
        const refreshToken = await RefreshToken.create({userId: user.id, expiredAt}).save();
        createTokensCookies(context.res, accessToken, refreshToken.id);

        return user;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => User)
    async updateProfile(@Arg("input") {name, avatarId}: UpdateProfileInput, @Ctx() context: MyContext,
                        @PubSub() pubSub: PubSubEngine): Promise<User> {
        const user = await User.findOneBy({id: context.req.userId});

        if (!user) {
            throw new HttpQueryError(404, "User not found");
        }

        if (name === user.name && avatarId === user.avatarId) {
            throw new HttpQueryError(400, "Nothing to change");
        }

        if (name && name !== user.name) {
            user.name = name;
        }

        if (avatarId !== user.avatarId) {
            user.avatarId = avatarId;
        }

        await user.save();
        await pubSub.publish(`${SubscriptionType.PROFILE_UPDATED}_${user.id}`, user);
        const chatUsersByUser = await ChatUser.find({where: {userId: user.id}, withDeleted: true});
        chatUsersByUser.forEach((chatUser) => {
            pubSub.publish(`${SubscriptionType.CHAT_USER_UPDATED}_${chatUser.chatId}`, chatUser);
        })

        return user;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async logout(@Ctx() context: MyContext) {
        removeTokensCookies(context.res);
        return true;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => User)
    async recoverUser(@Arg("id", () => ID) id: string, @Ctx() context: MyContext): Promise<User> {
        const user = await User.findOne({where: {id}, withDeleted: true});

        if (!user) {
            throw new HttpQueryError(404, "User not found");
        }

        if (user.id !== context.req.userId) {
            throw new HttpQueryError(403, "Forbidden");
        }

        if (!(user.status & UserStatus.DELETED)) {
            throw new HttpQueryError(409, "User not deleted");
        }

        await user.recover();
        return await user.save();
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async removeUser(@Arg("id", () => ID) id: string, @Ctx() context: MyContext): Promise<boolean> {
        const user = await User.findOne({where: {id}, withDeleted: true});

        if (!user) {
            throw new HttpQueryError(404, "User not found");
        }

        if (user.id !== context.req.userId) {
            throw new HttpQueryError(403, "Forbidden");
        }

        if (user.status & UserStatus.DELETED) {
            throw new HttpQueryError(409, "User already deleted");
        }

        await user.softRemove();
        await user.save();

        return true;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async removeMe(@Ctx() context: MyContext): Promise<boolean> {
        const user = await User.findOne({where: {id: context.req.userId}, withDeleted: true});

        if (!user) {
            throw new HttpQueryError(404, "User not found");
        }

        if (user.status & UserStatus.DELETED) {
            throw new HttpQueryError(409, "User already deleted");
        }

        await user.softRemove();
        await user.save();
        removeTokensCookies(context.res);
        return true;
    }

    @Subscription(() => User, {
        topics: (data) => `${SubscriptionType.PROFILE_UPDATED}_${data.args.userId}`,
    })
    async profileUpdated(@Root() user: User, @Arg("userId", () => ID) userId: string): Promise<User> {
        return user;
    }
}
