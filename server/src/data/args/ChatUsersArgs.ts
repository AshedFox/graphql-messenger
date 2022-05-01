import {ArgsType, Field, ID, Int} from "type-graphql";
import {IsInt, IsUUID, Min} from "class-validator";

@ArgsType()
export class ChatUsersArgs {
    @Field(() => ID)
    chatId!: string;

    @Field(() => Int, {nullable: true, defaultValue: 20})
    @IsInt()
    @Min(-1)
    count!: number;

    @Field(() => ID, {nullable: true})
    @IsUUID()
    lastUserId?: string;

    @Field({nullable: true})
    lastCreatedAt?: Date;
}
