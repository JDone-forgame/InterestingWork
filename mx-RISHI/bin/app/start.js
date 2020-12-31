"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 这里是一个启动器，负责启动对应的模块
require('../defines/defalutConfig');
const mx_rpc_1 = require("mx-rpc");
const mx_database_1 = require("mx-database");
const fs_1 = require("fs");
const path_1 = require("path");
const mx_tool_1 = require("mx-tool");
const mx_database_2 = require("mx-database");
const logger_1 = require("../lib/logger");
const tables_1 = require("../lib/tables");
const heapdump_1 = require("../lib/heapdump");
process.on("uncaughtException", function (err) {
    console.error("uncaughtException", err);
});
process.on("unhandledRejection", function (reason) {
    console.error("unhandledRejection", reason);
});
// 定义一个保存dump的信号
process.on("SIGUSR2", async function () {
    let f = await heapdump_1.makeHeapDump();
    console.log(f);
});
// 启动器通过解析配置文件来启动
let startJson = process.argv[2];
if (startJson == undefined) {
    console.log("need argement with startJson");
    process.exit(1);
}
try {
    let jsonData = JSON.parse(fs_1.readFileSync(startJson).toString());
    mx_tool_1.InitMoudle.regist(mx_database_2.CacheMoudle, mx_database_2.CacheMoudle.init);
    mx_tool_1.InitMoudle.regist(tables_1.TablesService, tables_1.TablesService.init);
    if (jsonData.logger) {
        mx_tool_1.InitMoudle.regist(logger_1.LoggerMoudle, logger_1.LoggerMoudle.init, mx_tool_1.ConfigMgr.get("logMgr.platform") || [], mx_tool_1.ConfigMgr.get("logMgr") || {});
    }
    if (jsonData.db) {
        mx_tool_1.InitMoudle.regist(mx_database_1.MongodbMoudle, mx_database_1.MongodbMoudle.init, mx_tool_1.ConfigMgr.get("db.url") || [{ host: mx_tool_1.ConfigMgr.get("db.host"), port: mx_tool_1.ConfigMgr.get("db.port") }]);
    }
    let modulePools = [];
    // 如果有核心模块就先注册核心模块
    if (jsonData.center && jsonData.center.length > 0) {
        let server = new mx_rpc_1.RPCNetServer(jsonData.port);
        for (let i = 0; i < jsonData.center.length; i++) {
            let fpath = path_1.join(__dirname, "..", "serveCenter", jsonData.center[i]);
            modulePools.push(require(fpath).default(server));
        }
    }
    let client = new mx_rpc_1.RPCNetClient(jsonData.port, jsonData.host, jsonData.proto);
    let clientUse = false;
    if (!jsonData.norpcs) {
        clientUse = true;
        // 启动RPC模块
        let loadSet = new Set();
        let files = fs_1.readdirSync(path_1.join(__dirname, "..", "rpcs")).filter(r => r.includes("RPC"));
        for (let i = 0; i < files.length; i++) {
            let fpath = path_1.join(__dirname, "..", "rpcs", files[i]);
            let pPath = path_1.parse(fpath);
            let modName = path_1.join(pPath.dir, pPath.name);
            // 给每个rpc初始化一下
            try {
                if (loadSet.has(modName))
                    continue;
                // console.log("rpc init", modName)
                let rpcmod = require(modName);
                loadSet.add(modName);
                if (rpcmod.default) {
                    rpcmod.default(client);
                    continue;
                }
                for (let key in rpcmod) {
                    if (rpcmod[key].rpc_init)
                        rpcmod[key].rpc_init(client);
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
            let fpath = path_1.join(__dirname, "..", "serveBackend", jsonData.backend[i]);
            // console.log("backend create", jsonData.backend[i])
            modulePools.push(require(fpath));
        }
    }
    // 启动前端模块
    if (jsonData.frontend) {
        for (let i = 0; i < jsonData.frontend.length; i++) {
            let fpath = path_1.join(__dirname, "..", "serveFrontend", jsonData.frontend[i]);
            // console.log("frontend create", jsonData.frontend[i])
            modulePools.push(require(fpath));
        }
    }
    for (let i = 0; i < modulePools.length; i++) {
        clientUse = true;
        let md = modulePools[i];
        if (md.init) {
            // md.name = "serve " + md.role
            mx_tool_1.InitMoudle.regist(md, md.init, client);
        }
    }
    // 不需要用的话就断开连接好了，减少资源占用
    if (!clientUse) {
        client.conn.disconnect();
    }
    mx_tool_1.InitMoudle.startApp().then(function () {
        console.log("app:", startJson, "start success");
    });
}
catch (e) {
    console.error(e);
    process.exit(1);
}
//# sourceMappingURL=start.js.map