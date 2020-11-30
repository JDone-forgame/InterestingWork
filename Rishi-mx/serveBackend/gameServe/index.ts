import { RPCHandle } from "mx-rpc";
import { GameRoleService } from "./gamerole"

@RPCHandle.class('game', module)
class game {

    @RPCHandle.init()
    public init(): boolean {

        return true;
    }

    /**
     * 登陆游戏
     * @route request login
     * @group game - 游戏模块
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} uid.query.required - 数字id
     * @param {string} unionid.query.required - unionid
     * @param {string} openid.query.required - openid
     * @param {string} session_key.query.required - sessionkey
     * @param {string} version.query.required - 版本
     * @param {string} inviterId.query.required - 邀请id
     * @param {string} nickName.query - 昵称
     * @param {string} avatarUrl.query - 头像
     * @param {string} activityId.query - 活动id
     * @param {number} activityStartTime.query - 开始时间
     * @param {number} activityEndTime.query - 结束时间
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    @RPCHandle.route()
    login(gameId: string, uid: string, unionid: string, openid: string, session_key: string, version: string, inviterId: string, nickName: string = "", avatarUrl: string = "", activityId: string = "", activityStartTime: number = 0, activityEndTime: number = 0) {
        return GameRoleService.login(gameId, uid, unionid, openid, session_key, version, inviterId, nickName, avatarUrl, activityId, activityStartTime, activityEndTime);
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
        GameRoleService.removeRole(gameId);
    }

}
