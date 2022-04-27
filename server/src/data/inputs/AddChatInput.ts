import {Field, ID, InputType} from "type-graphql";
import {Chat} from "../enitities/Chat";
import {Length} from "class-validator";

@InputType()
export class AddChatInput implements Partial<Chat> {
    @Field()
    @Length(3, 200)
    name!: string;

    @Field(() => ID, {nullable: true})
    avatarId?: string;
}

