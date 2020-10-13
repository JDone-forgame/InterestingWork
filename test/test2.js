let fs = require('fs')
var http = require('http')
var url = require('url')
var template = require('art-template')

let listc = []
let lists = []
let showlist = []


fs.readFile('./test1.json', function (err, data) {
    if (err) { return console.log('读取数据文件失败') }
    var jsObj = JSON.parse(data.toString())
    for (key in jsObj) {
        listc[key] = jsObj[key]
        lists[key] = jsObj[key].s
        // console.log(listc[key].s.x)
        // console.log(listc[key])
    }
    console.log('读取文件成功！')
    // console.log('listc',listc)
    // console.log('lists',lists)
})


http.createServer(function (req, res) {
    var parseObj = url.parse(req.url, true)
    var pathname = parseObj.pathname
    if (pathname === '/') {
        fs.readFile('./index.html', function (err, data) {
            if (err) {
                return res.end('404')
            }

            for (let i = 0; i < 9; i++) {
                showlist[i] = listc[i]
            }

            var htmlStr = template.render(data.toString(), {
                showlist: showlist
            })

            // 响应页面
            res.end(htmlStr)
        })
    } else if (pathname === '/rightm') {
        fs.readFile('./index.html', function (err, data) {
            if (err) {
                return res.end('404')
            }

            for (let j = 9; j < 18; j++) {
                for (let i = 0; i < 9; i++) {
                    showlist[i] = listc[j]
                }
            }

            var htmlStr = template.render(data.toString(), {
                showlist: showlist
            })

            // 响应页面
            res.end(htmlStr)
        })
    }

}).listen(4000, function () {
    console.log('>>>app start!')
})



