function router(handle,pathname,response,parm){
    if(typeof handle[pathname]==='function'){
        handle[pathname](response,parm);
    }else{
        console.log('not found page');
    }
}

 
exports.router = router;