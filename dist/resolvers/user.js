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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = exports.UsernamePasswordInput = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String)
], UsernamePasswordInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String)
], UsernamePasswordInput.prototype, "password", void 0);
UsernamePasswordInput = __decorate([
    (0, type_graphql_1.InputType)()
], UsernamePasswordInput);
exports.UsernamePasswordInput = UsernamePasswordInput;
let FlieldError = class FlieldError {
};
__decorate([
    (0, type_graphql_1.Field)(() => String)
], FlieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String)
], FlieldError.prototype, "message", void 0);
FlieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FlieldError);
let USerResponse = class USerResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FlieldError], { nullable: true })
], USerResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true })
], USerResponse.prototype, "user", void 0);
USerResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], USerResponse);
let UserResolver = class UserResolver {
    register(options, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.username.length <= 2) {
                return {
                    errors: [{
                            field: "username",
                            message: "length must be greater than 3"
                        }]
                };
            }
            if (options.password.length <= 2) {
                return {
                    errors: [{
                            field: "password",
                            message: "password length must be greater than 3"
                        }]
                };
            }
            const hashedPass = yield argon2_1.default.hash(options.password);
            const user = em.create(User_1.User, { username: options.username, password: hashedPass });
            try {
                yield em.persistAndFlush(user);
            }
            catch (error) {
                if (error.code === "23505") {
                    return {
                        errors: [{
                                field: "username",
                                message: "username already exist "
                            }]
                    };
                }
                console.log('error', error);
            }
            return { user };
        });
    }
    login(options, { em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { username: options.username.toLowerCase() });
            if (!user) {
                return {
                    errors: [{
                            field: "username",
                            message: "could not find username"
                        }]
                };
            }
            const valid = yield argon2_1.default.verify(user.password, options.password);
            if (!valid) {
                return {
                    errors: [{
                            field: "username",
                            message: "password is incorrect"
                        }]
                };
            }
            req.session.userId = user.id;
            return {
                user
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => USerResponse),
    __param(0, (0, type_graphql_1.Arg)('options', () => UsernamePasswordInput)),
    __param(1, (0, type_graphql_1.Ctx)())
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => USerResponse),
    __param(0, (0, type_graphql_1.Arg)('options', () => UsernamePasswordInput)),
    __param(1, (0, type_graphql_1.Ctx)())
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
