import { createHash } from "crypto";
import { LocalDate } from "mx-tool";
import { ErrorCode } from "../../../defines/defines";
import { UnitRole } from "./role";

export class GameRoleService {

    static init() {
        return UnitRole.init();
    }

    /**------------------------------------------------------通用函数------------------------------------------------------------- */
    // 登录
    static async login(gameId: string, uid: string, unionid: string, openid: string, session_key: string, version: string, inviterId: string, nickName: string = "", avatarUrl: string = "", activityId: string = "", activityStartTime: number = 0, activityEndTime: number = 0) {

        nickName = nickName ? nickName : "";
        avatarUrl = avatarUrl ? avatarUrl : "";
        activityId = activityId ? activityId : "";
        activityStartTime = activityStartTime ? activityStartTime : 0;
        activityEndTime = activityEndTime ? activityEndTime : 0;

        try {
            let data = await UnitRole.getRole(gameId);

            // 更新seesionKey
            data.role.session_key = session_key;

            // 更新头像是昵称
            if (nickName !== "") {
                data.role.nickName = nickName;
            }
            if (avatarUrl !== "") {
                data.role.avatarUrl = avatarUrl;
            }

            // 更新活动时间数据
            data.role.activityId = activityId;

            return GameRoleService._loadSucc(gameId, data.role, version, inviterId)
        }
        catch (e) {
            if (e.code == ErrorCode.role_no) {
                let data = await UnitRole.registRole(gameId, uid, unionid, openid, session_key, version, inviterId, nickName, avatarUrl, activityId, activityStartTime, activityEndTime);
                return GameRoleService._loadSucc(gameId, data.role, version, inviterId);
            } else {
                // 失败的时候
                throw ({ code: ErrorCode.login_error, errMsg: e.errMsg || e.message || "" });
            }
        }
    }


    // 玩家登录成功后的消息推送
    private static async _loadSucc(gameId: string, role: UnitRole, version: string, inviterId: string) {
        // 设置一个token 后续通过token来判断登录状态
        let token = createHash("md5").update('' + Date.now() + gameId + role.session_key).digest("hex");
        role.dbInfo.set('token', token);
        try {
            await role.dbInfo.force_save();
        }
        catch (e) {
            console.error('_loadSucc', e);
            throw { code: ErrorCode.db_error, errMsg: "db is error" };
        }

        // 登录前的流程处理
        await role.beforeLogin(inviterId);

        // 登录后流程处理
        this.afterLogin(role);

        return { code: ErrorCode.ok, role: role.toClient(), token: token, localTime: LocalDate.now(), lastSaveTime: role.get("lastSaveTime") };
    }


    // 登录后流程
    private static afterLogin(role: UnitRole): void {
        // 更新玩家登录时间
        role.lastLoginTime = LocalDate.now();

        // 新号标记
        let isNew: boolean = role.isNew;
        if (isNew) {
            role.isNew = false;
        }
    }


    // 移除缓存(供广播其他服务使用)
    static removeRole(gameId: string) {
        UnitRole.delRoleCache(gameId);
    }


    /**------------------------------------------------------流程函数------------------------------------------------------------- */

}