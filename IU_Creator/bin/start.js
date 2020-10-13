"use strict";
// 启动器
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
let http = require('http');
let url = require('url');
let fs = require('fs');
// 从启动参数的第二个值，即 startConfig.json 文件中读值
let startJson = process.argv[2];
if (startJson == undefined) {
    console.log(">>>需要启动文件");
    process.exit(1);
}
try {
    let jsonData = JSON.parse(fs_1.readFileSync(startJson).toString());
    http.createServer(function (req, res) {
        let parseObj = url.parse(req.url, true);
        let pathname = parseObj.pathname;
        if (pathname === '/') {
            fs.readFile(jsonData.indexPage, function (err, data) {
                if (err) {
                    return res.end('>>>404,首页资源丢失');
                }
                res.end(data);
            });
        }
        else if (pathname.indexOf('/game/') === 0) {
            fs.readFile('.' + pathname, function (err, data) {
                if (err) {
                    return res.end('>>>未找到该资源');
                }
                res.end(data);
            });
        }
        else if (pathname.indexOf('/web/') === 0) {
            fs.readFile('.' + pathname, function (err, data) {
                if (err) {
                    return res.end('>>>未找到该资源');
                }
                res.end(data);
            });
        }
    }).listen(jsonData.port, function () {
        console.log('>>>应用启动成功');
    });
}
catch (e) {
    console.error(e);
    process.exit(1);
}
//# sourceMappingURL=start.js.map