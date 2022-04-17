import {FileType} from "./FileType";
import {Field, ID, ObjectType} from "type-graphql";
import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

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
    url!: string;

    @Field()
    @Column()
    size!: number;

    @Field(() => FileType)
    @Column({type: String, enum: FileType})
    type!: FileType;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;
}
