import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from "argon2";

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
    @Mutation(() => USerResponse)
    async register(@Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
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
        const user = em.create(User, { username: options.username, password: hashedPass })
        try {
            await em.persistAndFlush(user)

        } catch (error: any) {
            if(error.code === "23505"){
                return {
                    errors:[{
                        field:"username",
                        message:"username already exist "
                    }]
                }
            }
            console.log('error', error)
        }
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

        req.session.userId= user.id;

        return {
            user
        };
    }

}
