import {UserStatus} from "./UserStatus";
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
import {IsEmail, Length, MaxLength} from "class-validator";
import {File} from "./File";
import {RefreshToken} from "./RefreshToken";


@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @IsEmail()
    @Column({unique: true})
    email!: string;

    @Column()
    @MaxLength(72)
    password!: string;

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

    @Field(() => UserStatus)
    @Column({type: Number, enum: UserStatus, default: UserStatus.DEFAULT})
    @Index()
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

