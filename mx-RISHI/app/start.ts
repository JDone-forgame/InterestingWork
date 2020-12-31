// 这里是一个启动器，负责启动对应的模块
require('../defines/defalutConfig');
import { RPCNetClient, RPCNetServer } from "mx-rpc";
import { MongodbMoudle } from "mx-database"
import { readFileSync, readdirSync } from "fs"
import { parse, join } from "path"
import { InitMoudle, ConfigMgr } from "mx-tool";
import { CacheMoudle } from "mx-database"
import { LoggerMoudle } from "../lib/logger";
import { TablesService } from "../lib/tables";
import { makeHeapDump } from "../lib/heapdump";

process.on("uncaughtException", function (err) {
    console.error("uncaughtException", err)
})

process.on("unhandledRejection", function (reason) {
    console.error("unhandledRejection", reason)
})

// 定义一个保存dump的信号
process.on("SIGUSR2", async function () {
    let f = await makeHeapDump()
    console.log(f);
})

// 启动器通过解析配置文件来启动

let startJson = process.argv[2];
if (startJson == undefined) {
    console.log("need argement with startJson")
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

    InitMoudle.regist(CacheMoudle, CacheMoudle.init)
    InitMoudle.regist(TablesService, TablesService.init)
    if (jsonData.logger) {
        InitMoudle.regist(LoggerMoudle, LoggerMoudle.init, ConfigMgr.get("logMgr.platform") || [], ConfigMgr.get("logMgr") || {})
    }

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

        let files = readdirSync(join(__dirname, "..", "rpcs")).filter(r => r.includes("RPC"));
        for (let i = 0; i < files.length; i++) {
            let fpath = join(__dirname, "..", "rpcs", files[i])
            let pPath = parse(fpath);
            let modName = join(pPath.dir, pPath.name)
            // 给每个rpc初始化一下
            try {
                if (loadSet.has(modName)) continue;

                // console.log("rpc init", modName)
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
                console.error("rpc init failed", modName, e);
            }
        }
    }

    // 启动后端模块
    if (jsonData.backend) {
        for (let i = 0; i < jsonData.backend.length; i++) {
            let fpath = join(__dirname, "..", "serveBackend", jsonData.backend[i])
            // console.log("backend create", jsonData.backend[i])
            modulePools.push(require(fpath))
        }
    }

    // 启动前端模块
    if (jsonData.frontend) {
        for (let i = 0; i < jsonData.frontend.length; i++) {
            let fpath = join(__dirname, "..", "serveFrontend", jsonData.frontend[i])
            // console.log("frontend create", jsonData.frontend[i])
            modulePools.push(require(fpath))
        }
    }

    for (let i = 0; i < modulePools.length; i++) {
        clientUse = true;
        let md = modulePools[i]
        if (md.init) {
            // md.name = "serve " + md.role
            InitMoudle.regist(md, md.init, client)
        }
    }

    // 不需要用的话就断开连接好了，减少资源占用
    if (!clientUse) {
        client.conn.disconnect();
    }

    InitMoudle.startApp().then(function () {
        console.log("app:", startJson, "start success")
    })
}
catch (e) {
    console.error(e)
    process.exit(1)
}