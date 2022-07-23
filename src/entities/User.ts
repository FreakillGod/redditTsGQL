import "reflect-metadata"
import { PrimaryKey, Entity, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
    @Field(()=>Int)
    @PrimaryKey({ type: 'number' })
    id!: number;

    @Field(()=>String)
    @Property({ type: 'date' })
    createAt?: Date = new Date();

    @Field(()=>String)
    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt?: Date = new Date();

    @Field(()=>String)
    @Property({ type: 'text', unique:true})
    username!: string;

    // @Field(()=>String)   commented to not et user select the password
    @Property({ type: 'text'})
    password!: string;

}
