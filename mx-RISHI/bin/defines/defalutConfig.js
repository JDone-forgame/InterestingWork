"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mx_tool_1 = require("mx-tool");
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
if (!fs_1.default.existsSync(path_1.join(process.cwd(), "config.json"))) {
    mx_tool_1.ConfigMgr.changeFile(path_1.join(__dirname, '..', "config.json"));
}
// 加载一下package.json 获取一下程序名字
mx_tool_1.ConfigMgr.default({
    port: "19000",
    host: "127.0.0.1",
    swagger: false,
    swaggertype: '.js',
    db: {
        "database": "test",
        "host": "127.0.0.1",
        "port": 27017
    },
    logMgr: {
        platform: "logkit,tga",
        url: "http://xxxxxx/api/logger",
        projectid: "xx",
        path: "xxxxx"
    },
    resource: {
        url: "http://xxxxxx/resource/tables/",
        platform: "xxxx"
    },
});
function check_env() {
    if (process.env.HOSTNAME) {
        console.log("process.env.HOSTNAME:", process.env.HOSTNAME);
        mx_tool_1.ConfigMgr.set("id", process.env.HOSTNAME);
    }
    if (process.env.NODE_PORT) {
        console.log("process.env.Node_PORT:", process.env.NODE_PORT);
        mx_tool_1.ConfigMgr.set("web", parseInt(process.env.NODE_PORT));
    }
}
var package_info = {};
function initPackage() {
    let f_path = path_1.join(process.cwd(), "pakage.json");
    if (!fs_1.default.existsSync(f_path)) {
        f_path = path_1.join(__dirname, "pakage.json");
    }
    if (!fs_1.default.existsSync(f_path)) {
        return;
    }
    try {
        package_info = require(f_path);
    }
    catch (e) {
    }
    if (package_info.name) {
        process.title = package_info.name;
    }
}
check_env();
initPackage();
//# sourceMappingURL=defalutConfig.js.map