import {ArgsType, Field, ID, Int} from "type-graphql";
import {IsInt, IsUUID, Min} from "class-validator";

@ArgsType()
export class ChatsArgs {
    @Field(() => Int, {nullable: true, defaultValue: 20})
    @IsInt()
    @Min(-1)
    count!: number;

    @Field(() => ID, {nullable: true})
    @IsUUID()
    lastId?: string;

    @Field({nullable: true})
    lastCreatedAt?: Date;
}
