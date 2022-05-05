import {Field, ID, ObjectType} from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User";
import {Chat} from "./Chat";
import {Length} from "class-validator";
import {MessageFile} from "./MessageFile";


@ObjectType()
@Entity()
export class Message extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column()
    @Length(1, 5000)
    @Index()
    text!: string;

    @Field()
    @CreateDateColumn()
    @Index()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    @Index()
    updatedAt!: Date;

    @Field({nullable: true})
    @DeleteDateColumn()
    deletedAt?: Date;

    @Column({nullable: true})
    replyToId?: string;

    @Field(() => Message, {nullable: true})
    @ManyToOne(() => Message, {nullable: true})
    @JoinColumn({name: "replyToId"})
    replyTo?: Message;

    @Column()
    senderId!: string;

    @Field(() => User)
    @ManyToOne(() => User)
    @JoinColumn({name: "senderId"})
    sender!: User

    @Column()
    chatId!: string;

    @Field(() => Chat)
    @ManyToOne(() => Chat, chat => chat.messages)
    @JoinColumn({name: "chatId"})
    chat!: Chat;

    @Field(() => [MessageFile])
    @OneToMany(() => MessageFile, messageFile => messageFile.messageId)
    @JoinColumn()
    attachments!: MessageFile[];
}

