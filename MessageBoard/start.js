// app application 应用程序
// 把当前模块所有的依赖项都声明在文件模块最上面
// 为了让目录结构保持统一清晰，所以约定把所有 html 文件都放到 views (视图)里
// 为了方便统一处理静态资源，约定把所有的静态资源都存放在 public 目录中
// 通过代码控制哪些资源可以被用户访问，哪些不可以

var http = require('http')
var fs = require('fs')
var template = require('art-template')
var url = require('url')

var cJson = {}
var comments = []

// 读取日志数据
fs.readFile('./data/log.json', function(err, data) {
    if (err) { return console.log('读取数据文件失败') }
    // 这里需要转换 data 数据类型为字符串(原本是二进制数据)
    var jsObj = JSON.parse(data.toString())
    // 这里只需要将 Json 文件中的各个值传入 comments 数组就行
    for (key in jsObj) {
        comments[key] = jsObj[key]
    }
    console.log('读取文件成功！')
})

// 对于表单提交的请求路径，判断

http.createServer(function(req, res) {
    // 通过 parse 方法，true 参数确定是否将 url 转换为一个对象方便处理
    var parseObj = url.parse(req.url, true)

    // 单独获取不包含查询字符串的路径部分
    var pathname = parseObj.pathname

    if (pathname === '/') {
        // 读取首页
        fs.readFile('./views/index.html', function(err, data) {
            if (err) {
                return res.end('404')
            }

            var htmlStr = template.render(data.toString(), {
                comments: comments
            })

            // 响应页面
            res.end(htmlStr)
        })
    } else if (pathname === '/postLog') {
        // 进入写留言页面
        fs.readFile('./views/postLog.html', function(err, data) {
            if (err) { return res.end('404') }
            res.end(data)
        })
    } else if (pathname === '/sendLog') {
        // 发送留言
        // 使用了 url 模块的 parse 方法把请求路径中的查询字符串给解析成一个对象
        // 接下来！
        //      1，获取表单数据
        //      2，生成日期数据，存储到数组中
        //      3，重定向到首页
        let comment = parseObj.query
        if(comment.message != ""){
            // id 用于删除使用，相当于数组下标
            comment.id = comments.length + 1
            // listId 用于展示楼数，即使曾经的楼删除了，新的楼数只增不减
            comment.listId = comments[0]?comments[0].listId+1:1
            comment.name === "" ? comment.name = '没留名的狠人' : comment.name
            comment.dateTime = new Date().Format("yyyy-MM-dd hh:mm:ss")
            comments.unshift(comment)
    
            // 保存数据
            for (let i = 0; i < comments.length; i++) {
                cJson[i] = comments[i]
            }
            JSON.stringify(cJson)
    
            fs.writeFile('./data/log.json', JSON.stringify(cJson), function(error) {
                if (error) {
                    console.log('文件写入失败')
                } else {
                    console.log('文件写入成功')
                }
    
            })
        }
        

        // 服务端已经处理好数据了，接下来让用户重新请求 / 首页
        // 1，状态码设置为 302 临时重定向
        //    statusCode
        // 2，在响应头中通过 Location 告诉客户端往哪重定向
        //    setHeader
        // 如果客户端发现接受到服务器的响应状态码是 302 就会自动去响应头中找 Location ，然后对该地址发起新请求，客户端就自动跳转了
        res.statusCode = 302

        // 第二个参数是重定向的地址
        res.setHeader('Location', '/')
        res.end()

    } else if (pathname.indexOf('/public/') === 0) {
        // /public/css/index.css
        // /public/js/test.js
        // /public/lib/jquery.js
        // 统一处理：如果请求路径是以 /public/ 开头的，则认为要获取 public 中的某个资源
        // 所以直接把请求路径当作资源路径直接进行读取
        fs.readFile('.' + pathname, function(err, data) {
            if (err) { return res.end('404') }
            res.end(data)
        })
    }
    else if (pathname === '/deleteLog') {
        let data = parseObj.query
        let temp = []
        for(let i=0 ;i<comments.length;i++){
            if(i != comments.length-data.id){
                temp.push(comments[i])
            }
        }
        comments = temp

        // 保存数据
        for (let i = 0; i < comments.length; i++) {
            cJson[i] = comments[i]
        }
        JSON.stringify(cJson)

        fs.writeFile('./data/log.json', JSON.stringify(cJson), function(error) {
            if (error) {
                console.log('文件写入失败')
            } else {
                console.log('文件写入成功')
            }

        })

        res.statusCode = 302
        res.setHeader('Location', '/')
        res.end()

    } else {
        // 其他的都处理成 404 页面
        fs.readFile('./views/404.html', function(err, data) {
            if (err) { return res.end('404') }
            res.end(data)
        })
    }
}).listen(4010, function() {
    console.log('>>>app start!')
})

Date.prototype.Format = function(fmt) { // author: meizz
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