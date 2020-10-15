// 出一个类型接口
// 块
export interface iMapData {
    // 坐标
    coordinate: { x: number, y: number, }
    // 用于存放可放置类型的 typeId
    typeId: string,
    // 本身灵气
    selfAnima: number,
    // 繁荣度
    boom: number,
    // 效果信息
    effectInfo: string,
    // 块名称
    pieceName: string,
    // 块颜色
    pieceColor: string,
    // 块图片
    pieceImage: string,
    // 块最大人口
    pieceMaxPeopleLimit: number
}

// 出一个固定设计的对象



// 初始域
export var DMapLocation = {
    x: 0,
    y: 0
}

// 状态码
export enum ErrorCode {
    ok = 0,
    param_error = 1,
    res_not_found = 2

}






















// 初始化域
export var imapdata:Array<iMapData> =[
    {
        coordinate: { x: -1, y: 1 },
        typeId: "c0",
        selfAnima: 0,
        boom: 0,
        effectInfo: "就是一块普通的土地",
        pieceName: "土地",
        pieceColor: "DimGray",
        pieceImage: "",
        pieceMaxPeopleLimit: 0
    },
    {
        coordinate: { x: 0, y: 1 },
        typeId: "c0",
        selfAnima: 0,
        boom: 0,
        effectInfo: "就是一块普通的土地",
        pieceName: "土地",
        pieceColor: "DimGray",
        pieceImage: "",
        pieceMaxPeopleLimit: 0
    },
    {
        coordinate: { x: 1, y: 1 },
        typeId: "c0",
        selfAnima: 0,
        boom: 0,
        effectInfo: "就是一块普通的土地",
        pieceName: "土地",
        pieceColor: "DimGray",
        pieceImage: "",
        pieceMaxPeopleLimit: 0
    },
    {
        coordinate: { x: -1, y: 0 },
        typeId: "c0",
        selfAnima: 0,
        boom: 0,
        effectInfo: "就是一块普通的土地",
        pieceName: "土地",
        pieceColor: "DimGray",
        pieceImage: "",
        pieceMaxPeopleLimit: 0
    },
    {
        coordinate: { x: 0, y: 0 },
        typeId: "c0",
        selfAnima: 0,
        boom: 0,
        effectInfo: "就是一块普通的土地",
        pieceName: "土地",
        pieceColor: "DimGray",
        pieceImage: "",
        pieceMaxPeopleLimit: 0
    },
    {
        coordinate: { x: 1, y: 0 },
        typeId: "c0",
        selfAnima: 0,
        boom: 0,
        effectInfo: "就是一块普通的土地",
        pieceName: "土地",
        pieceColor: "DimGray",
        pieceImage: "",
        pieceMaxPeopleLimit: 0
    },
    {
        coordinate: { x: -1, y: -1 },
        typeId: "c0",
        selfAnima: 0,
        boom: 0,
        effectInfo: "就是一块普通的土地",
        pieceName: "土地",
        pieceColor: "DimGray",
        pieceImage: "",
        pieceMaxPeopleLimit: 0
    },
    {
        coordinate: { x: 0, y: -1 },
        typeId: "c0",
        selfAnima: 0,
        boom: 0,
        effectInfo: "就是一块普通的土地",
        pieceName: "土地",
        pieceColor: "DimGray",
        pieceImage: "",
        pieceMaxPeopleLimit: 0
    },
    {
        coordinate: { x: 1, y: -1 },
        typeId: "c0",
        selfAnima: 0,
        boom: 0,
        effectInfo: "就是一块普通的土地",
        pieceName: "土地",
        pieceColor: "DimGray",
        pieceImage: "",
        pieceMaxPeopleLimit: 0
    }
]