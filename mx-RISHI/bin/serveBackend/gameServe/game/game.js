"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const crypto_1 = require("crypto");
const define_1 = require("../../../defines/define");
const role_1 = require("../../../defines/role");
const role_2 = require("../role/role");
class GameService {
    static init() {
    }
    // 登录
    static async login(loginInfo) {
        try {
            let data = await role_2.UnitRole.getRole(loginInfo.gameId);
            if ((loginInfo.password != data.role.password) || data.role.password == '') {
                // 登录不成功
                throw { code: define_1.ErrorCode.LOGIN_FAILED, errMsg: 'password is wrong!' };
            }
            return GameService._loadSucc(loginInfo.gameId, data.role);
        }
        catch (e) {
            if (e.code == define_1.ErrorCode.NO_ROLE) {
                // 说明用户需要注册
                let regInfo = {
                    gameId: loginInfo.gameId,
                    password: loginInfo.password,
                    nickName: loginInfo.nickName,
                };
                let data = await role_2.UnitRole.registRole(regInfo);
                return GameService._loadSucc(loginInfo.gameId, data.role);
            }
            else {
                // 其他错误
                return { code: define_1.ErrorCode.LOGIN_FAILED, errMsg: e.errMsg ? e.errMsg : 'login failed!' };
            }
        }
    }
    // 玩家登录成功后的消息推送
    static async _loadSucc(gameId, role) {
        let nowTime = Date.now();
        // 设置用户一个token,后续通过token来判断登录状态
        let token = crypto_1.createHash("md5").update('' + nowTime + gameId).digest("hex");
        role.dbInfo.set('token', token);
        try {
            await role.dbInfo.force_save();
        }
        catch (e) {
            throw { code: define_1.ErrorCode.DB_ERROR, errMsg: "db is error!" };
        }
        // 登录前流程处理
        await role.beforeLogin();
        // 登录后流程处理
        this.afterLogin(role);
        return { code: define_1.ErrorCode.OK, role: role.toClient(), token: token, localTime: nowTime };
    }
    // 登录后流程处理
    static afterLogin(role) {
        // 刷新修炼信息
        role.refreshPractice();
    }
    // 移除缓存(供广播其他服务器使用)
    static removeRole(gameId) {
        role_2.UnitRole.delRoleCache(gameId);
    }
    // 道具操作 add/增 use/用 get/查
    static async itemsOption(gameId, token, optionStr) {
        // 获取对象
        let gData = await role_2.UnitRole.getRole(gameId, token);
        if (!gData) {
            return { code: define_1.ErrorCode.NO_ROLE, errMsg: 'can not find player!' };
        }
        let role = gData.role;
        // 分解指令代码
        let options = optionStr.split('|');
        if (!optionStr || options.length < 2) {
            return { code: define_1.ErrorCode.ITEM_OPTION_FAILED, errMsg: 'optionStr is wrong!' };
        }
        // 执行指令
        switch (options[0]) {
            // 查
            case 'get':
                if (options[1] != 'all') {
                    return { code: define_1.ErrorCode.OK, playerItems: role.getItemCount(options[1]) };
                }
                break;
            // 增
            case 'add':
                let items = options[1].split(',');
                if (items.length >= 1) {
                    for (let item of items) {
                        let iInfo = item.split(':');
                        role.updateItem(iInfo[0], parseInt(iInfo[1]) || 1, role_1.eUType.add);
                    }
                }
                break;
            // 用
            case 'use':
                return role.useItem(options[1], parseInt(options[2]) || 1);
            default:
                break;
        }
        role.refreshPractice();
        return { code: define_1.ErrorCode.OK, playerItems: role.playerItems };
    }
}
exports.GameService = GameService;
//# sourceMappingURL=game.js.map