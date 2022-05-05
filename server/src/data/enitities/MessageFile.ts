import {BaseEntity, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Message} from "./Message";
import {File} from "./File";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class MessageFile extends BaseEntity {
    @PrimaryColumn()
    messageId!: string;

    @Field(() => Message)
    @ManyToOne(() => Message)
    @JoinColumn({name: "messageId"})
    message!: Message;


    @PrimaryColumn()
    fileId!: string;

    @Field(() => File)
    @ManyToOne(() => File)
    @JoinColumn({name: "fileId"})
    file!: File;

    @Field()
    @CreateDateColumn()
    @Index()
    createdAt!: Date;
}
