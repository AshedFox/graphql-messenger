import {Field, InputType} from "type-graphql";
import {User} from "../enitities/User";

@InputType()
export class SignUpInput implements Partial<User>{
    @Field()
    email!: string;

    @Field()
    password!: string;

    @Field()
    name!: string;
}
