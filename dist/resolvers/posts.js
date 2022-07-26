"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const Post_1 = require("../entities/Post");
const type_graphql_1 = require("type-graphql");
let PostResolver = class PostResolver {
    posts({ em }) {
        return em.fork().find(Post_1.Post, {});
    }
    post(id, { em }) {
        return em.fork().findOne(Post_1.Post, { id });
    }
    createPost(title, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = em.fork().create(Post_1.Post, { title });
            yield em.fork().persistAndFlush(post);
            return post;
        });
    }
    updatePost(id, title, //optional update
    { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield em.findOne(Post_1.Post, { id });
            if (!post) {
                return null;
            }
            if (typeof title !== "undefined") {
                post.title = title;
                yield em.fork().persistAndFlush(post);
            }
            return post;
        });
    }
    DeletePost(id, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield em.nativeDelete(Post_1.Post, { id });
            if (post) {
                return true;
            }
            return false;
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Post_1.Post]),
    __param(0, (0, type_graphql_1.Ctx)())
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => Post_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)())
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post_1.Post),
    __param(0, (0, type_graphql_1.Arg)('title', () => String)),
    __param(1, (0, type_graphql_1.Ctx)())
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('title', () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Ctx)())
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('id', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)())
], PostResolver.prototype, "DeletePost", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PostResolver);
exports.PostResolver = PostResolver;
