import { MongodbMoudle, ReHash } from "mx-database";
import NodeCache from "node-cache"
import { DBDefine, ErrorCode } from "../../../defines/define";
import { SeEnumRlevelsLevelName, SeResAtkMethods, SeResItems, SeResRlevel } from "../../../defines/interface";
import { eElementName, eUType, ifAtkMethod, ifBaseInfo, ifElements, ifLuckChance, ifPractice, ifRegInfo } from "../../../defines/role";
import { TablesService } from "../../../lib/tables";

export class UnitRole {
    // 初始化
    static init() {
        return Promise.resolve();
    }

    static readonly DEFAULT_ELENUM = 10;//TablesService.getModule('Global').getRes('s2');
    static readonly DEFAULT_ENERGY = 200;//TablesService.getModule('Global').getRes('s1');
    static readonly DEFAULT_LUCKDAY = 3;//TablesService.getModule('Global').getRes('s3');
    static readonly DEFAULT_LUCKDAY_LIMIT_TIME = 15;


    gameId!: string;
    dbInfo!: ReHash<{ [key: string]: (string | number | object) }>;

    // token验证
    get token(): string {
        return this.dbInfo.get('token');
    }

    // 昵称
    get nickName(): string {
        return this.dbInfo.get("nickName") || "";
    }

    set nickName(v: string) {
        this.dbInfo.set("nickName", v);
    }

    // 密码
    get password(): string {
        return this.dbInfo.get("password") || "";
    }

    set password(v: string) {
        this.dbInfo.set("password", v);
    }

    // 上次登录时间
    get lastLoginTime(): number {
        return this.dbInfo.get("lastLoginTime") || 0;
    }

    set lastLoginTime(v: number) {
        this.dbInfo.set("lastLoginTime", v);
    }

    // 道具
    get playerItems(): { [itemId: string]: number } {
        return this.dbInfo.get("playerItems");
    }

    set playerItems(v: { [itemId: string]: number }) {
        this.dbInfo.set("playerItems", v);
    }

    // 标签
    get lable(): string[] {
        return this.dbInfo.get("lable") || [];
    }

    set lable(v: string[]) {
        this.dbInfo.set("lable", v);
    }

    // 五行
    get fElements(): ifElements {
        return this.dbInfo.get("fElements");
    }

    set fElements(v: ifElements) {
        this.dbInfo.set("fElements", v);
    }

    // 基础信息
    get baseInfo(): ifBaseInfo {
        return this.dbInfo.get("baseInfo");
    }

    set baseInfo(v: ifBaseInfo) {
        this.dbInfo.set("baseInfo", v);
    }

    // 修炼
    get practice(): ifPractice {
        return this.dbInfo.get("practice");
    }

    set practice(v: ifPractice) {
        this.dbInfo.set("practice", v);
    }

    // 功法
    get atkMethod(): ifAtkMethod {
        return this.dbInfo.get("atkMethod");
    }

    set atkMethod(v: ifAtkMethod) {
        this.dbInfo.set("atkMethod", v);
    }

    // 机缘
    get luckChance(): { [lcKey: string]: number } {
        return this.dbInfo.get("luckChance");
    }

    set luckChance(v: { [lcKey: string]: number }) {
        this.dbInfo.set("luckChance", v);
    }














    // 数据库存写方法
    get(key: string) {
        return this.dbInfo.get(key);
    }
    set(key: string, value: any) {
        this.dbInfo.set(key, value);
    }


    /**------------------------------缓存部分----------------------------------------------- */
    // role缓存数据：必须通过封装函数操作缓存数据
    static readonly stdTTL = 3 * 60 * 60;
    static roleCache = new NodeCache({ stdTTL: UnitRole.stdTTL, checkperiod: 120, useClones: false });


    // 保存role缓存
    private static setRoleCache(gameId: string, role: UnitRole) {
        this.roleCache.set<UnitRole>(gameId, role);
    }


    // 获取role缓存
    private static getRoleCache(gameId: string): UnitRole {
        let cache = this.roleCache.get<UnitRole>(gameId);
        if (!cache) {
            return null;
        }

        // 重设ttl
        this.roleCache.ttl(gameId, this.stdTTL);
        return cache;
    }


    // 删除role缓存
    static delRoleCache(gameId: string) {
        let t_info = UnitRole.getRoleCache(gameId);
        if (!t_info) return false;
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
            fElements: this.fElements,
            luckChance: this.luckChance,
        }

        return loginInfo;
    }

    // 获取玩家
    static async getRole(gameId: string, token?: string): Promise<{ code: ErrorCode; role: UnitRole }> {
        let roleCache = UnitRole.getRoleCache(gameId);
        if (roleCache) {
            if (token == undefined || roleCache.token == token) {
                return { code: ErrorCode.OK, role: roleCache };
            }
            else {
                throw { code: ErrorCode.ROLE_TOKEN_ERROR, errMsg: 'there is roleCache but token is wrong! ' };
            }
        }

        // 缓存中没有，需要重新下载玩家
        try {
            let dbInfo = await MongodbMoudle.get_database(DBDefine.db).get_unit<{ [key: string]: any }>(DBDefine.col_role, { _id: gameId }).load();
            if (dbInfo.empty) {
                // 需要注册
                throw { code: ErrorCode.NO_ROLE, errMsg: 'there is no role information at db!' }
            }
            else {
                // 找到数据库里的数据了
                let role = await UnitRole.createRole(gameId, dbInfo);
                if (token == undefined || role.token == token) {
                    // 正常
                    return { code: ErrorCode.OK, role: UnitRole.getRoleCache(gameId) };
                }
                else {
                    // 令牌有问题
                    throw { code: ErrorCode.TOKEN_ERROR, errMsg: 'the token is wrong!' }
                }
            }
        } catch (e) {
            // 异常
            return Promise.reject({
                code: e.code ? e.code : ErrorCode.ROLE_GET_ERROR,
                errMsg: e.errMsg ? e.errMsg : 'role get error from db!'
            });
        }
    }

    // 创建一个对象
    private static async createRole(gameId: string, db: ReHash<{ [key: string]: (string | number | object) }>) {
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
        } catch (e) {
            throw { errMsg: e ? e : 'some default data is error!' }
        }

        UnitRole.setRoleCache(gameId, role);

        // 通知一下其他服务器，分布式需要清除其他服务器上的该玩家数据
        // gameRPC.inst.bcRemoveRole(gameId);

        return role;
    }

    // 玩家注册
    static async registRole(regInfo: ifRegInfo): Promise<{ code: number, role: UnitRole }> {

        let roleCache = UnitRole.getRoleCache(regInfo.gameId);
        if (roleCache) {
            throw { code: ErrorCode.ROLE_EXIST, errMsg: 'can not regist beacuse it is exist!' };
        }

        // 对注册信息进一步处理
        let saveInfo = {
            gameId: regInfo.gameId,
            password: regInfo.password,
            nickName: regInfo.nickName,
            registTime: Date.now(),
        }

        return new Promise(function (resolve, reject) {
            // 保存至数据库
            MongodbMoudle.get_database(DBDefine.db).update_insert(
                // 数据库表名
                DBDefine.col_role,
                // 查询字段
                { _id: regInfo.gameId },
                // 注册信息
                saveInfo
            ).then(() => {
                UnitRole.getRole(regInfo.gameId).then((result) => {
                    // 初始化角色数据
                    UnitRole.initRoleData(regInfo.gameId);

                    // 保存注册日志
                    // LoggerMoudle.roleRegist(gameId, inviterId);

                    resolve(result);
                }).catch(reject);
            }).catch(reject)
        })
    }

    // 初始化角色数据
    static async initRoleData(gameId: string) {
        let role = await this.getRoleCache(gameId);
        if (role) {
            // 初始赠送道具
            role.updateItem('i001', 500, eUType.set);
            role.updateItem('i002', 300, eUType.set);
            role.updateItem('i003', 300, eUType.set);
            role.updateItem('i101', 30, eUType.set);
            role.updateItem('i102', 35, eUType.set);
            role.updateItem('i103', 30, eUType.set);
            role.updateItem('i104', 40, eUType.set);
            role.updateItem('i105', 38, eUType.set);

            // 初始化信息
            let sH = this.randomSHead();
            let baseInfo: ifBaseInfo = {
                sex: sH.sex,
                headUrl: sH.headUrl
            }
            role.dbInfo.set('baseInfo', baseInfo);

            // 初始化五行
            let fEl = this.randomFel();
            let fElements: ifElements = {
                Earth: fEl[0],
                Water: fEl[1],
                Metal: fEl[2],
                Wood: fEl[3],
                Fire: fEl[4],
            }
            if (fEl[0] == UnitRole.DEFAULT_ELENUM ||
                fEl[1] == UnitRole.DEFAULT_ELENUM ||
                fEl[2] == UnitRole.DEFAULT_ELENUM ||
                fEl[3] == UnitRole.DEFAULT_ELENUM ||
                fEl[4] == UnitRole.DEFAULT_ELENUM) {
                let lable: string[] = [];
                lable.push('天灵根');
                role.dbInfo.set('lable', lable);
            }
            role.dbInfo.set('fElements', fElements);

            // 初始化修炼
            let practice: ifPractice = {
                handledSpeed: 0,
                reiki: 0,
                lastSave: Date.now(),
                rLevelName: '',
                rLevelLayer: 0,
                rLevel: '',
                earnSpeed: 0,
                energy: 150,
            }
            role.dbInfo.set('practice', practice);

            // 初始化功法
            let atkMethod: ifAtkMethod = {
                atkId: '',
                atkName: '无',
                atkLevel: 0,
            }
            role.dbInfo.set('atkMethod', atkMethod);

            // 初始化机缘
            let luckChance = new Map<string, number>();
            luckChance['normal'] = 0;
            luckChance['spring'] = 0;
            luckChance['summer'] = 0;
            luckChance['autumn'] = 0;
            luckChance['winter'] = 0;
            luckChance['luckday'] = 0;
            luckChance['totalLC'] = 0;
            role.dbInfo.set('luckChance', luckChance)
        }
    }

    // 登录前流程处理
    beforeLogin() {
        // 更新修炼信息
        this.refreshPractice();

        // 初始化信息

        // 每日重置
        let nowTime = Date.now();
        if (!this.isSameDay(nowTime, this.lastLoginTime)) {
            // 重置精力
            let practice: ifPractice = this.practice;
            practice.energy = UnitRole.DEFAULT_ENERGY;
            this.dbInfo.set('practice', practice);

            // 重置每日一缘
            let luckChance = this.luckChance;
            luckChance['luckday'] = 0;
            this.dbInfo.set('luckChance', luckChance);
        }
    }

    // 更新道具
    updateItem(itemId: string, newCount: number, uType: eUType) {
        // 检查表中是否有该道具
        if (!TablesService.getModule('Items')?.has(itemId)) {
            throw { code: ErrorCode.ITEM_NOT_FOUND, errMsg: 'item not found from table!' }
        }

        // 数据向下取整
        newCount = Math.floor(newCount);

        // 更新道具数据
        let items = this.dbInfo.get('playerItems') || {};
        if (!items[itemId] || items[itemId] == null) {
            items[itemId] = 0;
        }

        switch (uType) {
            case eUType.add:
                items[itemId] += newCount;
                break;
            case eUType.set:
                items[itemId] = newCount;
                break;
            default:
                break;
        }
        this.dbInfo.set('playerItems', items);

        return { code: ErrorCode.OK }
    }

    // 获取道具数量
    getItemCount(itemId: string): number {
        let playerItems = this.dbInfo.get('playerItems') || {};
        return playerItems[itemId] || 0;
    }

    // 使用道具
    useItem(itemId: string, itemCount: number) {
        // 检查表中是否有该道具
        if (!TablesService.getModule('Items')?.has(itemId)) {
            return { code: ErrorCode.ITEM_NOT_FOUND, errMsg: 'item not found from table!' }
        }

        // 检查玩家道具是否足够
        let playerItems = this.dbInfo.get('playerItems') || {};
        if (playerItems[itemId] < itemCount || playerItems[itemId] == null) {
            playerItems[itemId] = playerItems[itemId] == null ? 0 : playerItems[itemId];
            this.dbInfo.set('playerItems', playerItems);
            return { code: ErrorCode.ITEM_NOT_ENOUGH, errMsg: 'item is not enough!' }
        }

        // 获取道具信息
        let itemInfo: SeResItems = TablesService.getModule('Items').getRes(itemId);
        let effect = itemInfo.sEffect.split('|');

        switch (effect[0]) {
            // 增加灵气
            case 'addReiki':
                let practice: ifPractice = this.dbInfo.get('practice');
                practice.reiki += (parseInt(effect[1]) * itemCount);
                this.dbInfo.set('practice', practice);
                break;
            // 学习功法
            case 'learnAtk':
                // 学习前更新一下灵气
                this.refreshPractice();

                let lResult = this.learnAtkMethod(effect[1], itemCount);
                if (lResult.code != ErrorCode.OK) {
                    return { code: lResult.code || ErrorCode.ITEM_USE_FAILED, errMsg: lResult.errMsg || 'learn atkmethod failed!' }
                }
                break;
            default:
                break;
        }

        playerItems[itemId] -= itemCount;
        this.dbInfo.set('playerItems', playerItems)

        this.refreshPractice();
        return { code: ErrorCode.OK, playerItems: this.playerItems, practice: this.practice, atkMethod: this.atkMethod }
    }

    // 学习功法
    learnAtkMethod(atkId: string, count: number) {
        let atkInfo: SeResAtkMethods = TablesService.getModule('AtkMethods').getRes(atkId);
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
                        return { code: ErrorCode.ELEMENTS_NOT_ENOUGH, errMsg: 'your elements is not enough!' }
                    }
                    break;
                case eElementName.土:
                    if (fElements.Earth < minElement) {
                        // 没有资格
                        return { code: ErrorCode.ELEMENTS_NOT_ENOUGH, errMsg: 'your elements is not enough!' }
                    }
                    break;
                case eElementName.木:
                    if (fElements.Wood < minElement) {
                        // 没有资格
                        return { code: ErrorCode.ELEMENTS_NOT_ENOUGH, errMsg: 'your elements is not enough!' }
                    }
                    break;
                case eElementName.水:
                    if (fElements.Water < minElement) {
                        // 没有资格
                        return { code: ErrorCode.ELEMENTS_NOT_ENOUGH, errMsg: 'your elements is not enough!' }
                    }
                    break;
                case eElementName.火:
                    if (fElements.Fire < minElement) {
                        // 没有资格
                        return { code: ErrorCode.ELEMENTS_NOT_ENOUGH, errMsg: 'your elements is not enough!' }
                    }
                    break;
                case eElementName.金:
                    if (fElements.Metal < minElement) {
                        // 没有资格
                        return { code: ErrorCode.ELEMENTS_NOT_ENOUGH, errMsg: 'your elements is not enough!' }
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
        } else {
            // 升级功法
            if (atkMethod.atkLevel >= parseFloat(atkInfo.sMaxLevel)) {
                // 到达上限
                return { code: ErrorCode.ATKMETHOD_LEARN_FAIED, errMsg: 'your atkMethod is max!' }
            }

            atkMethod.atkLevel += count;
        }

        // 计算新的修炼效率
        let effect = this.countEEffect(this.checkFiveElemets());
        practice.handledSpeed = (parseFloat(atkInfo.sHandleSpeed) + parseFloat(atkInfo.sUpAddSpeed) * atkMethod.atkLevel) * effect;

        this.dbInfo.set('practice', practice);
        this.dbInfo.set('atkMethod', atkMethod)

        return { code: ErrorCode.OK }
    }





    /**------------------------------私有方法----------------------------------------------- */
    // 随机五属性
    static randomFel() {
        let result = [0, 0, 0, 0, 0]
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
    static getRandom(min: number, max: number) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    // 数组、洗牌算法乱序
    static shuffle(arr: number[]) {
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
        }
        let sex = this.getRandom(0, 1)
        if (sex == 0) {
            result.sex = '男';
            result.headUrl = 'nan/' + this.getRandom(1, 10) + '.png';
        } else {
            result.sex = '女';
            result.headUrl = 'nv/' + this.getRandom(1, 10) + '.png';
        }
        return result
    }

    // 刷新修炼信息
    refreshPractice() {
        this.countReiki();
        this.checkRlevel();
    }

    // 计算修炼等级
    checkRlevel() {
        // 检查表中是否有该等级
        let Rlevels = TablesService.getModule('Rlevel')?.getAllRes();
        if (!Rlevels) {
            return { code: ErrorCode.RLEVEL_NOT_FOUND, errMsg: 'rlevel not found from table!' }
        }

        let practice: ifPractice = this.practice;

        // 逐个检查
        for (let i in Rlevels) {
            let rLevel: SeResRlevel = Rlevels[i];
            let needReiki = rLevel.sNeedReiki.split('|');
            if (needReiki.length != 2) {
                return { code: ErrorCode.RLEVEL_ERROR, errMsg: 'rlevel is wrong!' };
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
                let maxLayer = rLevel.sLevelName == SeEnumRlevelsLevelName.LianQi ? 15 : 3;
                let layer = '';

                for (maxLayer; maxLayer >= 0; maxLayer--) {
                    if (practice.reiki > (min + maxLayer * eachGroup)) {
                        rLevelLayer = maxLayer
                        switch (maxLayer) {
                            case 0:
                                layer = rLevel.sLevelName == SeEnumRlevelsLevelName.LianQi ? '一层' : '前期';
                                break;
                            case 1:
                                layer = rLevel.sLevelName == SeEnumRlevelsLevelName.LianQi ? '二层' : '中期';
                                break;
                            case 2:
                                layer = rLevel.sLevelName == SeEnumRlevelsLevelName.LianQi ? '三层' : '后期';
                                break;
                            case 3:
                                layer = rLevel.sLevelName == SeEnumRlevelsLevelName.LianQi ? '四层' : '大圆满';
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
        let practice: ifPractice = this.practice;
        if (nowTime > practice.lastSave) {
            let earnTime = (nowTime - practice.lastSave) / 1000;
            let addReiki = earnTime * practice.handledSpeed * eefect;
            practice.reiki += addReiki;
            practice.lastSave = nowTime;
            practice.earnSpeed = practice.handledSpeed * eefect;
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
    countEEffect(num: number) {
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
    translateRlevelName(rLevelName: SeEnumRlevelsLevelName): string {
        let result = '';
        switch (rLevelName) {
            case SeEnumRlevelsLevelName.LianQi:
                result = '练气';
                break
            case SeEnumRlevelsLevelName.JieDan:
                result = '结丹';
                break
            case SeEnumRlevelsLevelName.ZhuJi:
                result = '筑基';
                break
            case SeEnumRlevelsLevelName.YuanYing:
                result = '元婴';
                break
        }

        return result;
    }

    // 是否是同一天
    isSameDay(timeStampA: number, timeStampB: number): boolean {
        let dateA = new Date(timeStampA);
        let dateB = new Date(timeStampB);
        return (dateA.setHours(0, 0, 0, 0) == dateB.setHours(0, 0, 0, 0));
    }


}