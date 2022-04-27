import {Field, ID, ObjectType} from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User";
import {Chat} from "./Chat";
import {File} from "./File";
import {Length} from "class-validator";


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

    @Field(() => [File])
    @ManyToMany(() => File)
    @JoinTable()
    attachments!: File[];
}

