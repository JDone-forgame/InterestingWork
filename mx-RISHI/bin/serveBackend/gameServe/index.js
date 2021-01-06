"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mx_rpc_1 = require("mx-rpc");
const game_1 = require("./game/game");
let _ = class _ {
    /**
     * 登录
     * @route request login
     * @group game - 游戏流程
     * @key name
     * @param {object} loginInfo.query.required - 登录信息
     * @returns {{code:number}} 0
     */
    login(loginInfo) {
        return game_1.GameService.login(loginInfo);
    }
    /**
     * 从内存中移除角色数据
     * @route broadcast bcRemoveRole
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    bcRemoveRole(gameId) {
        game_1.GameService.removeRole(gameId);
    }
    /**
     * 道具操作
     * @route request itemsOption
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - 令牌
     * @param {string} optionStr.query.required - 操作 eg:add-增 use-用 get-查(get/all add/k1:1,k2:2)
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    itemsOption(gameId, token, optionStr) {
        return game_1.GameService.itemsOption(gameId, token, optionStr);
    }
    /**
     * 机缘事件
     * @route request luckChance
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - 令牌
     * @param {string} type.query.required - 机缘类型
     * @param {number} count.query.required - 机缘次数
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    luckChance(gameId, token, type, count) {
        return game_1.GameService.luckChance(gameId, token, type, count);
    }
};
__decorate([
    mx_rpc_1.RPCHandle.route()
], _.prototype, "login", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], _.prototype, "bcRemoveRole", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], _.prototype, "itemsOption", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], _.prototype, "luckChance", null);
_ = __decorate([
    mx_rpc_1.RPCHandle.class("game", module)
], _);
//# sourceMappingURL=index.js.map