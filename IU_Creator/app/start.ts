// 启动器

import { readFileSync } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import { Url } from "url";
import { ErrorCode, iMapData } from "../defines/define";
import { Gcenter } from "../game/center";
let http = require('http')
let url = require('url')
let template = require('art-template')
let fs = require('fs')
let querystring = require('querystring');

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

    http.createServer(function (req:IncomingMessage,res:ServerResponse) {

        let parseObj = url.parse(req.url, true)
        let pathname = parseObj.pathname

        // 1,进入首页
        if (pathname === '/') {
            res.writeHead(200, {'Content-Type':'text/javascript;charset=UTF-8'});  //状态码+响应头属性
            fs.readFile(jsonData.indexPage, function (err: Error, data: string) {
                if (err) {
                    return res.end('>>>404,首页资源丢失')
                }
                res.end(data)
            })
        }

        // 2,方便 web 中的 css image 等资源的直接调用
        else if (pathname.indexOf('/web/') === 0) {
            fs.readFile('.' + pathname, function (err: Error, data: string) {
                if (err) { return res.end('>>>未找到该资源') }
                res.end(data)
            })
        }

        // 3,经过 game 中的文件处理
        else if (pathname.indexOf('/game/') === 0) {
        // 设置显示域的内容
        let mapDataNine: Array<iMapData>

        // 获取地图数据
        let mapJsonArr: Array<iMapData> = fs.readFile('../IU_Creator/data/mapData.json', function (err: Error, mapData: string) {
            if (err) {
                console.log({ code: ErrorCode.res_not_found, message: '>>>没找到地图数据' + err })
                return res.end(">>>请查看控制台")
            }
            return JSON.parse(mapData)
        })
        
        // 指令：加载 center
        if (pathname.indexOf('/game/loadcenter') === 0) {
            fs.readFile('./web/views/center.html', function (err: Error, center:Buffer) {
                if (err) { return res.end('>>>未找到center页面') }
                // 加载当前要显示的9块地图数据
                mapDataNine = Gcenter.loadMap(mapJsonArr, 0, 0)
                var htmlStr = template.render(center.toString(), {
                    mapDataNine: mapDataNine
                })
                res.end(htmlStr)
            })                    
        }
        // 指令：保存当前域地图
        if (pathname.indexOf('/game/savemap') === 0) {
            // 保存当前显示的9块地图数据
            // let mapData = Gcenter.saveMap(mapJsonArr, mapDataNine)
            // 保存数据           
            // fs.writeFile('../IU_Creator/data/mapData.json', JSON.stringify(mapData,null,'\t'), function (error: Error) {
            //     if (error) {
            //         console.log('文件写入失败')
            //     } else {
            //         console.log('文件写入成功')
            //     }

            // })
        }


        // 4,处理 POST 请求
        //暂存请求体信息
        var body = "";
        //每当接收到请求体数据，累加到post中
        req.on('data', function (chunk) {
            //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
            body += chunk  
        console.log("chunk:",chunk)
        })

        //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
        req.on('end', function () {
        // 解析参数
        body = querystring.parse(body);  //将一个字符串反序列化为一个对象
        console.log("body:",body);

        // 设置响应头部信息及编码\<br><br>      
        // res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'}); 
        // 输出表单

        res.end("这是一个post请求");
    })
    
    }
    }).listen(jsonData.port, function () {
        console.log('>>>应用启动成功')
    })

} catch (e) {
    console.error(e)
    process.exit(1)
}