"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mx_rpc_1 = require("mx-rpc");
let map = {};
// 中心路由负责接收数据然后分发数据
class CenterServe extends mx_rpc_1.RPCCenter {
    constructor(srv) {
        super(srv);
        this.dispatch = function (pool, reqid, route) {
            // map[route] = (map[route] || 0) + 1
            // 这里解析请求的reqid来处理
            if (pool.length == 1) {
                return pool[0];
            }
            let mq = reqid.split('.')[0];
            if (!mq) {
                let idx = Math.floor(Math.random() * pool.length);
                return pool[idx];
            }
            else {
                let rand = 0;
                for (let i = 0; i < mq.length; i++) {
                    rand += mq.charCodeAt(i);
                }
                return pool[rand % pool.length];
            }
        };
    }
}
function default_1(srv) {
    return new CenterServe(srv);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map