import {Field, InputType} from "type-graphql";
import {User} from "../enitities/User";
import {IsEmail, Length} from "class-validator";

@InputType()
export class SignUpInput implements Partial<User> {
    @Field()
    @IsEmail()
    email!: string;

    @Field()
    password!: string;

    @Field()
    @Length(3, 200)
    name!: string;
}
