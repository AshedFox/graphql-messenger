import {FileType} from "./FileType";
import {Field, ID, ObjectType} from "type-graphql";
import {BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {IsUrl} from "class-validator";

@ObjectType()
@Entity()
export class File extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column()
    originalName!: string;

    @Field()
    @Column()
    @IsUrl()
    url!: string;

    @Field()
    @Column()
    @Index()
    size!: number;

    @Field(() => FileType)
    @Column({type: String, enum: FileType})
    @Index()
    type!: FileType;

    @Field()
    @CreateDateColumn()
    @Index()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    @Index()
    updatedAt!: Date;
}
