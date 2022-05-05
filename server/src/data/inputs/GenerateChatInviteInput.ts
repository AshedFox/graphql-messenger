import {Field, ID, InputType, Int} from "type-graphql";
import {IsEnum, IsInt, Min} from "class-validator";
import {ChatInviteUsageTerm} from "../enitities/ChatInviteUsageTerm";

@InputType()
export class GenerateChatInviteInput {
    @Field(() => ID)
    chatId!: string;

    @Field(() => Int, {nullable: true})
    @IsInt()
    @Min(1)
    maxUses?: number;

    @Field(() => ChatInviteUsageTerm)
    @IsEnum(ChatInviteUsageTerm)
    usageTerm!: ChatInviteUsageTerm;
}
