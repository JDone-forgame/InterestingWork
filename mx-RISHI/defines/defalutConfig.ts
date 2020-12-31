import { ConfigMgr } from "mx-tool";
import fs from 'fs'
import { join } from "path"

if (!fs.existsSync(join(process.cwd(), "config.json"))) {
    ConfigMgr.changeFile(join(__dirname, '..', "config.json"))
}

// 加载一下package.json 获取一下程序名字

ConfigMgr.default({
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
})

function check_env() {
    if (process.env.HOSTNAME) {
        console.log("process.env.HOSTNAME:", process.env.HOSTNAME)
        ConfigMgr.set("id", process.env.HOSTNAME)
    }

    if (process.env.NODE_PORT) {
        console.log("process.env.Node_PORT:", process.env.NODE_PORT)
        ConfigMgr.set("web", parseInt(process.env.NODE_PORT))
    }
}


var package_info: any = {}
function initPackage() {
    let f_path = join(process.cwd(), "pakage.json")
    if (!fs.existsSync(f_path)) {
        f_path = join(__dirname, "pakage.json")
    }

    if (!fs.existsSync(f_path)) {
        return;
    }

    try {
        package_info = require(f_path)
    }
    catch (e) {

    }

    if (package_info.name) {
        process.title = package_info.name
    }
}

check_env();
initPackage();