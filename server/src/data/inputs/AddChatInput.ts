import {Field, ID, InputType} from "type-graphql";
import {Chat} from "../enitities/Chat";

@InputType()
export class AddChatInput implements Partial<Chat>{
    @Field()
    name!: string;

    @Field(() => ID, {nullable: true})
    avatarId?: string;
}

