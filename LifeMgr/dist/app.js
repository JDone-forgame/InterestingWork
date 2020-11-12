"use strict";
// 启动器
let http = require('http');
let url = require('url');
let fs = require('fs');
let template = require('art-template');
const { defData } = require('./DataMgr');
// 从启动参数的第二个值，即 config.json 文件中读值
let startJson = process.argv[2];
if (startJson == undefined) {
    console.log(">>>需要启动文件");
    process.exit(1);
}
try {
    let jsonData = {
        "port": '',
        "host": '',
        "indexPage": ''
    };
    jsonData = JSON.parse(fs.readFileSync(startJson).toString());
    http.createServer(function (req, res) {
        let parseObj = url.parse(req.url, true);
        let pathname = parseObj.pathname;
        // 默认首页
        if (pathname === '/') {
            fs.readFile(jsonData.indexPage, function (err, data) {
                if (err) {
                    return res.end('>>>404,首页资源丢失');
                }
                // 渲染页面
                var htmlStr = template.render(data.toString(), {
                    keys: defData.keyData
                });
                // 响应页面
                res.end(htmlStr);
            });
        }
        // 公共资源直接调用
        else if (pathname.indexOf('/public/') === 0) {
            fs.readFile('.' + pathname, function (err, data) {
                if (err) {
                    return res.end('>>>未找到该资源');
                }
                res.end(data);
            });
        }
    }).listen(jsonData.port, function () {
        let link = 'http://127.0.0.1:' + jsonData.port + '/';
        console.debug('>>>应用启动成功,请通过以下链接访问:%o', link);
    });
}
catch (e) {
    console.error(e);
    process.exit(1);
}
//# sourceMappingURL=app.js.map