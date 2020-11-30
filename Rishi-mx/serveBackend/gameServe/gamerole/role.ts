import { MongodbMoudle, ReHash } from "mx-database";
import { LocalDate } from "mx-tool";
import { DBDefine, ErrorCode } from "../../../defines/defines";
import { LoggerMoudle } from "../../../lib/logger";
import { gameRPC } from "../../../rpcs/gameRPC";
import NodeCache from "node-cache"
import { Default, ifElements } from "../../../defines/gamerole";

export class UnitRole {
    static async init() {
        return;
    }

    gameId!: string;
    dbInfo!: ReHash<{ [key: string]: (string | number | object) }>;

    // role缓存数据：必须通过封装函数操作缓存数据
    static readonly stdTTL = 1 * 60;
    static roleCache = new NodeCache({ stdTTL: UnitRole.stdTTL, checkperiod: 120, useClones: false });

    get isNew(): boolean {
        return this.dbInfo.get('isNew');
    }

    set isNew(val: boolean) {
        this.dbInfo.set('isNew', val);
    }

    get token(): string {
        return this.dbInfo.get('token');
    }

    get uid(): string {
        return this.dbInfo.get('uid');
    }

    get activityId(): string {
        return this.dbInfo.get("activityId") || "";
    }

    get lastLoginTime(): number {
        return this.dbInfo.get('lastLoginTime');
    }

    set lastLoginTime(v: number) {
        this.dbInfo.set('lastLoginTime', v);
    }

    get nickName(): string {
        return this.dbInfo.get('nickName') || "";
    }

    get session_key(): string {
        return this.dbInfo.get('session_key') || '';
    }

    set session_key(sessionKey: string) {
        this.dbInfo.set('session_key', sessionKey);
    }

    set nickName(v: string) {
        this.dbInfo.set('nickName', v || "");
    }

    get avatarUrl(): string {
        return this.dbInfo.get('avatarUrl') || "";
    }

    set avatarUrl(v: string) {
        this.dbInfo.set('avatarUrl', v);
    }

    set activityId(v: string) {
        this.dbInfo.set("activityId", v);
    }

    get playerItems(): { [itemId: string]: number } {
        return this.dbInfo.get('playerItems');
    }

    set playerItems(items: { [itemId: string]: number }) {
        this.dbInfo.set('playerItems', items);
    }

    get elements(): ifElements {
        return this.dbInfo.get('elements');
    }
    set elements(v: ifElements) {
        this.dbInfo.set('elements', v);
    }

    get sex(): number {
        return this.dbInfo.get('sex') | 0;
    }
    set sex(v: number) {
        this.dbInfo.set('sex', v);
    }

    get reiki(): number {
        return this.dbInfo.get('reiki') | 0;
    }
    set reiki(v: number) {
        this.dbInfo.set('reiki', v);
    }

    /**------------------------------------------------------通用部分------------------------------------------------------------- */
    // 发给客户端的数据
    toClient() {
        let loginInfo = {
            nickName: this.nickName,
            gameId: this.gameId,
        }

        return loginInfo;
    }

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

    // 数据库存写方法
    get(key: string) {
        return this.dbInfo.get(key)
    }
    set(key: string, value: any) {
        this.dbInfo.set(key, value)
    }

    // 获取玩家
    static async getRole(gameId: string, token?: string): Promise<{ code: ErrorCode, role: UnitRole }> {
        let roleCache = await UnitRole.getRoleCache(gameId);
        if (roleCache) {
            if (token == undefined || roleCache.token == token) {
                return Promise.resolve({ code: ErrorCode.ok, role: roleCache });
            }
            else {
                throw ({ code: ErrorCode.role_token_error, errMsg: 'there is roleCache but token is wrong! ' });
            }
        }

        // 重新下载玩家
        return new Promise(function (resolve, reject) {
            MongodbMoudle.get_database(DBDefine.db).get_unit<{ [key: string]: any }>(DBDefine.col_role, { _id: gameId }).load().then(function (dbInfo) {
                if (dbInfo.empty) {
                    // 这里需要创角
                    reject({ code: ErrorCode.role_no });
                }
                else {
                    // 这里ok了
                    UnitRole.createLoad(gameId, dbInfo).then(role => {
                        if (token == undefined || role.token == token) {
                            resolve({ code: ErrorCode.ok, role: UnitRole.getRoleCache(gameId) });
                        }
                        else {
                            reject({ code: ErrorCode.role_token_error, errMsg: 'there is dbcreater, but token is wrong! ' });
                        }
                    }).catch(function (errMsg) {
                        reject({ code: ErrorCode.role_token_error, errMsg: errMsg });
                    });

                }
            }).catch(function (res) {
                // 异常了，这里需要推出
                // console.log(res);
                reject({ code: ErrorCode.db_error, errMsg: res });
            })
        })
    }

    // 创建一个对象
    private static async createLoad(gameId: string, db: ReHash<{ [key: string]: (string | number | object) }>) {
        let roleCache = await UnitRole.getRoleCache(gameId);
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

        // 读取邮件

        UnitRole.setRoleCache(gameId, role);
        // 通知一下其他人
        gameRPC.inst.bcRemoveRole(gameId);
        return role;
    }

    // 注册流程
    static registRole(gameId: string, uid: string, unionid: string, openid: string, session_key: string, version: string, inviterId: string, nickName: string, avatarUrl: string, activityId: string, activityStartTime: number, activityEndTime: number): Promise<{ code: number, role: UnitRole }> {
        let roleCache = UnitRole.getRoleCache(gameId);
        if (roleCache) {
            return Promise.reject({ code: ErrorCode.role_exist });
        }
        return new Promise(function (resolve, reject) {
            MongodbMoudle.get_database(DBDefine.db)
                .update_insert(DBDefine.col_role, { _id: gameId }, { uid: uid, unionId: unionid, openId: openid, version: version, session_key: session_key, lastSaveTime: LocalDate.now(), beneficiaryId: inviterId, nickName: nickName, avatarUrl: avatarUrl, activityId: activityId, activityStartTime: activityStartTime, activityEndTime: activityEndTime })
                .then(function () {
                    UnitRole.getRole(gameId).then((rs) => {

                        // 初始化角色数据
                        UnitRole.initRoleData(gameId);

                        // 保存注册日志
                        LoggerMoudle.roleRegist(gameId, uid, activityId, inviterId);

                        resolve(rs);
                    }).catch(reject);
                }).catch(reject)
        })
    }

    // 初始化角色数据
    static async initRoleData(gameId: string) {
        let role = await this.getRoleCache(gameId);
        if (role) {
            // 新手标记
            role.isNew = true;
        }
        role.elements = role.randomElements();
    }

    // 登录前事务处理
    public async beforeLogin(inviterId: string) {
        // 保存登录日志
        LoggerMoudle.roleLogin(this.gameId, this.uid, this.activityId, inviterId);
    }

    /**------------------------------------------------------游戏部分------------------------------------------------------------- */
    randomElements(): ifElements {
        let list: number[];
        let min = 0;
        let max = Default.DEFAULT_ELENUM;
        for (let i = 0; i < 5; i++) {
            list[i] = this.getRandom(min, max);
            max -= list[i];
            if (max <= 0) {
                break;
            }
        }
        list = this.shuffle(list)
        let elements: ifElements = {
            Metal: list[0],
            Wood: list[1],
            Water: list[2],
            Fire: list[3],
            Earth: list[4]
        }
        return elements;
    }


    /**------------------------------------------------------辅助部分------------------------------------------------------------- */
    // 判断是否同一天
    private isSameDay(timeStampA: number, timeStampB: number): boolean {
        let dateA = new Date(timeStampA);
        let dateB = new Date(timeStampB);
        return (dateA.setHours(0, 0, 0, 0) == dateB.setHours(0, 0, 0, 0));
    }

    private shuffle(arr) {
        for (let i = arr.length - 1; i >= 0; i--) {
            let rIndex = Math.floor(Math.random() * (i + 1));
            let temp = arr[rIndex];
            arr[rIndex] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }

    private getRandom(min: number, max: number): number {
        return min + Math.floor(Math.random() * (max - min + 1));
    }
}
