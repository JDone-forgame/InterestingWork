/**
 * this is a auto create file
 * 这是一个自动生成的文件,最好不要直接改动这个文件
 */

import { ErrorCode } from "../defines/defines"
import { RequestRPC } from "./nodesocket"



class localgameRPC extends RequestRPC {
    /**
	 * 
登陆游戏
	 * @param {string} gameId 玩家id
	 * @param {string} uid 数字id
	 * @param {string} unionid unionid
	 * @param {string} openid openid
	 * @param {string} sessionKey sessionkey
	 * @param {string} version 版本
	 * @param {string} inviterId 邀请id
	 * @param {string} nickName 昵称
	 * @param {string} avatarUrl 头像
	 * @param {string} activityId 活动id
	 * @param {number} activityStartTime 开始时间
	 * @param {number} activityEndTime 结束时间
	 */
	login(gameId: string, uid: string, unionid: string, openid: string, sessionKey: string, version: string, inviterId: string, nickName?: string, avatarUrl?: string, activityId?: string, activityStartTime?: number, activityEndTime?: number):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId,
			uid: uid,
			unionid: unionid,
			openid: openid,
			sessionKey: sessionKey,
			version: version,
			inviterId: inviterId,
			nickName: nickName,
			avatarUrl: avatarUrl,
			activityId: activityId,
			activityStartTime: activityStartTime,
			activityEndTime: activityEndTime
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "login", Object.assign(query, body),"gameId,uid,unionid,openid,sessionKey,version,inviterId,nickName,avatarUrl,activityId,activityStartTime,activityEndTime".split(","),"gameId")
	}
	/**
	 * 
从内存中移除角色数据
	 * @param {string} gameId 玩家id
	 */
	bcRemoveRole(gameId: string):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("broadcast", "bcRemoveRole", Object.assign(query, body),"gameId".split(","),"gameId")
	}
}

export class gameRPC {
    private static _inst: localgameRPC
    static async rpc_init(srv?:any) {
        if (!this._inst) this._inst = new localgameRPC("game", srv)
        return true;
    }

    static get inst() {
        if (!this._inst)  throw("need call rpc_init first game")
        return this._inst;
    }

    
}