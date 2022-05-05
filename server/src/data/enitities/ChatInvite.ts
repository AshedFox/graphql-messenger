import {BaseEntity, Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {Chat} from "./Chat";
import {Field, Int, ObjectType} from "type-graphql";


@ObjectType()
@Entity()
export class ChatInvite extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    chatId!: string;

    @Field(() => Chat)
    @ManyToOne(() => Chat)
    @JoinColumn({name: "chatId"})
    chat!: Chat;

    @Field()
    @Column({unique: true})
    token!: string;

    @Field({nullable: true})
    @Column({nullable: true})
    expiredAt?: Date;

    @Field(() => Int, {nullable: true})
    @Column({nullable: true})
    leftUses?: number;

    @DeleteDateColumn()
    deletedAt?: Date;
}
