var ser = require('./server');//服务模块
var handler = require('./handle');//处理模块
var router = require('./router');//路由模块
 
var handle = {};
handle['/'] = handler.index;
handle['/test'] = handler.test;
handle['/requide'] = handler.requide;//处理模块的函数封装到对象数组里
ser.serve(router.router,handle);