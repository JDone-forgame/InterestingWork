# 学习笔记
1. 初始化
    指令:npx mx-serve init
2. 生成启动用的文件
    指令:npx mx-serve app
3. configMgr 在 defines/defalutConfig.ts 中
    在里面配置端口，但还是要 config.json 文件
4. @param {string} password.query.required
    不加 required 就不是必需参数
5. @returns {{code:number,data:string}} 0 - 返回成功
    后面这个 0 注释得有
6. @RPCHandle.class("game", module)
    模块注册的名称，决定了启动的模块名称
    rpc所有流程都要调整
    和group要求是一致
7. 关于读表
    let b = TablesService.getModule('Items')
    let b1 = b?.getAllRes();  ``全部数据``
    let b2 = b?.getRes('i001');  ``sid 对应的数据``
    let b3 = b?.has('i001');  ``boolean 类型``
    let b4 = b?.resData  ``全部数据``
8. tsconfig
   严格模式要关一下，不然role里获取缓存返回为空时会报错
    "strict": false,
9. 表格
    表格的属性要用 s、r、i开头，不然生成的 interface 会有问题。
10. static
    role 中带有 static 修饰的方法在不创建该实例对象时也可以使用，但里面无法调用其他的非 static 方法，这里需要注意哪种方法用 static 方法，哪种不用。