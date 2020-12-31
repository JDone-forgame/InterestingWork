"use strict";
/**
 * this is a auto create file
 * 这是一个自动生成的文件,最好不要直接改动这个文件
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.webServeRPC = void 0;
const nodesocket_1 = require("./nodesocket");
class localwebServeRPC extends nodesocket_1.RequestRPC {
    /**
     *
检查资源更新
    
     */
    reloadTables() {
        let query = {};
        let body = {};
        return this.request("broadcastme", "reloadTables", Object.assign(query, body), "".split(","), "");
    }
}
class webServeRPC {
    static async rpc_init(srv) {
        if (!this._inst)
            this._inst = new localwebServeRPC("webServe", srv);
        return true;
    }
    static get inst() {
        if (!this._inst)
            throw ("need call rpc_init first webServe");
        return this._inst;
    }
}
exports.webServeRPC = webServeRPC;
//# sourceMappingURL=webServeRPC.js.map