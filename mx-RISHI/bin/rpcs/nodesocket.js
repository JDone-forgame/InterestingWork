"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRPC = void 0;
const mx_rpc_1 = require("mx-rpc");
class RequestRPC extends mx_rpc_1.RPCRequest {
    constructor(name, host) {
        super(name, host);
        //  if(!host){
        //      throw("need init host first");
        //  }
    }
    request(method, route, data, arryList, balanceKey) {
        // 这里需要按照请求参数列表,制作对应的请求
        let queryList = [];
        for (let i = 0; i < arryList.length; i++) {
            queryList.push(data[arryList[i]]);
        }
        if (method == "broadcast") {
            this.CallBroadcast(false, route, ...queryList);
            return Promise.resolve();
        }
        else if (method == "broadcastme") {
            this.CallBroadcast(true, route, ...queryList);
            return Promise.resolve();
        }
        else {
            return this.Call(data[balanceKey] || "", route, ...queryList);
        }
    }
}
exports.RequestRPC = RequestRPC;
//# sourceMappingURL=nodesocket.js.map