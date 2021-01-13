import { createHash } from "crypto";
import { WebRouteModule } from "mx-webserve";
import { ifLoginInfo } from "../../../../defines/role";
import { gameRPC } from "../../../../rpcs/gameRPC";

@WebRouteModule.class(module)
class local {
    // *这里提供给 web 的接口


    /**
     * 测试登录
     * @route post /game/local/login
     * @group main - 基础信息
     * @param {string} name.query.required - 用户姓名
     * @param {string} password.query.required - 用户密码
     * @returns {{code:number}} 0 - 返回成功
     */
    @WebRouteModule.route()
    @WebRouteModule.paramRequired("name", "string", true)
    @WebRouteModule.paramOptional("password", "string", true)
    async login(param: { name: string, password: string }) {
        let loginInfo: ifLoginInfo = {
            gameId: createHash('md5').update(param.name).digest('hex'),
            password: param.password,
            nickName: param.name,
        }

        return await gameRPC.inst.login(loginInfo);
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
    @WebRouteModule.route()
    @WebRouteModule.paramRequired("gameId", "string", true)
    @WebRouteModule.paramOptional("token", "string", true)
    @WebRouteModule.paramOptional("optionStr", "string", true)
    async itemsOption(param: { gameId: string, token: string, optionStr: string }) {
        return await gameRPC.inst.itemsOption(param.gameId, param.token, param.optionStr);
    }

    /**
     * 机缘事件
     * @route post /game/local/luckChance
     * @group main - 基础信息
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - 令牌
     * @param {string} type.query.required - 机缘类型
     * @param {number} count.query.required - 机缘次数
     * @returns {{code:number}} 0 - 返回成功
     */
    @WebRouteModule.route()
    @WebRouteModule.paramRequired("gameId", "string", true)
    @WebRouteModule.paramOptional("token", "string", true)
    @WebRouteModule.paramRequired("type", "string", true)
    @WebRouteModule.paramRequired("count", "number", true)
    async luckChance(param: { gameId: string, token: string, type: string, count: number }) {
        return await gameRPC.inst.luckChance(param.gameId, param.token, param.type, param.count);
    }

    /**
     * 脱下装备
     * @route post /game/local/takeOffEquip
     * @group main - 基础信息
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - 令牌
     * @param {string} location.query.required - 装备位置
     * @returns {{code:number}} 0 - 返回成功
     */
    @WebRouteModule.route()
    @WebRouteModule.paramRequired("gameId", "string", true)
    @WebRouteModule.paramOptional("token", "string", true)
    @WebRouteModule.paramRequired("location", "string", true)
    async takeOffEquip(param: { gameId: string, token: string, location: string }) {
        return await gameRPC.inst.takeOffEquip(param.gameId, param.token, param.location);
    }

    /**
     * 进入副本
     * @route post /game/local/enterFightRoom
     * @group main - 基础信息
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - 令牌
     * @param {string} roomId.query.required - 副本id
     * @param {string} attitude.query.required - 玩家态度
     * @returns {{code:number}} 0 - 返回成功
     */
    @WebRouteModule.route()
    @WebRouteModule.paramRequired("gameId", "string", true)
    @WebRouteModule.paramOptional("token", "string", true)
    @WebRouteModule.paramRequired("roomId", "string", true)
    @WebRouteModule.paramRequired("attitude", "string", true)
    async enterFightRoom(param: { gameId: string, token: string, roomId: string, attitude: string }) {
        return await gameRPC.inst.enterFightRoom(param.gameId, param.token, param.roomId, param.attitude);
    }
}