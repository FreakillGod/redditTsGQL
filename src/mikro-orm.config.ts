import { Post } from "./entities/Post"
import { __prod__ } from "./constants"
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";

export default {
    allowGlobalContext:true,
    migrations: {
        path: path.join(__dirname, './migrations'),
        glob: '!(*.d).{js,ts}',
    },
    entities: [Post, User],
    dbName: "lireddit",
    user: "postgres",
    password: "admin",
    debug: !__prod__,
    type: "postgresql",
} as Parameters<typeof MikroORM.init>[0];
