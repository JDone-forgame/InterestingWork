import { createHash } from "crypto";
import { ErrorCode } from "../../../defines/define";
import { SeResLuckChance } from "../../../defines/interface";
import { eUType, ifLoginInfo, ifLuckChance, ifPractice, ifRegInfo } from "../../../defines/role";
import { TablesService } from "../../../lib/tables";
import { UnitRole } from "../role/role";

export class GameService {
    static init() {
    }

    // 登录
    static async login(loginInfo: ifLoginInfo) {
        try {
            let data = await UnitRole.getRole(loginInfo.gameId)

            if ((loginInfo.password != data.role.password) || data.role.password == '') {
                // 登录不成功
                throw { code: ErrorCode.LOGIN_FAILED, errMsg: 'password is wrong!' }
            }

            return GameService._loadSucc(loginInfo.gameId, data.role)
        }
        catch (e) {
            if (e.code == ErrorCode.NO_ROLE) {
                // 说明用户需要注册
                let regInfo: ifRegInfo = {
                    gameId: loginInfo.gameId,
                    password: loginInfo.password,
                    nickName: loginInfo.nickName,
                }

                let data = await UnitRole.registRole(regInfo)

                return GameService._loadSucc(loginInfo.gameId, data.role)
            } else {
                // 其他错误
                return { code: ErrorCode.LOGIN_FAILED, errMsg: e.errMsg ? e.errMsg : 'login failed!' };
            }
        }

    }


    // 玩家登录成功后的消息推送
    private static async _loadSucc(gameId: string, role: UnitRole) {
        let nowTime = Date.now();

        // 设置用户一个token,后续通过token来判断登录状态
        let token = createHash("md5").update('' + nowTime + gameId).digest("hex");
        role.dbInfo.set('token', token)
        try {
            await role.dbInfo.force_save();
        }
        catch (e) {
            throw { code: ErrorCode.DB_ERROR, errMsg: "db is error!" }
        }

        // 登录前流程处理
        await role.beforeLogin();

        // 登录后流程处理
        this.afterLogin(role);

        return { code: ErrorCode.OK, role: role.toClient(), token: token, localTime: nowTime };
    }


    // 登录后流程处理
    private static afterLogin(role: UnitRole) {
        // 刷新修炼信息
        role.refreshPractice();

        // 更新登录时间
        role.lastLoginTime = Date.now();
    }


    // 移除缓存(供广播其他服务器使用)
    static removeRole(gameId: string) {
        UnitRole.delRoleCache(gameId);
    }


    // 道具操作 add/增 use/用 get/查
    static async itemsOption(gameId: string, token: string, optionStr: string) {
        // 获取对象
        let gData = await UnitRole.getRole(gameId, token);
        if (!gData) {
            return { code: ErrorCode.NO_ROLE, errMsg: 'can not find player!' }
        }
        let role = gData.role;

        // 分解指令代码
        let options = optionStr.split('|');
        if (!optionStr || options.length < 2) {
            return { code: ErrorCode.ITEM_OPTION_FAILED, errMsg: 'optionStr is wrong!' }
        }

        // 执行指令
        switch (options[0]) {
            // 查
            case 'get':
                if (options[1] != 'all') {
                    return { code: ErrorCode.OK, playerItems: role.getItemCount(options[1]) };
                }
                break;

            // 增
            case 'add':
                let items = options[1].split(',')
                if (items.length >= 1) {
                    for (let item of items) {
                        let iInfo = item.split(':')
                        role.updateItem(iInfo[0], parseInt(iInfo[1]) || 1, eUType.add);
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
        return { code: ErrorCode.OK, playerItems: role.playerItems };
    }


    // 机缘事件
    static async luckChance(gameId: string, token: string, type: string, count: number) {
        // 获取对象
        let gData = await UnitRole.getRole(gameId, token);
        if (!gData) {
            return { code: ErrorCode.NO_ROLE, errMsg: 'can not find player!' }
        }
        let role = gData.role;
        let practice: ifPractice = role.practice;
        let luckChance = role.luckChance;

        // 所需精力
        let needEnergy = count * 20;
        if (practice.energy < needEnergy) {
            // 精力不够
            return { code: ErrorCode.ENERGY_NOT_ENOUGH, errMsg: 'energy is not enough!' }
        }

        // 获取对应奖励
        let resultLC = [];
        for (let i = 0; i < count; i++) {
            let rLc;
            if ((luckChance[type] + i) % 10 == 0) {
                // 保底
                rLc = this.getLuckChance(role, type, true);
            } else {
                rLc = this.getLuckChance(role, type);
            }

            if (rLc == '') {
                return { code: ErrorCode.GET_LUCKCHANCE_FAILED, errMsg: 'get luckChance failed!' }
            }

            resultLC.push(rLc);
        }

        // 扣除精力
        practice.energy -= needEnergy;
        role.dbInfo.set('practice', practice);

        // 更新机缘次数
        luckChance['totalLC'] += count;
        luckChance[type] += count;
        role.dbInfo.set('luckChance', luckChance);

        role.refreshPractice();
        return { code: ErrorCode.OK, practice: role.practice, playerItems: role.playerItems, resultLC: resultLC }
    }

    // 获取一个机缘事件结果
    static getLuckChance(role: UnitRole, type: string, guarantee: boolean = false) {
        // 获取对应池
        let allLuckChance = TablesService.getModule('LuckChance').getAllRes();

        let targetLC: SeResLuckChance[] = [];
        let totalWeight = 0;

        for (let key in allLuckChance) {
            let lc: SeResLuckChance = allLuckChance[key];
            if (lc.sLType == type) {
                totalWeight += parseInt(lc.sWeight);
                targetLC.push(lc);
            }
        }

        // 按权重抽出道具
        let lcDescri: string = '';
        let remainDistance = Math.random() * totalWeight;
        for (let i = 0; i < targetLC.length; ++i) {
            let res: SeResLuckChance = targetLC[i];
            let weight = parseInt(res.sWeight);

            if (guarantee && weight <= 50) {
                weight = weight * 2;
            }

            remainDistance -= weight;
            if (remainDistance < 0) {
                // 更新道具
                role.updateItem(res.sItemId, 1, eUType.add);
                lcDescri = res.sItemId + '|' + res.sDescri;
                break;
            }
        }

        return lcDescri;
    }

}