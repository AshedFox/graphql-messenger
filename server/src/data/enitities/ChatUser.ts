import {ChatUserStatus} from "./ChatUserStatus";
import {ChatUserRole} from "./ChatUserRole";
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
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {Chat} from "./Chat";
import {User} from "./User";


@ObjectType()
@Entity()
export class ChatUser extends BaseEntity {
    @PrimaryColumn()
    chatId!: string;

    @Field(() => Chat)
    @ManyToOne(() => Chat)
    @JoinColumn({name: "chatId"})
    chat!: Chat;

    @PrimaryColumn()
    userId!: string;

    @Field(() => User)
    @ManyToOne(() => User)
    @JoinColumn({name: "userId"})
    user!: User;

    @Field(() => ChatUserStatus)
    @Column({type: Number, enum: ChatUserStatus, default: ChatUserStatus.DEFAULT})
    @Index()
    status!: ChatUserStatus;

    @Field(() => ChatUserRole)
    @Column({type: String, enum: ChatUserRole, default: ChatUserRole.DEFAULT})
    @Index()
    role!: ChatUserRole;

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

    @AfterSoftRemove()
    async updateStatusOnSoftRemove() {
        this.status |= ChatUserStatus.LEAVED;
    }

    @AfterRecover()
    async updateStatusOnRecover() {
        this.status &= ~ChatUserStatus.LEAVED;
    }
}
