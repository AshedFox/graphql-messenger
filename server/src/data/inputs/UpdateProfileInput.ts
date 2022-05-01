import {Field, ID, InputType} from "type-graphql";
import {User} from "../enitities/User";
import {Length} from "class-validator";

@InputType()
export class UpdateProfileInput implements Partial<User> {
    @Field({nullable: true})
    @Length(3, 200)
    name?: string;

    @Field(() => ID, {nullable: true})
    avatarId?: string;
}
