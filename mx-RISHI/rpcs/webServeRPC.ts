/**
 * this is a auto create file
 * 这是一个自动生成的文件,最好不要直接改动这个文件
 */

import { RequestRPC } from "./nodesocket"



class localwebServeRPC extends RequestRPC {
    /**
	 * 
检查资源更新
	
	 */
	reloadTables():Promise<void> {
	    let query = {
	
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("broadcastme", "reloadTables", Object.assign(query, body),"".split(","),"")
	}
}

export class webServeRPC {
    private static _inst: localwebServeRPC
    static async rpc_init(srv?:any) {
        if (!this._inst) this._inst = new localwebServeRPC("webServe", srv)
        return true;
    }

    static get inst() {
        if (!this._inst)  throw("need call rpc_init first webServe")
        return this._inst;
    }

    
}