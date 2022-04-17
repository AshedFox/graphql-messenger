import {ChatUserStatus} from "./ChatUserStatus";
import {ChatUserRole} from "./ChatUserRole";
import {BaseEntity, AfterSoftRemove, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, AfterRecover} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Chat} from "./Chat";
import {User} from "./User";
import {ChatStatus} from "./ChatStatus";


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
    status!: ChatUserStatus;

    @Field(() => ChatUserRole)
    @Column({type: String, enum: ChatUserRole, default: ChatUserRole.DEFAULT})
    role!: ChatUserRole;

    @AfterSoftRemove()
    async updateStatusOnSoftRemove() {
        this.status |= ChatUserStatus.LEAVED;
    }

    @AfterRecover()
    async updateStatusOnRecover() {
        this.status &= ~ChatUserStatus.LEAVED;
    }
}
