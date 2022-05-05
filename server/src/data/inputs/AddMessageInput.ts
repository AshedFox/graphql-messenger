import {Field, ID, InputType} from "type-graphql";
import {Message} from "../enitities/Message";
import {Length} from "class-validator";

@InputType()
export class AddMessageInput implements Partial<Message> {
    @Field()
    @Length(1, 500)
    text!: string;

    @Field(() => ID, {nullable: true})
    replyToId?: string;

    @Field(() => ID)
    chatId!: string;

    @Field(() => [String])
    attachmentsIds!: string[];
}
