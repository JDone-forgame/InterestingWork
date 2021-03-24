let http = require('http')
let fs = require('fs')
let url = require('url')
var template = require('art-template')
let errorCode = require('./public/js/errorCode').ErrorCode

// ! ip 和 端口
let host = '10.0.0.180';
let port = 4070;

http.createServer(function (req, res) {
    // 通过 parse 方法，true 参数确定是否将 url 转换为一个对象方便处理
    var parseObj = url.parse(req.url, true)

    // 单独获取不包含查询字符串的路径部分
    var pathname = parseObj.pathname

    // 读取首页
    if (pathname === '/') {
        fs.readFile('./public/html/menu.html', function (err, data) {
            if (err) {
                return res.end('code:' + errorCode.not_found_menu_page)
            }
            // 响应页面
            res.end(data)
        })

    }

    // 获取公共资源
    else if (pathname.indexOf('/public/') === 0) {
        fs.readFile('.' + pathname, function (err, data) {
            if (err) { return res.end('code:' + errorCode.not_found_public_res) }
            res.end(data)
        })
    }

    // 浏览器图标
    else if (pathname === '/favicon.ico') {
        fs.readFile('./public/img/icon.png', function (err, data) {
            if (err) { return res.end('code:' + errorCode.not_found_public_res) }
            res.end(data)
        })
    }

    // 留言板读取
    else if (pathname === '/messageBoard') {
        var cJson = {}
        var comments = []
        // 读取日志数据
        fs.readFile('./data/messageBoard/log.json', function (err, data) {
            if (err) { res.end('code:' + errorCode.not_found_data) }
            // 这里需要转换 data 数据类型为字符串(原本是二进制数据)
            var jsObj = JSON.parse(data.toString())
            // 这里只需要将 Json 文件中的各个值传入 comments 数组就行
            for (key in jsObj) {
                comments[key] = jsObj[key]
            }
            console.log('读取文件成功！')

            fs.readFile('./public/html/messageBoard/start.html', function (err, data) {
                if (err) { res.end('code:' + errorCode.not_found_public_res) }

                var htmlStr = template.render(data.toString(), {
                    comments: comments
                })

                // 响应页面
                res.end(htmlStr)
            })
        })
    }

    // 发送留言
    else if (pathname === '/sendLog') {
        var cJson = {}
        var comments = []
        // 读取日志数据
        fs.readFile('./data/messageBoard/log.json', function (err, data) {
            if (err) { res.end('code:' + errorCode.not_found_data) }
            // 这里需要转换 data 数据类型为字符串(原本是二进制数据)
            var jsObj = JSON.parse(data.toString())
            // 这里只需要将 Json 文件中的各个值传入 comments 数组就行
            for (key in jsObj) {
                comments[key] = jsObj[key]
            }
            console.log('读取文件成功！')

            let comment = parseObj.query
            if (comment.message != "") {
                // id 用于删除使用，相当于数组下标
                comment.id = comments.length + 1
                // listId 用于展示楼数，即使曾经的楼删除了，新的楼数只增不减
                comment.listId = comments[0] ? comments[0].listId + 1 : 1
                comment.name === "" ? comment.name = '没留名的狠人' : comment.name
                comment.dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss")
                comments.unshift(comment)

                // 保存数据
                for (let i = 0; i < comments.length; i++) {
                    cJson[i] = comments[i]
                }
                JSON.stringify(cJson)

                fs.writeFile('./data/messageBoard/log.json', JSON.stringify(cJson), function (error) {
                    if (error) {
                        console.log('文件写入失败')
                    } else {
                        console.log('文件写入成功')
                    }

                })
            }

            res.statusCode = 302

            res.setHeader('Location', '/messageBoard')
            res.end()

        })
    }

    // 删除留言
    else if (pathname === '/deleteLog') {
        var cJson = {}
        var comments = []
        // 读取日志数据
        fs.readFile('./data/messageBoard/log.json', function (err, data) {
            if (err) { res.end('code:' + errorCode.not_found_data) }
            // 这里需要转换 data 数据类型为字符串(原本是二进制数据)
            var jsObj = JSON.parse(data.toString())
            // 这里只需要将 Json 文件中的各个值传入 comments 数组就行
            for (key in jsObj) {
                comments[key] = jsObj[key]
            }
            console.log('读取文件成功！')

            let pData = parseObj.query
            let temp = []
            for (let i = 0; i < comments.length; i++) {
                if (i != comments.length - pData.id) {
                    temp.push(comments[i])
                }
            }
            comments = temp

            // 保存数据
            for (let i = 0; i < comments.length; i++) {
                cJson[i] = comments[i]
            }
            JSON.stringify(cJson)

            fs.writeFile('./data/messageBoard/log.json', JSON.stringify(cJson), function (error) {
                if (error) {
                    console.log('文件写入失败')
                } else {
                    console.log('文件写入成功')
                }

            })

            res.statusCode = 302
            res.setHeader('Location', '/messageBoard')
            res.end()

        })
    }

    // 未定义路由
    else {
        // 其他的都处理成 404 页面
        res.end('code:' + errorCode.path_name_is_illegal)
    }

}).listen(port, function () {
    let link = 'http://' + host + ':' + port + '/';
    console.log('>>>app start!点击以下链接进行访问：%o', link)
})


Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}