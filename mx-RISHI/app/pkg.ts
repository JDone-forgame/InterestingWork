// 这个文件是作为pkg打包的时候使用的
// if(process.argv.length == 2){
//     // 表示没有输入参数

import { fork, isMaster } from "cluster";
import { readFileSync } from "fs";
import { cpus } from "os";



function forkProcess(env?: any) {
    let wk = fork(env);
    wk.on("exit", function () {
        console.log("exit", wk.process.pid)
        forkProcess(env);
    })
}

function start() {
    if (isMaster) {
        let startJson = process.argv[2];
        if (startJson == undefined) {
            console.log("需要启动配置文件格式采用pm2启动文件的格式")
            process.stdin.once("data", function () {
                process.exit(1)
            })
            return;
        }

        function readConfig() {
            let f = readFileSync(startJson).toString()
            return JSON.parse(f);
        }

        let configInfo = readConfig();

        // 这里要换掉启动参数
        let argv = process.argv.slice(0, 2);
        argv.push(...configInfo.args || []);
        process.argv = argv;
        process.env = Object.assign(process.env, configInfo.env || {});
        if (configInfo.exec_mode == "cluster_mode" || configInfo.exec_mode == "cluster") {
            let instance = 1;
            if (configInfo.instances != undefined) instance = configInfo.instances || cpus().length;
            if (instance > 1) {
                for (let i = 0; i < instance; i++) {
                    forkProcess(configInfo.env || {});
                }
                console.log("forkProcess finish")
            }
            else {
                require("./start")
            }
        }
        else {
            require("./start")
        }
    }
    else {
        require("./start")
    }
}

start()