// 启动器

import { readFileSync } from "fs";
let http = require('http')
let url = require('url')
let fs = require('fs')


// 从启动参数的第二个值，即 startConfig.json 文件中读值
let startJson = process.argv[2];
if (startJson == undefined) {
    console.log(">>>需要启动文件")
    process.exit(1)
}
try {
    let jsonData: {
        port: number,
        host: string,
        indexPage: string
    } = JSON.parse(readFileSync(startJson).toString())

    http.createServer(function (req: { url: any; }, res: { end: (arg0: string) => void; }) {

        let parseObj = url.parse(req.url, true)
        let pathname = parseObj.pathname

        if (pathname === '/') {
            fs.readFile(jsonData.indexPage, function (err: any, data: string) {
                if (err) {
                    return res.end('>>>404,首页资源丢失')
                }

                res.end(data)
            })
        }
        else if (pathname.indexOf('/game/') === 0) {
            fs.readFile('.' + pathname, function (err: any, data: string) {
                if (err) { return res.end('>>>未找到该资源') }
                res.end(data)
            })
        }
        else if (pathname.indexOf('/web/') === 0) {
            fs.readFile('.' + pathname, function (err: any, data: string) {
                if (err) { return res.end('>>>未找到该资源') }
                res.end(data)
            })
        }
        

        }).listen(jsonData.port, function () {
            console.log('>>>应用启动成功')
        })

} catch (e) {
    console.error(e)
    process.exit(1)
}