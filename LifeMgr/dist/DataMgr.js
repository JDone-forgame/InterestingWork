"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defData = void 0;
let fs = require('fs');
class DataMgr {
    static getData(jsonName) {
        let result;
        // fs.readFile('../data/' + jsonName + '.json', function (err: any, data: any) {
        fs.readFile('../data/keys.json', function (err, data) {
            if (err) {
                return console.log('>>>DataMgr:读取数据文件失败');
            }
            // 这里需要转换 data 数据类型为字符串(原本是二进制数据)
            let jsObj = JSON.parse(data.toString());
            // 这里只需要将 Json 文件中的各个值传入 result 数组就行
            for (let key of jsObj) {
                result.push(key);
            }
            console.log('>>>DataMgr:读取文件成功！');
            return result;
        });
        return null;
    }
}
exports.defData = {
    "keyData": DataMgr.getData('keys'),
};
//# sourceMappingURL=DataMgr.js.map