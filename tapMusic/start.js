var http = require('http')
var fs = require('fs')
var url = require('url')

http.createServer(function(req, res) {
    // 通过 parse 方法，true 参数确定是否将 url 转换为一个对象方便处理
    var parseObj = url.parse(req.url, true)

    // 单独获取不包含查询字符串的路径部分
    var pathname = parseObj.pathname

    if (pathname === '/') {
        // 读取首页
        fs.readFile('./index.html', function(err, data) {
            if (err) {
                return res.end('404')
            }
            // 响应页面
            res.end(data)
        })
    }
    else if (pathname.indexOf('/public/') === 0) {
        fs.readFile('.' + pathname, function(err, data) {
            if (err) { return res.end('404') }
            res.end(data)
        })
    } else {
        // 其他的都处理成 404 页面
        res.end("404")
    }
}).listen(4080, function() {
    console.log('>>>app start!')
})