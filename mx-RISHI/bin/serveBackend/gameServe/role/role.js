"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitRole = void 0;
const mx_database_1 = require("mx-database");
const node_cache_1 = __importDefault(require("node-cache"));
const define_1 = require("../../../defines/define");
const interface_1 = require("../../../defines/interface");
const role_1 = require("../../../defines/role");
const tables_1 = require("../../../lib/tables");
class UnitRole {
    // 初始化
    static init() {
        return Promise.resolve();
    }
    // token验证
    get token() {
        return this.dbInfo.get('token');
    }
    // 昵称
    get nickName() {
        return this.dbInfo.get("nickName") || "";
    }
    set nickName(v) {
        this.dbInfo.set("nickName", v);
    }
    // 密码
    get password() {
        return this.dbInfo.get("password") || "";
    }
    set password(v) {
        this.dbInfo.set("password", v);
    }
    // 道具
    get playerItems() {
        return this.dbInfo.get("playerItems");
    }
    set playerItems(v) {
        this.dbInfo.set("playerItems", v);
    }
    // 标签
    get lable() {
        return this.dbInfo.get("lable") || [];
    }
    set lable(v) {
        this.dbInfo.set("lable", v);
    }
    // 五行
    get fElements() {
        return this.dbInfo.get("fElements");
    }
    set fElements(v) {
        this.dbInfo.set("fElements", v);
    }
    // 基础信息
    get baseInfo() {
        return this.dbInfo.get("baseInfo");
    }
    set baseInfo(v) {
        this.dbInfo.set("baseInfo", v);
    }
    // 修炼
    get practice() {
        return this.dbInfo.get("practice");
    }
    set practice(v) {
        this.dbInfo.set("practice", v);
    }
    // 功法
    get atkMethod() {
        return this.dbInfo.get("atkMethod");
    }
    set atkMethod(v) {
        this.dbInfo.set("atkMethod", v);
    }
    // 数据库存写方法
    get(key) {
        return this.dbInfo.get(key);
    }
    set(key, value) {
        this.dbInfo.set(key, value);
    }
    // 保存role缓存
    static setRoleCache(gameId, role) {
        this.roleCache.set(gameId, role);
    }
    // 获取role缓存
    static getRoleCache(gameId) {
        let cache = this.roleCache.get(gameId);
        if (!cache) {
            return null;
        }
        // 重设ttl
        this.roleCache.ttl(gameId, this.stdTTL);
        return cache;
    }
    // 删除role缓存
    static delRoleCache(gameId) {
        let t_info = UnitRole.getRoleCache(gameId);
        if (!t_info)
            return false;
        this.roleCache.del(gameId);
        return true;
    }
    /**------------------------------游戏部分----------------------------------------------- */
    // 发给客户端
    toClient() {
        let loginInfo = {
            gameId: this.gameId,
            nickName: this.nickName,
            playerItems: this.playerItems,
            baseInfo: this.baseInfo,
            atkMethod: this.atkMethod,
            practice: this.practice,
        };
        return loginInfo;
    }
    // 获取玩家
    static async getRole(gameId, token) {
        let roleCache = UnitRole.getRoleCache(gameId);
        if (roleCache) {
            if (token == undefined || roleCache.token == token) {
                return { code: define_1.ErrorCode.OK, role: roleCache };
            }
            else {
                throw { code: define_1.ErrorCode.ROLE_TOKEN_ERROR, errMsg: 'there is roleCache but token is wrong! ' };
            }
        }
        // 缓存中没有，需要重新下载玩家
        try {
            let dbInfo = await mx_database_1.MongodbMoudle.get_database(define_1.DBDefine.db).get_unit(define_1.DBDefine.col_role, { _id: gameId }).load();
            if (dbInfo.empty) {
                // 需要注册
                throw { code: define_1.ErrorCode.NO_ROLE, errMsg: 'there is no role information at db!' };
            }
            else {
                // 找到数据库里的数据了
                let role = await UnitRole.createRole(gameId, dbInfo);
                if (token == undefined || role.token == token) {
                    // 正常
                    return { code: define_1.ErrorCode.OK, role: UnitRole.getRoleCache(gameId) };
                }
                else {
                    // 令牌有问题
                    throw { code: define_1.ErrorCode.TOKEN_ERROR, errMsg: 'the token is wrong!' };
                }
            }
        }
        catch (e) {
            // 异常
            return Promise.reject({
                code: e.code ? e.code : define_1.ErrorCode.ROLE_GET_ERROR,
                errMsg: e.errMsg ? e.errMsg : 'role get error from db!'
            });
        }
    }
    // 创建一个对象
    static async createRole(gameId, db) {
        let roleCache = UnitRole.getRoleCache(gameId);
        if (roleCache) {
            return roleCache;
        }
        // 保存数据
        let role;
        try {
            role = new UnitRole();
            role.dbInfo = db;
            role.gameId = gameId;
        }
        catch (e) {
            throw { errMsg: e ? e : 'some default data is error!' };
        }
        UnitRole.setRoleCache(gameId, role);
        // 通知一下其他服务器，分布式需要清除其他服务器上的该玩家数据
        // gameRPC.inst.bcRemoveRole(gameId);
        return role;
    }
    // 玩家注册
    static async registRole(regInfo) {
        let roleCache = UnitRole.getRoleCache(regInfo.gameId);
        if (roleCache) {
            throw { code: define_1.ErrorCode.ROLE_EXIST, errMsg: 'can not regist beacuse it is exist!' };
        }
        // 对注册信息进一步处理
        let saveInfo = {
            gameId: regInfo.gameId,
            password: regInfo.password,
            nickName: regInfo.nickName,
            registTime: Date.now(),
        };
        return new Promise(function (resolve, reject) {
            // 保存至数据库
            mx_database_1.MongodbMoudle.get_database(define_1.DBDefine.db).update_insert(
            // 数据库表名
            define_1.DBDefine.col_role, 
            // 查询字段
            { _id: regInfo.gameId }, 
            // 注册信息
            saveInfo).then(() => {
                UnitRole.getRole(regInfo.gameId).then((result) => {
                    // 初始化角色数据
                    UnitRole.initRoleData(regInfo.gameId);
                    // 保存注册日志
                    // LoggerMoudle.roleRegist(gameId, inviterId);
                    resolve(result);
                }).catch(reject);
            }).catch(reject);
        });
    }
    // 初始化角色数据
    static async initRoleData(gameId) {
        let role = await this.getRoleCache(gameId);
        if (role) {
            // 初始赠送道具
            role.updateItem('i003', 5, role_1.eUType.set);
            role.updateItem('i101', 3, role_1.eUType.set);
            // 初始化信息
            let sH = this.randomSHead();
            let baseInfo = {
                sex: sH.sex,
                headUrl: sH.headUrl
            };
            role.dbInfo.set('baseInfo', baseInfo);
            // 初始化五行
            let fEl = this.randomFel();
            let fElements = {
                Earth: fEl[0],
                Water: fEl[1],
                Metal: fEl[2],
                Wood: fEl[3],
                Fire: fEl[4],
            };
            if (fEl[0] == UnitRole.DEFAULT_ELENUM ||
                fEl[1] == UnitRole.DEFAULT_ELENUM ||
                fEl[2] == UnitRole.DEFAULT_ELENUM ||
                fEl[3] == UnitRole.DEFAULT_ELENUM ||
                fEl[4] == UnitRole.DEFAULT_ELENUM) {
                let lable = [];
                lable.push('天灵根');
                role.dbInfo.set('lable', lable);
            }
            role.dbInfo.set('fElements', fElements);
            // 初始化修炼
            let practice = {
                handledSpeed: 0,
                reiki: 0,
                lastSave: Date.now(),
                rLevelName: '',
                rLevelLayer: 0,
                rLevel: '',
            };
            role.dbInfo.set('practice', practice);
            // 初始化功法
            let atkMethod = {
                atkId: '',
                atkName: '无',
                atkLevel: 0,
            };
            role.dbInfo.set('atkMethod', atkMethod);
        }
    }
    // 登录前流程处理
    beforeLogin() {
        // 初始化信息
        // 重置
    }
    // 更新道具
    updateItem(itemId, newCount, uType) {
        var _a;
        // 检查表中是否有该道具
        if (!((_a = tables_1.TablesService.getModule('Items')) === null || _a === void 0 ? void 0 : _a.has(itemId))) {
            throw { code: define_1.ErrorCode.ITEM_NOT_FOUND, errMsg: 'item not found from table!' };
        }
        // 数据向下取整
        newCount = Math.floor(newCount);
        // 更新道具数据
        let items = this.dbInfo.get('playerItems') || {};
        switch (uType) {
            case role_1.eUType.add:
                items[itemId] += newCount;
                break;
            case role_1.eUType.set:
                items[itemId] = newCount;
                break;
            default:
                break;
        }
        this.dbInfo.set('playerItems', items);
        return { code: define_1.ErrorCode.OK };
    }
    // 获取道具数量
    getItemCount(itemId) {
        let playerItems = this.dbInfo.get('playerItems') || {};
        return playerItems[itemId] || 0;
    }
    // 使用道具
    useItem(itemId, itemCount) {
        var _a;
        // 检查表中是否有该道具
        if (!((_a = tables_1.TablesService.getModule('Items')) === null || _a === void 0 ? void 0 : _a.has(itemId))) {
            return { code: define_1.ErrorCode.ITEM_NOT_FOUND, errMsg: 'item not found from table!' };
        }
        // 检查玩家道具是否足够
        let playerItems = this.dbInfo.get('playerItems') || {};
        if (playerItems[itemId] < itemCount || playerItems[itemId] == null) {
            playerItems[itemId] = playerItems[itemId] == null ? 0 : playerItems[itemId];
            this.dbInfo.set('playerItems', playerItems);
            return { code: define_1.ErrorCode.ITEM_NOT_ENOUGH, errMsg: 'item is not enough!' };
        }
        // 获取道具信息
        let itemInfo = tables_1.TablesService.getModule('Items').getRes(itemId);
        let effect = itemInfo.sEffect.split('|');
        switch (effect[0]) {
            // 增加灵气
            case 'addReiki':
                let practice = this.dbInfo.get('practice');
                practice.reiki += (parseInt(effect[1]) * itemCount);
                this.dbInfo.set('practice', practice);
                break;
            case 'learnAtk':
                let lResult = this.learnAtkMethod(effect[1], itemCount);
                if (lResult.code != define_1.ErrorCode.OK) {
                    return { code: lResult.code || define_1.ErrorCode.ITEM_USE_FAILED, errMsg: lResult.errMsg || 'learn atkmethod failed!' };
                }
                break;
            default:
                break;
        }
        playerItems[itemId] -= itemCount;
        this.dbInfo.set('playerItems', playerItems);
        this.refreshPractice();
        return { code: define_1.ErrorCode.OK, playerItems: this.playerItems, practice: this.practice, atkMethod: this.atkMethod };
    }
    // 学习功法
    learnAtkMethod(atkId, count) {
        let atkInfo = tables_1.TablesService.getModule('AtkMethods').getRes(atkId);
        let atkMethod = this.atkMethod;
        let practice = this.practice;
        let fElements = this.fElements;
        // 改学功法
        if (atkMethod.atkId != atkId) {
            // 判断是否有资格学习
            let needFelement = atkInfo.sNeedElements.split('|');
            let minElement = parseInt(needFelement[1]);
            // 学习资格
            switch (needFelement[0]) {
                case 'any':
                    if (fElements.Wood < minElement && fElements.Earth < minElement && fElements.Fire < minElement && fElements.Water < minElement && fElements.Metal < minElement) {
                        // 没有资格
                        return { code: define_1.ErrorCode.ELEMENTS_NOT_ENOUGH, errMsg: 'your elements is not enough!' };
                    }
                    break;
                case role_1.eElementName.土:
                    if (fElements.Earth < minElement) {
                        // 没有资格
                        return { code: define_1.ErrorCode.ELEMENTS_NOT_ENOUGH, errMsg: 'your elements is not enough!' };
                    }
                    break;
                case role_1.eElementName.木:
                    if (fElements.Wood < minElement) {
                        // 没有资格
                        return { code: define_1.ErrorCode.ELEMENTS_NOT_ENOUGH, errMsg: 'your elements is not enough!' };
                    }
                    break;
                case role_1.eElementName.水:
                    if (fElements.Water < minElement) {
                        // 没有资格
                        return { code: define_1.ErrorCode.ELEMENTS_NOT_ENOUGH, errMsg: 'your elements is not enough!' };
                    }
                    break;
                case role_1.eElementName.火:
                    if (fElements.Fire < minElement) {
                        // 没有资格
                        return { code: define_1.ErrorCode.ELEMENTS_NOT_ENOUGH, errMsg: 'your elements is not enough!' };
                    }
                    break;
                case role_1.eElementName.金:
                    if (fElements.Metal < minElement) {
                        // 没有资格
                        return { code: define_1.ErrorCode.ELEMENTS_NOT_ENOUGH, errMsg: 'your elements is not enough!' };
                    }
                    break;
                default:
                    break;
            }
            // 散功损失 5%-40% 的灵气
            if (atkMethod.atkId != '') {
                let min = 60;
                let max = 95;
                let p = min + Math.floor(Math.random() * (max - min + 1));
                practice.reiki = (p / 100) * practice.reiki;
                practice.lastSave = Date.now();
            }
            // 改变所学功法信息
            atkMethod.atkId = atkId;
            atkMethod.atkName = atkInfo.sAtkName;
            atkMethod.atkLevel = 1;
        }
        else {
            // 升级功法
            if (atkMethod.atkLevel >= parseInt(atkInfo.sMaxLevel)) {
                // 到达上限
                return { code: define_1.ErrorCode.ATKMETHOD_LEARN_FAIED, errMsg: 'your atkMethod is max!' };
            }
            atkMethod.atkLevel += count;
        }
        // 计算新的修炼效率
        let effect = this.countEEffect(this.checkFiveElemets());
        practice.handledSpeed = (parseInt(atkInfo.sHandleSpeed) + parseInt(atkInfo.sUpAddSpeed) * atkMethod.atkLevel) * effect;
        this.dbInfo.set('practice', practice);
        this.dbInfo.set('atkMethod', atkMethod);
        return { code: define_1.ErrorCode.OK };
    }
    /**------------------------------私有方法----------------------------------------------- */
    // 随机五属性
    static randomFel() {
        let result = [0, 0, 0, 0, 0];
        let min = 0;
        let max = UnitRole.DEFAULT_ELENUM;
        for (let i = 0; i < 5; i++) {
            result[i] = this.getRandom(min, max);
            max -= result[i];
            if (max <= 0) {
                break;
            }
        }
        return this.shuffle(result);
    }
    // 随机从[min,max]区间取值
    static getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }
    // 数组、洗牌算法乱序
    static shuffle(arr) {
        for (let i = arr.length - 1; i >= 0; i--) {
            let rIndex = Math.floor(Math.random() * (i + 1));
            let temp = arr[rIndex];
            arr[rIndex] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }
    // 随机性别头像
    static randomSHead() {
        let result = {
            sex: '',
            headUrl: ''
        };
        let sex = this.getRandom(0, 1);
        if (sex == 0) {
            result.sex = '男';
            result.headUrl = 'nan/' + this.getRandom(1, 10) + '.png';
        }
        else {
            result.sex = '女';
            result.headUrl = 'nv/' + this.getRandom(1, 10) + '.png';
        }
        return result;
    }
    // 刷新灵气，修炼信息
    refreshPractice() {
        this.countReiki();
        this.checkRlevel();
    }
    // 计算修炼等级
    checkRlevel() {
        var _a;
        // 检查表中是否有该等级
        let Rlevels = (_a = tables_1.TablesService.getModule('Rlevel')) === null || _a === void 0 ? void 0 : _a.getAllRes();
        if (!Rlevels) {
            return { code: define_1.ErrorCode.RLEVEL_NOT_FOUND, errMsg: 'rlevel not found from table!' };
        }
        let practice = this.practice;
        // 逐个检查
        for (let i in Rlevels) {
            let rLevel = Rlevels[i];
            let needReiki = rLevel.sNeedReiki.split('|');
            if (needReiki.length != 2) {
                return { code: define_1.ErrorCode.RLEVEL_ERROR, errMsg: 'rlevel is wrong!' };
            }
            // 阶段最低/高灵气
            let min = parseInt(needReiki[0]);
            let max = parseInt(needReiki[1]);
            if (practice.reiki >= min && practice.reiki <= max) {
                // 每阶段所需灵气
                let eachGroup = parseInt(rLevel.sEachGroup);
                // 玩家所属阶段的层数
                let rLevelLayer = 0;
                // 本阶段最大层数
                let maxLayer = rLevel.sLevelName == interface_1.SeEnumRlevelsLevelName.LianQi ? 15 : 3;
                let layer = '';
                for (maxLayer; maxLayer >= 0; maxLayer--) {
                    if (practice.reiki > (min + maxLayer * eachGroup)) {
                        rLevelLayer = maxLayer;
                        switch (maxLayer) {
                            case 0:
                                layer = rLevel.sLevelName == interface_1.SeEnumRlevelsLevelName.LianQi ? '一层' : '前期';
                                break;
                            case 1:
                                layer = rLevel.sLevelName == interface_1.SeEnumRlevelsLevelName.LianQi ? '二层' : '中期';
                                break;
                            case 2:
                                layer = rLevel.sLevelName == interface_1.SeEnumRlevelsLevelName.LianQi ? '三层' : '后期';
                                break;
                            case 3:
                                layer = rLevel.sLevelName == interface_1.SeEnumRlevelsLevelName.LianQi ? '四层' : '大圆满';
                                break;
                            case 4:
                                layer = '五层';
                                break;
                            case 5:
                                layer = '六层';
                                break;
                            case 6:
                                layer = '七层';
                                break;
                            case 7:
                                layer = '八层';
                                break;
                            case 8:
                                layer = '九层';
                                break;
                            case 9:
                                layer = '十层';
                                break;
                            case 10:
                                layer = '十一层';
                                break;
                            case 11:
                                layer = '十二层';
                                break;
                            case 12:
                                layer = '十三层';
                                break;
                            case 13:
                                layer = '十四层';
                                break;
                            case 14:
                                layer = '十五层';
                                break;
                            case 15:
                                layer = '大圆满';
                                break;
                            default:
                                break;
                        }
                        break;
                    }
                }
                practice.rLevel = this.translateRlevelName(rLevel.sLevelName) + layer;
                practice.rLevelLayer = rLevelLayer;
                practice.rLevelName = this.translateRlevelName(rLevel.sLevelName);
                this.dbInfo.set('practice', practice);
                return this.practice;
            }
        }
    }
    // 计算灵气
    countReiki() {
        let nowTime = Date.now();
        let eefect = this.countEEffect(this.checkFiveElemets());
        let practice = this.practice;
        if (nowTime > practice.lastSave) {
            let earnTime = (nowTime - practice.lastSave) / 1000;
            let addReiki = earnTime * practice.handledSpeed * eefect;
            practice.reiki += addReiki;
            practice.lastSave = nowTime;
            this.dbInfo.set('practice', practice);
        }
    }
    // 检查有几种属性
    checkFiveElemets() {
        let fel = this.fElements;
        let count = 0;
        if (fel.Earth > 0) {
            count += 1;
        }
        if (fel.Fire > 0) {
            count += 1;
        }
        if (fel.Metal > 0) {
            count += 1;
        }
        if (fel.Water > 0) {
            count += 1;
        }
        if (fel.Wood > 0) {
            count += 1;
        }
        return count;
    }
    // 计算几种属性对修炼的影响
    countEEffect(num) {
        let expEffect = 0;
        switch (num) {
            case 0:
                expEffect = 0;
                break;
            case 1:
                expEffect = 1.5;
                break;
            case 2:
                expEffect = 1.2;
                break;
            case 3:
                expEffect = 1;
                break;
            case 4:
                expEffect = 0.8;
                break;
            case 5:
                expEffect = 0.5;
                break;
        }
        return expEffect;
    }
    // 转换修炼阶段名称
    translateRlevelName(rLevelName) {
        let result = '';
        switch (rLevelName) {
            case interface_1.SeEnumRlevelsLevelName.LianQi:
                result = '练气';
                break;
            case interface_1.SeEnumRlevelsLevelName.JieDan:
                result = '结丹';
                break;
            case interface_1.SeEnumRlevelsLevelName.ZhuJi:
                result = '筑基';
                break;
            case interface_1.SeEnumRlevelsLevelName.YuanYing:
                result = '元婴';
                break;
        }
        return result;
    }
}
exports.UnitRole = UnitRole;
UnitRole.DEFAULT_ELENUM = 10;
/**------------------------------缓存部分----------------------------------------------- */
// role缓存数据：必须通过封装函数操作缓存数据
UnitRole.stdTTL = 60; //3 * 60 * 60;
UnitRole.roleCache = new node_cache_1.default({ stdTTL: UnitRole.stdTTL, checkperiod: 120, useClones: false });
//# sourceMappingURL=role.js.map