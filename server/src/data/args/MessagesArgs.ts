import {ArgsType, Field, ID, Int} from "type-graphql";
import {IsInt, IsUUID, Min} from "class-validator";

@ArgsType()
export class MessagesArgs {
    @Field(() => ID)
    chatId!: string;

    @Field(() => Int, {nullable: true, defaultValue: 50})
    @IsInt()
    @Min(1)
    count!: number;

    @Field(() => ID, {nullable: true})
    @IsUUID()
    lastId?: string;

    @Field({nullable: true})
    lastCreatedAt?: Date;
}
