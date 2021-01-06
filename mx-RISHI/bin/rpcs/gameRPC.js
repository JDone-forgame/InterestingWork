"use strict";
/**
 * this is a auto create file
 * 这是一个自动生成的文件,最好不要直接改动这个文件
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRPC = void 0;
const nodesocket_1 = require("./nodesocket");
class localgameRPC extends nodesocket_1.RequestRPC {
    /**
     *
登录
     * @param {object} loginInfo 登录信息
     */
    login(loginInfo) {
        let query = {
            loginInfo: loginInfo
        };
        let body = {};
        return this.request("request", "login", Object.assign(query, body), "loginInfo".split(","), "name");
    }
    /**
     *
从内存中移除角色数据
     * @param {string} gameId 玩家id
     */
    bcRemoveRole(gameId) {
        let query = {
            gameId: gameId
        };
        let body = {};
        return this.request("broadcast", "bcRemoveRole", Object.assign(query, body), "gameId".split(","), "gameId");
    }
    /**
     *
道具操作
     * @param {string} gameId 玩家id
     * @param {string} token 令牌
     * @param {string} optionStr 操作 eg:add-增 use-用 get-查(get/all add/k1:1,k2:2)
     */
    itemsOption(gameId, token, optionStr) {
        let query = {
            gameId: gameId,
            token: token,
            optionStr: optionStr
        };
        let body = {};
        return this.request("request", "itemsOption", Object.assign(query, body), "gameId,token,optionStr".split(","), "gameId");
    }
    /**
     *
机缘事件
     * @param {string} gameId 玩家id
     * @param {string} token 令牌
     * @param {string} type 机缘类型
     * @param {number} count 机缘次数
     */
    luckChance(gameId, token, type, count) {
        let query = {
            gameId: gameId,
            token: token,
            type: type,
            count: count
        };
        let body = {};
        return this.request("request", "luckChance", Object.assign(query, body), "gameId,token,type,count".split(","), "gameId");
    }
}
class gameRPC {
    static async rpc_init(srv) {
        if (!this._inst)
            this._inst = new localgameRPC("game", srv);
        return true;
    }
    static get inst() {
        if (!this._inst)
            throw ("need call rpc_init first game");
        return this._inst;
    }
}
exports.gameRPC = gameRPC;
//# sourceMappingURL=gameRPC.js.map