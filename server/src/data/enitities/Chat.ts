import {ChatStatus} from "./ChatStatus";
import {ChatAccess} from "./ChatAccess";
import {Field, ID, ObjectType} from "type-graphql";
import {
    AfterRecover,
    AfterSoftRemove,
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
import {Message} from "./Message";
import {ChatUser} from "./ChatUser";
import {File} from "./File";
import {IsUrl, Length} from "class-validator";


@ObjectType()
@Entity()
export class Chat extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column()
    @Length(3, 200)
    @Index()
    name!: string;

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

    @Field(() => ChatStatus)
    @Column({type: Number, enum: ChatStatus, default: ChatStatus.DEFAULT})
    @Index()
    status!: ChatStatus;

    @Field(() => ChatAccess)
    @Column({type: String, enum: ChatAccess, default: ChatAccess.PUBLIC})
    @Index()
    access!: ChatAccess;

    @Field({nullable: true})
    lastSeen?: Date;

    @Field({nullable: true})
    @Column({nullable: true})
    @IsUrl()
    inviteUrl?: string;

    @Column({nullable: true})
    avatarId?: string;

    @Field(() => File, {nullable: true})
    @ManyToOne(() => File, {nullable: true})
    @JoinColumn({name: "avatarId"})
    avatar?: File;

    @Column()
    creatorId!: string;

    @Field(() => User)
    @ManyToOne(() => User)
    @JoinColumn({name: "creatorId", referencedColumnName: "id"})
    creator!: User;

    @Field(() => [ChatUser])
    @OneToMany(() => ChatUser, chatUser => chatUser.chat)
    users!: ChatUser[];

    @Field(() => Message, {nullable: true})
    lastMessage?: Message;

    @Field(() => [Message])
    @OneToMany(() => Message, message => message.chat)
    messages!: Message[];

    @AfterSoftRemove()
    async updateStatusOnSoftRemove() {
        this.status |= ChatStatus.DELETED;
    }

    @AfterRecover()
    async updateStatusOnRecover() {
        this.status &= ~ChatStatus.DELETED;
    }
}

