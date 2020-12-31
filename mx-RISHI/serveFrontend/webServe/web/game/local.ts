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
     * @param {string} optionStr.query.required - 操作 eg:add-增 use-用 get-查(get/all add/k1:1,k2:2)
     * @returns {{code:number}} 0 - 返回成功
     */
    @WebRouteModule.route()
    @WebRouteModule.paramRequired("gameId", "string", true)
    @WebRouteModule.paramOptional("token", "string", true)
    @WebRouteModule.paramOptional("optionStr", "string", true)
    async itemsOption(param: { gameId: string, token: string, optionStr: string }) {
        return await gameRPC.inst.itemsOption(param.gameId, param.token, param.optionStr);
    }


}