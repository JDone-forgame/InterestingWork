"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const mx_webserve_1 = require("mx-webserve");
const gameRPC_1 = require("../../../../rpcs/gameRPC");
let local = class local {
    // *这里提供给 web 的接口
    /**
     * 测试登录
     * @route post /game/local/login
     * @group main - 基础信息
     * @param {string} name.query.required - 用户姓名
     * @param {string} password.query.required - 用户密码
     * @returns {{code:number}} 0 - 返回成功
     */
    async login(param) {
        let loginInfo = {
            gameId: crypto_1.createHash('md5').update(param.name).digest('hex'),
            password: param.password,
            nickName: param.name,
        };
        return await gameRPC_1.gameRPC.inst.login(loginInfo);
    }
    /**
     * 道具操作
     * @route post /game/local/itemsOption
     * @group main - 基础信息
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - 令牌
     * @param {string} optionStr.query.required - 操作 eg:add-增 use-用 get-查(get|all add|k1:1,k2:2)
     * @returns {{code:number}} 0 - 返回成功
     */
    async itemsOption(param) {
        return await gameRPC_1.gameRPC.inst.itemsOption(param.gameId, param.token, param.optionStr);
    }
    /**
     * 机缘事件
     * @route post /game/local/luckChance
     * @group main - 基础信息
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - 令牌
     * @param {number} type.query.required - 机缘类型
     * @param {number} count.query.required - 机缘次数
     * @returns {{code:number}} 0 - 返回成功
     */
    async luckChance(param) {
        return await gameRPC_1.gameRPC.inst.luckChance(param.gameId, param.token, param.type, param.count);
    }
};
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("name", "string", true),
    mx_webserve_1.WebRouteModule.paramOptional("password", "string", true)
], local.prototype, "login", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("gameId", "string", true),
    mx_webserve_1.WebRouteModule.paramOptional("token", "string", true),
    mx_webserve_1.WebRouteModule.paramOptional("optionStr", "string", true)
], local.prototype, "itemsOption", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("gameId", "string", true),
    mx_webserve_1.WebRouteModule.paramOptional("token", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("type", "number", true),
    mx_webserve_1.WebRouteModule.paramRequired("count", "number", true)
], local.prototype, "luckChance", null);
local = __decorate([
    mx_webserve_1.WebRouteModule.class(module)
], local);
//# sourceMappingURL=local.js.map