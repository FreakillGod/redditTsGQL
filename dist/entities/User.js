"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
require("reflect-metadata");
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
let User = class User {
    constructor() {
        this.createAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, core_1.PrimaryKey)({ type: 'number' })
], User.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: 'date' })
], User.prototype, "createAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: 'date', onUpdate: () => new Date() })
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: 'text', unique: true })
], User.prototype, "username", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text' })
], User.prototype, "password", void 0);
User = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], User);
exports.User = User;
