/**
 * this is a auto create file
 * 这是一个自动生成的文件,最好不要直接改动这个文件
 */

import { ErrorCode } from "../defines/define"
import { RequestRPC } from "./nodesocket"



class localgameRPC extends RequestRPC {
    /**
	 * 
登录
	 * @param {object} loginInfo 登录信息
	 */
	login(loginInfo: object):Promise<{code: number}> {
	    let query = {
			loginInfo: loginInfo
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "login", Object.assign(query, body),"loginInfo".split(","),"name")
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
	/**
	 * 
道具操作
	 * @param {string} gameId 玩家id
	 * @param {string} token 令牌
	 * @param {string} optionStr 操作 eg:add-增 use-用 get-查(get/all add/k1:1,k2:2)
	 */
	itemsOption(gameId: string, token: string, optionStr: string):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId,
			token: token,
			optionStr: optionStr
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "itemsOption", Object.assign(query, body),"gameId,token,optionStr".split(","),"gameId")
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