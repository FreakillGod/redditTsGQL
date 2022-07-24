"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
// import { Post } from "./entities/Post";
const express_1 = __importDefault(require("express"));
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const posts_1 = require("./resolvers/posts");
const user_1 = require("./resolvers/user");
const cors_1 = __importDefault(require("cors"));
// import * as redis from "redis";
const express_session_1 = __importDefault(require("express-session"));
// import connectRedis from "connect-redis";
// import { MyContext } from "./types";
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const orm = yield core_1.MikroORM.init(mikro_orm_config_1.default);
    yield orm.getMigrator().up();
    const app = (0, express_1.default)();
    // const RedisStore = connectRedis(session);
    // const redisClient = redis.createClient() as any;
    // await redisClient.connect();
    // console.log("redis connected",redisClient.isOpen);
    app.use((0, cors_1.default)({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    app.use((0, express_session_1.default)({
        name: "qid",
        // store: new RedisStore({
        //   client: redisClient,
        //   disableTouch: true,
        //   disableTTL: true,
        // }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365,
            httpOnly: true,
            sameSite: "lax", //protecting csrf
            // secure:__prod__  //cookie only works in https
        },
        secret: "hellovikash",
        resave: false,
        saveUninitialized: true,
    }));
    const apolloserver = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, posts_1.PostResolver, user_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res }),
    });
    yield apolloserver.start();
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
});
main().catch((err) => console.log("err", err));
