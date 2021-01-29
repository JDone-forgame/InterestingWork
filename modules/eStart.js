// 启动器
let http = require('http');
let url = require('url');
let fs = require('fs');
let util = require('util');
let querystring = require('querystring');

let express = require('express');
let bodyParser = require('body-parser');
let multer = require('multer');
let cookieParser = require('cookie-parser');

let config = require('./config.json');
const { route } = require('./router');
if (!config) {
    config = {
        "host": "127.0.0.1",
        "port": "10001",
        "indexPage": "/public/html/index.html"
    }
}

// 使用 express 框架
var app = express();


// 启用缓存
app.use(cookieParser());


// 静态文件：图片， CSS, JavaScript 等
app.use('/public', express.static('public'));


// 表单 enctype 属性设置为 multipart/form-data 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/' }).array('image'));


// 创建 application/x-www-form-urlencoded 编码解析
let urlencodedParser = bodyParser.urlencoded({ extended: false });


// 首页
app.get('/', function (req, res) {
    res.sendFile(__dirname + config.indexPage);
})





app.get('/route/submitForm', (req, res) => {
    console.log('>>>到达了 submit 分支')
    res.end('ok')
})













let server = app.listen(config.port, config.host, () => {
    var host = server.address().address
    var port = server.address().port

    let link = 'http://' + host + ':' + port + '/';
    console.log('>>>应用启动成功,请通过以下链接访问:%o', link)

})