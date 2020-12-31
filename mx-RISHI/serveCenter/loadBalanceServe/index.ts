import { RPCCenter } from "mx-rpc";
import { RPCNetServer } from "mx-rpc";

let map: any = {};

// 中心路由负责接收数据然后分发数据
class CenterServe extends RPCCenter {
    constructor(srv?: number | RPCNetServer) {
        super(srv)
    }

    protected dispatch = function (pool: string[], reqid: string, route: string) {

        // map[route] = (map[route] || 0) + 1

        // 这里解析请求的reqid来处理
        if (pool.length == 1) {
            return pool[0]
        }
        let mq = reqid.split('.')[0]
        if (!mq) {
            let idx = Math.floor(Math.random() * pool.length)
            return pool[idx]
        }
        else {
            let rand = 0;
            for (let i = 0; i < mq.length; i++) {
                rand += mq.charCodeAt(i)
            }

            return pool[rand % pool.length]
        }
    }
}

export default function (srv?: number | RPCNetServer) {
    return new CenterServe(srv)
}