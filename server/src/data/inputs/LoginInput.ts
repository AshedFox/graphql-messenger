import {Field, InputType} from "type-graphql";
import {User} from "../enitities/User";
import {IsEmail} from "class-validator";

@InputType()
export class LoginInput implements Partial<User> {
    @Field()
    @IsEmail()
    email!: string;

    @Field()
    password!: string;
}
