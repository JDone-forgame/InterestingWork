import { RPCHandle } from "mx-rpc";
import { ErrorCode } from "../../defines/define";
import { ifLoginInfo } from "../../defines/role";
import { GameService } from "./game/game";

@RPCHandle.class("game", module)
class _ {
    /**
     * 登录
     * @route request login
     * @group game - 游戏流程
     * @key name
     * @param {object} loginInfo.query.required - 登录信息
     * @returns {{code:number}} 0 
     */
    @RPCHandle.route()
    login(loginInfo: ifLoginInfo) {
        return GameService.login(loginInfo);
    }


    /**
     * 从内存中移除角色数据
     * @route broadcast bcRemoveRole
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    @RPCHandle.route()
    bcRemoveRole(gameId: string) {
        GameService.removeRole(gameId);
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
    @RPCHandle.route()
    itemsOption(gameId: string, token: string, optionStr: string) {
        return GameService.itemsOption(gameId, token, optionStr);
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
    @RPCHandle.route()
    luckChance(gameId: string, token: string, type: string, count: number) {
        return GameService.luckChance(gameId, token, type, count);
    }

    /**
     * 脱下装备
     * @route request takeOffEquip
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - 令牌
     * @param {string} location.query.required - 装备位置
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    @RPCHandle.route()
    takeOffEquip(gameId: string, token: string, location: string) {
        return GameService.takeOffEquip(gameId, token, location);
    }

    /**
     * 进入副本
     * @route request enterFightRoom
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - 令牌
     * @param {string} roomId.query.required - 副本id
     * @param {string} attitude.query.required - 玩家态度
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    @RPCHandle.route()
    enterFightRoom(gameId: string, token: string, roomId: string, attitude: string) {
        return GameService.enterFightRoom(gameId, token, roomId, attitude);
    }

}