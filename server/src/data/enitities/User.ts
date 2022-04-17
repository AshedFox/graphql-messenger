import {UserStatus} from "./UserStatus";
import {Field, ID, ObjectType} from "type-graphql";
import {
    BaseEntity, AfterSoftRemove,
    Column,
    CreateDateColumn, DeleteDateColumn, Entity, JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn, AfterRecover
} from "typeorm";
import {File} from "./File";
import {RefreshToken} from "./RefreshToken";


@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column({unique: true})
    email!: string;

    @Column()
    password!: string;

    @Field()
    @Column()
    name!: string;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;

    @Field({nullable: true})
    @DeleteDateColumn()
    deletedAt?: Date;

    @Field(() => UserStatus)
    @Column({type: Number, enum: UserStatus, default: UserStatus.DEFAULT})
    status!: UserStatus;

    @Column({nullable: true})
    avatarId?: string;

    @Field(() => File, {nullable: true})
    @ManyToOne(() => File, {nullable: true})
    @JoinColumn({name: "avatarId"})
    avatar?: File;

    @OneToMany(() => RefreshToken, token => token.user)
    tokens!: RefreshToken[];

    @AfterSoftRemove()
    async updateStatusOnSoftRemove() {
        this.status |= UserStatus.DELETED;
    }

    @AfterRecover()
    async updateStatusOnRecover() {
        this.status &= ~UserStatus.DELETED;
    }
}

