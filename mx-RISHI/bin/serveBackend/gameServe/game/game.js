"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const crypto_1 = require("crypto");
const define_1 = require("../../../defines/define");
const role_1 = require("../../../defines/role");
const tables_1 = require("../../../lib/tables");
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
        // 更新登录时间
        role.lastLoginTime = Date.now();
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
    // 机缘事件
    static async luckChance(gameId, token, type, count) {
        // 获取对象
        let gData = await role_2.UnitRole.getRole(gameId, token);
        if (!gData) {
            return { code: define_1.ErrorCode.NO_ROLE, errMsg: 'can not find player!' };
        }
        let role = gData.role;
        let practice = role.practice;
        let luckChance = role.luckChance;
        // 所需精力
        let needEnergy = count * 20;
        // 如果是每日一缘，检查次数
        if (type == 'luckday') {
            if (luckChance['luckday'] >= role_2.UnitRole.DEFAULT_LUCKDAY) {
                return { code: define_1.ErrorCode.GET_LUCKCHANCE_FAILED, errMsg: 'no luckday today!' };
            }
            count = 1;
            needEnergy = 0;
        }
        // 检查精力
        if (practice.energy < needEnergy) {
            return { code: define_1.ErrorCode.ENERGY_NOT_ENOUGH, errMsg: 'energy is not enough!' };
        }
        // 获取对应奖励
        let resultLC = [];
        for (let i = 0; i < count; i++) {
            let rLc;
            if ((luckChance[type] + i) % 9 == 0) {
                // 保底
                rLc = this.getLuckChance(role, type, true);
                console.log('保底了！' + rLc + 'luckChaceType:' + luckChance[type] + ';i=' + i);
            }
            else {
                rLc = this.getLuckChance(role, type);
            }
            if (rLc == '') {
                return { code: define_1.ErrorCode.GET_LUCKCHANCE_FAILED, errMsg: 'get luckChance failed!' };
            }
            resultLC.push(rLc);
        }
        // 扣除精力
        practice.energy -= needEnergy;
        role.dbInfo.set('practice', practice);
        // 更新机缘次数
        if (type != 'luckday') {
            luckChance['totalLC'] += count;
        }
        luckChance[type] += count;
        role.dbInfo.set('luckChance', luckChance);
        role.refreshPractice();
        return { code: define_1.ErrorCode.OK, practice: role.practice, playerItems: role.playerItems, resultLC: resultLC, luckChance: role.luckChance };
    }
    // 获取一个机缘事件结果
    static getLuckChance(role, type, guarantee) {
        guarantee = guarantee ? guarantee : false;
        // 获取对应池
        let allLuckChance = tables_1.TablesService.getModule('LuckChance').getAllRes();
        let targetLC = [];
        let totalWeight = 0;
        for (let key in allLuckChance) {
            let lc = allLuckChance[key];
            if (lc.sLType == type) {
                totalWeight += parseInt(lc.sWeight);
                targetLC.push(lc);
            }
        }
        // 按权重抽出道具
        let lcDescri = '';
        let remainDistance = Math.random() * totalWeight;
        for (let i = 0; i < targetLC.length; ++i) {
            let res = targetLC[i];
            let weight = parseInt(res.sWeight);
            // 保底，高概率出稀有以上
            if (guarantee && weight <= 50) {
                weight = weight * 10;
            }
            remainDistance -= weight;
            if (remainDistance < 0) {
                // 更新道具
                role.updateItem(res.sItemId, 1, role_1.eUType.add);
                lcDescri = res.sItemId + '|' + res.sDescri;
                break;
            }
        }
        return lcDescri;
    }
    // 脱下装备
    static async takeOffEquip(gameId, token, location) {
        // 获取对象
        let gData = await role_2.UnitRole.getRole(gameId, token);
        if (!gData) {
            return { code: define_1.ErrorCode.NO_ROLE, errMsg: 'can not find player!' };
        }
        let role = gData.role;
        return role.changeEquip('', location);
    }
    // 进入副本
    static async enterFightRoom(gameId, token, roomId, attitude) {
        // 获取对象
        let gData = await role_2.UnitRole.getRole(gameId, token);
        if (!gData) {
            return { code: define_1.ErrorCode.NO_ROLE, errMsg: 'can not find player!' };
        }
        let role = gData.role;
        let atkAbout = role.atkAbout;
        let practice = role.practice;
        // 敌人信息
        let enemyInfo = [];
        // 事件信息
        let eventInfo = [];
        // NPC信息
        let npcInfo = [];
        // 先刷新一下
        role.refreshPractice();
        // 获取副本信息
        let fRoom = tables_1.TablesService.getModule('FightRoom').getRes(roomId);
        if (!fRoom) {
            return { code: define_1.ErrorCode.ROOM_NOT_FOUND, errMsg: 'room not found from table!' };
        }
        // 创建房间信息
        let roomInfo = {
            roomLength: fRoom.sRoomLength,
        };
        // 创建敌人信息
        if (fRoom.sEnemyType && fRoom.sEnemyType != 'None') {
            let fRoomEnemyInfo = fRoom.sEnemyType.split('|');
            for (let fRoomEnemyConfig of fRoomEnemyInfo) {
                let enemyConfig = fRoomEnemyConfig.split(':');
                enemyInfo.push.apply(enemyInfo, this.createEnemys(enemyConfig[0], parseInt(enemyConfig[1]), parseInt(fRoom.sRoomLength)));
            }
        }
        // 创建NPC信息
        if (fRoom.sNpcType && fRoom.sNpcType != 'None') {
        }
        // 创建事件信息
        if (fRoom.sEventType && fRoom.sEventType != 'None') {
        }
        // todo 计算房间效果
        // 创建玩家信息
        let playerInfo = {
            name: role.nickName,
            spirit: practice.spirit,
            attitude: attitude,
            moveForward: 'right',
            moveSpeed: Math.floor(atkAbout.speed / 10) > 0 ? Math.floor(atkAbout.speed / 10) : 1,
            location: 0,
        };
        return { enemyInfo: enemyInfo, eventInfo: eventInfo, npcInfo: npcInfo, playerInfo: playerInfo, roomInfo: roomInfo };
    }
    // 生成敌人
    static createEnemys(enemyType, count, roomLength) {
        let enemyRes = tables_1.TablesService.getModule('Enemy').getAllRes();
        if (!enemyRes) {
            return { code: define_1.ErrorCode.ENEMY_NOT_FOUND, errMsg: 'enemy not found from table!' };
        }
        let resultEnemys = [];
        let needEnemys = [];
        for (let i in enemyRes) {
            let enemy = enemyRes[i];
            if (enemy.sEnemyType == enemyType) {
                needEnemys.push(enemy);
            }
        }
        for (let i = 0; i < count; i++) {
            let index = this.getRandom(0, needEnemys.length - 1);
            let enemy = needEnemys[index];
            let roomEnemyInfo = {
                eId: enemy.sID,
                eQuality: enemy.sEnemyQuality,
                eName: enemy.sEnemyName,
                eSpirit: parseFloat(enemy.sEnemySpirit),
                eLocation: this.getRandom(10, roomLength - 5),
                eMoveSpeed: parseFloat(enemy.sEnemyMoveSpeed),
                eMoveRange: parseFloat(enemy.sEnemyMoveRange),
                eAttitude: enemy.sEnemyAttitude,
            };
            resultEnemys.push(roomEnemyInfo);
        }
        return resultEnemys;
    }
    // 随机从[min,max]区间取值
    static getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }
}
exports.GameService = GameService;
//# sourceMappingURL=game.js.map