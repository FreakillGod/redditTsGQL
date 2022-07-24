import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import express from "express";
import microConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";
import { UserResolver } from "./resolvers/user";
import cors from "cors";
// import * as redis from "redis";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// import connectRedis from "connect-redis";
// import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  const app = express();

  // const RedisStore = connectRedis(session);
  // const redisClient = redis.createClient() as any;
  // await redisClient.connect();
  // console.log("redis connected",redisClient.isOpen);

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: "qid",
      // store: new RedisStore({
      //   client: redisClient,
      //   disableTouch: true,
      //   disableTTL: true,
      // }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, //1year
        httpOnly: true,
        sameSite: "lax", //protecting csrf
        // secure:__prod__  //cookie only works in https
      },
      secret: "hellovikash",
      resave: false,
      saveUninitialized: true,
    })
  );

  const apolloserver = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  await apolloserver.start();

  apolloserver.applyMiddleware({
    app,
    cors: { origin: false },
  });

  // app.get("/",(_,res)=>{
  //   res.send("ehllo")
  // })

  app.listen(4000, () => console.log("server is running on port 4000"));

  // const emFork= orm.em.fork();

  // const post = emFork.create(Post, { title: "My first post" });
  // await emFork.persistAndFlush(post);

  //   await orm.em.nativeInsert(Post, { title: "My first post" });
  //native cannot initsiate the values in class dont usse it you are noob

  // const posts= await emFork.find(Post,{});

  // console.log('posts', posts)
};

main().catch((err) => console.log("err", err));
