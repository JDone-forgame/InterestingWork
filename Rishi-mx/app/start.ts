// 这里是一个启动器，负责启动对应的模块
import { RPCNetClient, RPCNetServer } from "mx-rpc";
import { MongodbMoudle } from "mx-database";
import { readFileSync, readdirSync } from "fs";
import { parse, join } from "path";
import { InitMoudle, ConfigMgr } from "mx-tool";
import { CacheMoudle } from "mx-database";
import { TableMgr } from "../lib/TableMgr";
import { LoggerMoudle } from "../lib/logger";

process.on("uncaughtException", function (err) {
    console.error("uncaughtException", err)
})

process.on("unhandledRejection", function (reason) {
    console.error("unhandledRejection", reason)
})

// 启动器通过解析配置文件来启动

let startJson = process.argv[2];
if (startJson == undefined) {
    console.log(">>>需要启动配置文件！")
    process.exit(1)
}
try {
    let jsonData: {
        port: number,
        host: string,
        proto: string,
        logger: boolean,
        db: boolean,
        norpcs: boolean,
        center?: string[],
        backend?: string[],
        frontend?: string[]
    } = JSON.parse(readFileSync(startJson).toString())

    // 初始化缓存模块
    InitMoudle.regist(CacheMoudle, CacheMoudle.init)

    // 初始化表格模块
    InitMoudle.regist(TableMgr.inst, TableMgr.inst.init)

    // 初始化日志模块
    if (jsonData.logger) {
        InitMoudle.regist(LoggerMoudle, LoggerMoudle.init, ConfigMgr.get("logMgr.platform") || [], ConfigMgr.get("logMgr") || {})
    }

    // 初始化数据库模块
    if (jsonData.db) {
        InitMoudle.regist(MongodbMoudle, MongodbMoudle.init, ConfigMgr.get("db.url") || [{ host: ConfigMgr.get("db.host"), port: ConfigMgr.get("db.port") }])
    }

    let modulePools: { init?: (...args: any[]) => Promise<boolean>, [x: string]: any }[] = []

    // 如果有核心模块就先注册核心模块
    if (jsonData.center && jsonData.center.length > 0) {
        let server = new RPCNetServer(jsonData.port);
        for (let i = 0; i < jsonData.center.length; i++) {
            let fpath = join(__dirname, "..", "serveCenter", jsonData.center[i])
            modulePools.push(require(fpath).default(server))
        }
    }

    let client = new RPCNetClient(jsonData.port, jsonData.host, jsonData.proto);
    let clientUse = false;

    if (!jsonData.norpcs) {
        clientUse = true;
        // 启动RPC模块
        let loadSet = new Set()

        let files = readdirSync(join(__dirname, "..", "rpcs"))
        for (let i = 0; i < files.length; i++) {
            let fpath = join(__dirname, "..", "rpcs", files[i])
            let pPath = parse(fpath);
            let modName = join(pPath.dir, pPath.name)
            // 给每个rpc初始化一下
            try {
                if (loadSet.has(modName)) continue;

                console.log(">>>rpc init", modName)
                let rpcmod = require(modName)
                loadSet.add(modName)
                if (rpcmod.default) {
                    rpcmod.default(client)
                    continue;
                }
                for (let key in rpcmod) {
                    if (rpcmod[key].rpc_init) rpcmod[key].rpc_init(client)
                }
            }
            catch (e) {

            }
        }
    }

    // 启动后端模块
    if (jsonData.backend) {
        for (let i = 0; i < jsonData.backend.length; i++) {
            let fpath = join(__dirname, "..", "serveBackend", jsonData.backend[i])
            console.log(">>>后端已创建：", jsonData.backend[i])
            modulePools.push(require(fpath))
        }
    }

    // 启动前端模块
    if (jsonData.frontend) {
        for (let i = 0; i < jsonData.frontend.length; i++) {
            let fpath = join(__dirname, "..", "serveFrontend", jsonData.frontend[i])
            console.log(">>>前端已创建：", jsonData.frontend[i])
            modulePools.push(require(fpath))
        }
    }

    for (let i = 0; i < modulePools.length; i++) {
        clientUse = true;
        let md = modulePools[i]
        if (md.init) {
            InitMoudle.regist(md, md.init, client)
        }
    }

    // 不需要用的话就断开连接，减少资源占用
    if (!clientUse) {
        client.conn.disconnect();
    }

    InitMoudle.startApp().then(function () {
        console.log(">>>app:", startJson, "启动成功！")
    })
}
catch (e) {
    console.error(e)
    process.exit(1)
}