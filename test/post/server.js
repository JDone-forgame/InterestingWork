var http = require('http');//服务创建库
var fs = require('fs');//文件读取库
var url =require('url');//url解析库，参数解析等
var querystring = require('querystring');
 
var requestserve = function(router,handle){
    var onrequest = function(request,response){
    var pathname = url.parse(request.url).pathname;  //剔除url其他字符串，只要当前的文件路径
    console.log(pathname);
    
    var  data = "";
    request.on('error',function(err){//处理post的数据方法
        console.error(err);
    }).on('data',function(chuck){
        data+=chuck; //直接获取的是字符串数据
    }).on('end',function(){
        if(request.method ==='POST'){
            router(handle,pathname,response, querystring.parse(data));//将字符串转为json数据
        }else if(request.method==='GET'){
            var parm = url.parse(request.url,true).query;//得到url中的数据转为json,第二个参数如果为false时返回的是一个字符串
            router(handle,pathname,response, parm);
        }
        
    })
    
    }
    var serve = http.createServer(onrequest)
    serve.listen(3000,'127.0.0.1');
    console.log('服务运行在本地3000端口');
} 
 
exports.serve = requestserve;