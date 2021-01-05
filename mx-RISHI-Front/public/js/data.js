let pItems = {
    "i001": {
        "sID": "i001",
        "sItemName": "筑基丹",
        "sItemType": 1,
        "sDescribe": "使用后可以增加突破筑基的概率!",
        "sEffect": "addReiki|100",
        "sQuality": "A",
        "sImgUrl": "zhujidan.png"
    },
    "i002": {
        "sID": "i002",
        "sItemName": "阴女丹",
        "sItemType": 1,
        "sDescribe": "使用后可以增加突破筑基的概率!",
        "sEffect": "addReiki|1000",
        "sQuality": "S",
        "sImgUrl": "yinnvdan.png"
    },
    "i003": {
        "sID": "i003",
        "sItemName": "清风丸",
        "sItemType": 1,
        "sDescribe": "使用后可以增加少量灵气!",
        "sEffect": "addReiki|100",
        "sQuality": "B",
        "sImgUrl": "qingfengwan.png"
    },
    "i101": {
        "sID": "i101",
        "sItemName": "基础功法",
        "sItemType": 2,
        "sDescribe": "使用后可以学习基础修仙功法!",
        "sEffect": "learnAtk|a001|1",
        "sQuality": "B",
        "sImgUrl": "jichugongfa.png"
    }
}


let Items = new Map();

function dataInit() {
    for (let key in pItems) {
        Items.set(key, pItems[key]);
    }
    console.log(Items)
}

dataInit();