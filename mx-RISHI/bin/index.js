// 如果存在这个对象表示当前运行在pkg模式下
if (process.pkg) {
    require("./app/pkg");
}
else {
    require("./app/start");
}
//# sourceMappingURL=index.js.map