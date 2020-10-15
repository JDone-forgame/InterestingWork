fs = require('fs');
function index(response){
    console.log('index ');
    response.writeHead(200,{'Content-Type':'text/html'});
    var readHtml = fs.createReadStream(__dirname+'/index.html');
    readHtml.pipe(response);
}
function test(response){
    response.writeHead(200,{'Content-Type':'text/html'});
    var readHtml = fs.createReadStream(__dirname+'/test2.html');
    readHtml.pipe(response);
}
function requide(response,parm){
    response.writeHead(200,{'Content-Type':'application/json'});
    response.end(JSON.stringify(parm));
}
module.exports={index,test,requide};