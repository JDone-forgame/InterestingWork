import * as fs from 'fs';
import { infKeyInfo } from './define';

export class DataMgr {

    static getDataArr(jsonName: string, keyName: string) {
        //判断是否存在此文件
        let url = 'data/' + jsonName + '.json';
        if (fs.existsSync(url)) {
            //读取文件内容，并转化为Json对象
            let jsonData = JSON.parse(fs.readFileSync(url, "utf8"));
            //获取Json里key为data的数据
            const resultArr = jsonData[keyName];
            console.log('>>>读取文件成功！');
            return resultArr;
        }
        return console.log('>>>读取数据文件失败!');

    }

    static saveData(jsonName: string, keyName: string, newData: infKeyInfo) {
        let dataArr: infKeyInfo[] = this.getDataArr(jsonName, keyName);
        let saveNew = true;
        for (let key in dataArr) {
            if (dataArr[key].firstWord == newData.firstWord && dataArr[key].otherWord == newData.otherWord) {
                dataArr[key] = newData;
                saveNew = false;
            }
        }
        if (saveNew) {
            dataArr.push(newData);
        }
        let url = 'data/' + jsonName + '.json';
        let jsonData = JSON.parse(fs.readFileSync(url, "utf8"));
        jsonData[keyName] = dataArr;

        fs.writeFile('./' + url, JSON.stringify(jsonData, null, "\t"), function (error) {
            if (error) {
                console.log('>>>文件写入失败!')
            } else {
                console.log('>>>文件写入成功!')
            }

        })

    }

}

export var defData = {
    "keyData": DataMgr.getDataArr('keys', 'data'),

}
