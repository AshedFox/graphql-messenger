import {Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root, UseMiddleware} from "type-graphql";
import {User} from "../enitities/User";
import {SignUpInput} from "../inputs/SignUpInput";
import bcrypt from "bcrypt";
import {MyContext} from "../../types/MyContext";
import {RefreshToken} from "../enitities/RefreshToken";
import {createTokensCookies, removeTokensCookies} from "../../services/cookiesService";
import {LoginInput} from "../inputs/LoginInput";
import {generateAccessToken} from "../../services/authService";
import {ApolloError, AuthenticationError} from "apollo-server-express";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {File} from "../enitities/File";
import {ForbiddenError} from "apollo-server-core";
import {UserStatus} from "../enitities/UserStatus";


@Resolver(User)
export class UserResolver {
    @FieldResolver(() => File)
    async avatar(@Root() user: User) {
        return File.findOneBy({id: user.avatarId});
    }

    @UseMiddleware(authMiddleware)
    @Query(() => [User])
    async users(): Promise<User[]> {
        return await User.find();
    }

    @UseMiddleware(authMiddleware)
    @Query(() => User)
    async user(@Arg("id", () => ID) id: string): Promise<User | null> {
        return await User.findOneBy({id});
    }

    @UseMiddleware(authMiddleware)
    @Query(() => User)
    async me(@Ctx() context: MyContext): Promise<User | null> {
        return await User.findOneBy({id: context.req.userId});
    }

    @Mutation(() => User)
    async signUp(@Arg("input") signUpInput: SignUpInput, @Ctx() context: MyContext): Promise<User> {
        try {
            signUpInput.password = await bcrypt.hash(signUpInput.password, 8);
            const user = await User.create({...signUpInput}).save();

            const accessToken = generateAccessToken(user.id);
            const refreshToken = RefreshToken.create({userId: user.id});
            createTokensCookies(context.res, accessToken, refreshToken.id);

            return user;
        } catch {
            throw new ApolloError("Something went wrong!");
        }
    }

    @Mutation(() => User)
    async login(@Arg("input") loginInput: LoginInput, @Ctx() context: MyContext): Promise<User> {
        const user = await User.findOneBy({email: loginInput.email});

        if (user && await bcrypt.compare(loginInput.password, user.password)) {
            const accessToken = generateAccessToken(user.id);
            const refreshToken = await RefreshToken.create({userId: user.id}).save();
            createTokensCookies(context.res, accessToken, refreshToken.id);

            return user;
        }

        throw new AuthenticationError("Login failed!");
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async logout(@Ctx() context: MyContext) {
        removeTokensCookies(context.res);
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async removeMe(@Ctx() context: MyContext): Promise<boolean> {
        const userToDelete = await User.findOneBy({id: context.req.userId});

        if (userToDelete) {
            await User.softRemove(userToDelete);
            removeTokensCookies(context.res);
            return true;
        }

        return false;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => User, {nullable: true})
    async recoverUser(@Arg("id", () => ID) id: string, @Ctx() context: MyContext): Promise<User | null> {
        const userToRecover = await User.findOne({where: {id}, withDeleted: true});

        if (userToRecover && (userToRecover.status & UserStatus.DELETED)) {
            if (userToRecover.id !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            await userToRecover.recover();
            return await userToRecover.save();
        }

        return null;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async removeUser(@Arg("id", () => ID) id: string, @Ctx() context: MyContext): Promise<boolean> {
        const userToDelete = await User.findOneBy({id});

        if (userToDelete) {
            if (userToDelete.id !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            await userToDelete.softRemove();
            await userToDelete.save();

            return true;
        }

        return false;
    }
}
