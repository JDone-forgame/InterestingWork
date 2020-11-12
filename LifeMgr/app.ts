import { IncomingMessage, ServerResponse } from "http";
import { DataMgr } from "./DataMgr";
import { infKeyInfo } from "./define";

// 启动器
let http = require('http')
let url = require('url')
let fs = require('fs');
let template = require('art-template');
const { defData } = require('./DataMgr');



// 从启动参数的第二个值，即 config.json 文件中读值
let startJson = process.argv[2];
if (startJson == undefined) {
    console.log(">>>需要启动文件")
    process.exit(1)
}
try {
    let jsonData = {
        "port": '',
        "host": '',
        "indexPage": ''
    }

    jsonData = JSON.parse(fs.readFileSync(startJson).toString())

    http.createServer(function (req: IncomingMessage, res: ServerResponse) {

        let parseObj = url.parse(req.url, true)
        let pathname = parseObj.pathname


        // 默认首页
        if (pathname === '/') {
            fs.readFile(jsonData.indexPage, function (err: any, data: any) {
                if (err) {
                    return res.end('>>>未找到该资源')
                }
                res.end(data)
            })
        }

        // 进入密码页面
        else if (pathname === '/public/view/key.html') {
            fs.readFile('.' + pathname, function (err: any, data: any) {
                if (err) { return res.end('>>>未找到该资源') }

                // 渲染页面
                var htmlStr = template.render(data.toString(), {
                    keys: DataMgr.getDataArr('keys', 'data')
                })

                res.end(htmlStr)
            })
        }

        // 保存密码
        else if (pathname === '/savekey') {
            let keyInfo = parseObj.query
            if (keyInfo.useWhere != "" && keyInfo.password != "" && keyInfo.userName != "") {
                let newKey: infKeyInfo = {
                    firstWord: keyInfo.useWhere.slice(0, 1),
                    otherWord: keyInfo.useWhere.slice(1),
                    userName: keyInfo.userName,
                    password: keyInfo.password,
                    email: keyInfo.email || '',
                    link: keyInfo.link || '',
                    note: keyInfo.note || '',
                    saveTime: Date.now()
                }
                DataMgr.saveData('keys', 'data', newKey);
            }

            res.statusCode = 302

            res.setHeader('Location', '/public/view/key.html')
            res.end()
        }

        // 公共资源直接调用
        else if (pathname.indexOf('/public/') === 0) {
            fs.readFile('.' + pathname, function (err: any, data: any) {
                if (err) { return res.end('>>>未找到该资源') }
                res.end(data)
            })
        }



    }).listen(jsonData.port, function () {
        let link = 'http://127.0.0.1:' + jsonData.port + '/'
        console.debug('>>>应用启动成功,请通过以下链接访问:%o', link)
    })

} catch (e) {
    console.error(e)
    process.exit(1)
}
