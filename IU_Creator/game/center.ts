let fs = require('fs')
import { ErrorCode, imapdata, iMapData } from "../defines/define"

export class Gcenter {
    static init() {
        console.log('>>>Gcenter加载成功')
        return
    }

    // 加载当前要显示的9块地图数据
    static loadMap(mapData: Array<iMapData>, x: number, y: number) {
        let mapDataNine = []
        // 这种方法获取数据是靠挨个查询匹配，应该可以优化成按下标匹配
        for (let i in mapData) {
            if (mapData[i].coordinate.x === x - 1) {
                if (mapData[i].coordinate.y === y + 1) {
                    mapDataNine[0] = mapData[i]
                }
                if (mapData[i].coordinate.y === y) {
                    mapDataNine[3] = mapData[i]
                }
                if (mapData[i].coordinate.y === y - 1) {
                    mapDataNine[6] = mapData[i]
                }
            }
            if (mapData[i].coordinate.x === x) {
                if (mapData[i].coordinate.y === y + 1) {
                    mapDataNine[1] = mapData[i]
                }
                if (mapData[i].coordinate.y === y) {
                    mapDataNine[4] = mapData[i]
                }
                if (mapData[i].coordinate.y === y - 1) {
                    mapDataNine[7] = mapData[i]
                }
            }
            if (mapData[i].coordinate.x === x + 1) {
                if (mapData[i].coordinate.y === y + 1) {
                    mapDataNine[2] = mapData[i]
                }
                if (mapData[i].coordinate.y === y) {
                    mapDataNine[5] = mapData[i]
                }
                if (mapData[i].coordinate.y === y - 1) {
                    mapDataNine[8] = mapData[i]
                }
            }
        }
        return mapDataNine
    }

    // 保存当前地图数据
    static saveMap(mapData: Array<iMapData>, mapDataNine: Array<iMapData>) {
        // 判断 mapData 中是否有数据，初始化一下
        if (mapData.length === undefined) {
            mapData = imapdata
        }

        // 判断此域是否在数据库中存在,如果存在，赋值
        // numExist 用于计算有多少个数据库中有的数据，
        // 如果一个没匹配到那就相当于没有这一域的数据，
        // 直接连接两个数组即可
        let numExist = 0
        for (let i in mapData) {
            for (let j of mapDataNine) {
                if (mapData[i].coordinate.x === j.coordinate.x && mapData[i].coordinate.y === j.coordinate.y) {
                    numExist = numExist + 1
                    if(JSON.stringify(mapData[i])===JSON.stringify(j)) break
                    mapData[i] = j
                }

            }
        }
        if (numExist === 0) {
            mapData = mapData.concat(mapDataNine)
        }
        

        return mapData
    }
}