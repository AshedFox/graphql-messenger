import {Field, ID, InputType} from "type-graphql";
import {Message} from "../enitities/Message";

@InputType()
export class AddMessageInput implements Partial<Message> {
    @Field()
    text!: string;

    @Field(() => ID, {nullable: true})
    replyToId?: string;

    @Field(() => ID)
    chatId!: string;
}
