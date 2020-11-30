import { createHash } from "crypto";
import { WebRouteModule } from "mx-webserve";
import { ErrorCode } from "../../../../defines/defines";
import { makeGameSing } from "../../../../lib/makeGameSing";
import { gameRPC } from "../../../../rpcs/gameRPC"

@WebRouteModule.class(module)
class web {
    /**
    * 登录(测试用)
    * @route POST /game/local/login
    * @group login - 登录模块
    * @param {string} name.query.required - 名字
    * @returns {code:number} 0 - 返回内容 
    */
    @WebRouteModule.route()
    @WebRouteModule.paramRequired("name", "string", true)
    async login(param: { [key: string]: string }) {
        return new Promise(function (resolve, reject) {
            let data = {
                code: 0,
                uid: '100001',
                gameId: createHash('md5').update(param.name).digest('hex'),
                account: param.name,
                openid: '',
                session_key: '',
                version: param.activeId || 'test',
            };
            gameRPC.inst
                .login(data.gameId, data.uid, data.account, data.openid, data.session_key, data.version, 'inviterId', param.name, "avatar", 'test', 0, 10)
                .then(resolve)
                .catch(reject)
        })

    }

    /**
     * 登录检查(正式项目使用)
     * @route POST /game/local/loginCheck
     * @group login - 登录模块
     * @param {object} info.query.required - 拉起游戏的时候 sdk 给的验证信息 
     * @returns {code:number} 0 - 返回内容 
     */
    @WebRouteModule.route()
    @WebRouteModule.paramRequired("info", "object", true)
    loginCheck(param: { [key: string]: any }) {
        // 这一块需要平台提供
        let info = param.info as {
            appId: string,
            userId: string,
            activeId: string,
            time: string,
            pltId: string,
            unionId: string,
            openId: string,
            session_key: string,
            sign: string,
            avatar: string,
            nickname: string,
            startTime: number,
            endTime: number
        }

        if (makeGameSing(info) != info.sign) {
            throw ({ code: ErrorCode.login_error, errMsg: "sign is wrong" });
        }

        let data = {
            code: 0,
            uid: info.pltId,
            gameId: info.userId,
            account: info.unionId,
            openid: info.openId,
            session_key: info.session_key,
            version: info.activeId,
        }

        return gameRPC.inst.login(data.gameId, data.uid, data.account, data.openid, data.session_key, data.version, param.inviterId, info.nickname || "", info.avatar, info.activeId, info.startTime, info.endTime);
    }
}