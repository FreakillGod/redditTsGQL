import { MyContext } from "src/types";
import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(
        @Ctx() { em }: MyContext): Promise<Post[]> {
        return em.fork().find(Post, {})
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg('id', () => Int) id: number,
        @Ctx() { em }: MyContext): Promise<Post | null> {
        return em.fork().findOne(Post, { id })
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title', () => String) title: string,
        @Ctx() { em }: MyContext): Promise<Post> {
        const post = em.fork().create(Post, { title })
        await em.fork().persistAndFlush(post)
        return post
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String, { nullable: true }) title: string,      //optional update
        @Ctx() { em }: MyContext): Promise<Post | null> {
        const post = await em.findOne(Post, { id })
        if (!post) {
            return null;
        }
        if (typeof title !== "undefined") {
            post.title = title;
            await em.fork().persistAndFlush(post)
        }
        return post;
    }

    @Mutation(() => Boolean)
    async DeletePost(
        @Arg('id', () => Int) id: number,
        @Ctx() { em }: MyContext): Promise<boolean> {

        const post = await em.nativeDelete(Post, { id })
        if(post){
            return true;
        }
        return false;
    }



}