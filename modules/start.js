// 启动器
let http = require('http');
let url = require('url');
let fs = require('fs');
let util = require('util');
let querystring = require('querystring');

let template = require('art-template');
let express = require('express');
let bodyParser = require('body-parser');
let multer = require('multer');
let cookieParser = require('cookie-parser');

let config = require('./config.json');

// 是否启动默认配置
let isDefaultConfig = false;

// 从启动参数的第二个值，即 config.json 文件中读值
let startJson = process.argv[2];
if (startJson == undefined) {
    startJson = config;
    isDefaultConfig = true;
    if (startJson == undefined) {
        console.log(">>>启用默认配置文件失败。");
        process.exit(1);
    }
    console.log(">>>没有启动文件，已启用默认配置文件。");
}


try {
    let jsonData = {
        "host": '',
        "port": '',
        "indexPage": ''
    };


    if (!isDefaultConfig) {
        jsonData = JSON.parse(fs.readFileSync(startJson).toString());
    } else {
        jsonData = startJson;
    }


    http.createServer(function (req, res) {

        let parseObj = url.parse(req.url, true);
        let pathname = parseObj.pathname;


        // 默认首页
        if (pathname === '/') {
            fs.readFile('.' + jsonData.indexPage, function (err, data) {
                if (err) { return res.end('>>>The resource was not found') };
                res.end(data);
            })
        }


        // 请求标签 ico
        else if (pathname === '/favicon.ico') {
            fs.readFile('./public/img/icon.png', function (err, data) {
                if (err) { return res.end('>>>The resource was not found') };
                res.end(data);
            })
        }


        // 公共资源直接调用
        else if (pathname.indexOf('/css/') === 0 || pathname.indexOf('/img/') === 0 || pathname.indexOf('/js/') === 0 || pathname.indexOf('/font/') === 0) {
            let url = './public' + pathname;
            fs.readFile(url, function (err, data) {
                if (err) { return res.end('>>>The resource was not found') };
                res.end(data);
            })
        }


        // 网络请求
        // else if (pathname.indexOf('http://') == 0) {
        //     res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        //     res.end(util.inspect(url.parse(req.url, true)));

        // }

        // else if (pathname.indexOf('http://') == 0) {
        //     res.writeHead(200, { 'Content-Type': 'text/plain' });

        //     // 解析 url 参数
        //     var params = url.parse(req.url, true).query;
        //     console.log(params)
        //     res.write("网站名：" + params.name);
        //     res.write("\n");
        //     res.write("网站 URL：" + params.url);
        //     res.end();
        // }

        else if (pathname.indexOf('/serve/') == 0) {
            // 定义了一个post变量，用于暂存请求体的信息
            var body = '';

            // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
            req.on('data', function (chunk) {
                body += chunk;
            });

            // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
            req.on('end', function () {
                // 解析参数
                body = querystring.parse(body);
                // 设置响应头部信息及编码
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });

                var postHTML =
                    '<html><head><meta charset="utf-8"><title>菜鸟教程 Node.js 实例</title></head>' +
                    '<body>' +
                    '<form method="post">' +
                    '网站名： <input name="name"><br>' +
                    'pswd： <input name="url"><br>' +
                    '<input type="submit">' +
                    '</form>' +
                    '</body></html>';

                // 输出提交的数据
                if (body.name && body.pswd) {
                    res.write("网站名：" + body.name);
                    res.write("<br>");
                    res.write("pswd：" + body.pswd);
                } else {  // 输出表单
                    res.write(postHTML);
                }
                res.end()
            });

        }

        // // 进入密码页面
        // else if (pathname === '/public/view/key.html') {
        //     fs.readFile('.' + pathname, function (err, data) {
        //         if (err) { return res.end('>>>The resource was not found') }

        //         // 渲染页面
        //         var htmlStr = template.render(data.toString(), {
        //             keys: DataMgr.getDataArr('keys', 'data')
        //         })

        //         res.end(htmlStr)
        //     })
        // }

        // // 保存密码
        // else if (pathname === '/savekey') {
        //     let keyInfo = parseObj.query
        //     if (keyInfo.useWhere != "" && keyInfo.password != "" && keyInfo.userName != "") {
        //         let newKey = {
        //             firstWord: keyInfo.useWhere.slice(0, 1),
        //             otherWord: keyInfo.useWhere.slice(1),
        //             userName: keyInfo.userName,
        //             password: keyInfo.password,
        //             email: keyInfo.email || '',
        //             link: keyInfo.link || '',
        //             note: keyInfo.note || '',
        //             saveTime: Date.now()
        //         }
        //         DataMgr.saveData('keys', 'data', newKey);
        //     }

        //     res.statusCode = 302

        //     res.setHeader('Location', '/public/view/key.html')
        //     res.end()
        // }




    }).listen(jsonData.port, function () {
        let link = 'http://' + jsonData.host + ':' + jsonData.port + '/';
        console.debug('>>>应用启动成功,请通过以下链接访问:%o', link);
    })

} catch (e) {
    console.error(e)
    process.exit(1)
}
