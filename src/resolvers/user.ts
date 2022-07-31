import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql"
import { COOKIE_NAME } from "../constants";

@InputType()
export class UsernamePasswordInput {
    @Field(() => String)
    username!: string
    @Field(() => String)
    password!: string
}

@ObjectType()
class FlieldError {
    @Field(() => String)
    field!: string;
    @Field(() => String)
    message!: string;
}

@ObjectType()
class USerResponse {

    @Field(() => [FlieldError], { nullable: true })
    errors?: FlieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { req, em }: MyContext
    ) {
        //when no user
        if (!req?.session.userId) {
            console.log(req?.session)
            return null
        }
        console.log(req?.session)
        const user = await em.fork().findOne(User, { id: req.session.userId })
        return user;
    }

    @Mutation(() => USerResponse)
    async register(@Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<USerResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [{
                    field: "username",
                    message: "length must be greater than 3"
                }]
            }
        }
        if (options.password.length <= 2) {
            return {
                errors: [{
                    field: "password",
                    message: "password length must be greater than 3"
                }]
            }
        }
        const hashedPass = await argon2.hash(options.password)
        // const user = em.create(User, { username: options.username, password: hashedPass })  //using orm
        let user;
        try {
            const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({             // using querybuilder of nest js
                username: options.username,
                password: hashedPass,
                updated_at: new Date(),
                create_at: new Date(),
            }).returning("*");
            user = result[0];
            // await em.persistAndFlush(user);
        } catch (error: any) {
            if (error.code === "23505") {
                return {
                    errors: [{
                        field: "username",
                        message: "username already exist "
                    }]
                }
            }
            console.log('error', error)
        }
        //add cookie
        req.session.userId = user.id;

        return { user };
    }

    @Mutation(() => USerResponse)
    async login(@Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<USerResponse> {
        const user = await em.findOne(User, { username: options.username.toLowerCase() })
        if (!user) {
            return {
                errors: [{
                    field: "username",
                    message: "could not find username"
                }]
            }
        }
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [{
                    field: "username",
                    message: "password is incorrect"
                }]
            }
        }

        req.session.userId = user.id;

        return {
            user
        };
    }

    @Mutation(() => Boolean)
    logOut(
        @Ctx() { req, res }: MyContext
    ) {
        return new Promise(resolve => req.session.destroy(err => {
            console.log("logout is called")
            res.clearCookie(COOKIE_NAME, { domain: "localhost", path: "/", httpOnly:true, sameSite:"lax"})
            if (err) {
                console.log("err",err)
                return resolve(false)
            }
            resolve(true)
        }))
    }

}
