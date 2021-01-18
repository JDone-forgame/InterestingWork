let pItems = { "i001": { "sID": "i001", "sItemName": "筑基丹", "sItemType": 1, "sDescribe": "使用后可以增加突破筑基的概率!", "sEffect": "addReiki|500", "sQuality": "A", "sImgUrl": "zhujidan.png" }, "i002": { "sID": "i002", "sItemName": "阴女丹", "sItemType": 1, "sDescribe": "使用后可以增加突破筑基的概率!", "sEffect": "addReiki|1000", "sQuality": "S", "sImgUrl": "yinnvdan.png" }, "i003": { "sID": "i003", "sItemName": "清风丸", "sItemType": 1, "sDescribe": "使用后可以增加少量灵气!", "sEffect": "addReiki|100", "sQuality": "B", "sImgUrl": "qingfengwan.png" }, "a001": { "sID": "a001", "sItemName": "基础功法", "sItemType": 2, "sDescribe": "使用后可以学习基础修仙功法!", "sEffect": "learnAtk|a001|1", "sQuality": "C", "sImgUrl": "jichugongfa.png" }, "a002": { "sID": "a002", "sItemName": "青元剑诀", "sItemType": 2, "sDescribe": "使用后可以学习青元剑诀!", "sEffect": "learnAtk|a002|1", "sQuality": "A", "sImgUrl": "qingyuanjianjue.png" }, "a003": { "sID": "a003", "sItemName": "金翎功法", "sItemType": 2, "sDescribe": "使用后可以学习金翎功法!", "sEffect": "learnAtk|a003|1", "sQuality": "B", "sImgUrl": "jinlinggongfa.png" }, "a004": { "sID": "a004", "sItemName": "无相水诀", "sItemType": 2, "sDescribe": "使用后可以学习无相水诀!", "sEffect": "learnAtk|a004|1", "sQuality": "A", "sImgUrl": "wuxiangshuijue.png" }, "a005": { "sID": "a005", "sItemName": "龙幽千影诀", "sItemType": 2, "sDescribe": "使用后可以学习龙幽千影诀!", "sEffect": "learnAtk|a005|1", "sQuality": "S", "sImgUrl": "longyouqianyingjue.png" }, "ma001": { "sID": "ma001", "sItemName": "下品灵石", "sItemType": 3, "sDescribe": "黯淡的灵石，散发着微弱的灵气。", "sEffect": "None", "sQuality": "C", "sImgUrl": "xiapinlingshi.png" }, "ma002": { "sID": "ma002", "sItemName": "中品灵石", "sItemType": 3, "sDescribe": "光亮的灵石，灵气充沛。", "sEffect": "None", "sQuality": "B", "sImgUrl": "zhongpinlingshi.png" }, "ma003": { "sID": "ma003", "sItemName": "高品灵石", "sItemType": 3, "sDescribe": "闪亮的灵石，内里有灵气如实质般流动。", "sEffect": "None", "sQuality": "A", "sImgUrl": "gaopinlingshi.png" }, "ma004": { "sID": "ma004", "sItemName": "极品灵石", "sItemType": 3, "sDescribe": "耀眼的灵石，十分光滑，散发的灵气令周围空气中的灵气紊乱。", "sEffect": "None", "sQuality": "S", "sImgUrl": "jipinlingshi.png" }, "eq001": { "sID": "eq001", "sItemName": "冰影披风", "sItemType": 4, "sDescribe": "使用可以装备上冰影披风。[技能]：冰影闪", "sEffect": "changeEquip|eq001", "sQuality": "B", "sImgUrl": "bingyingpifeng.png" }, "eq002": { "sID": "eq002", "sItemName": "青影剑", "sItemType": 4, "sDescribe": "使用可以装备上青影剑。", "sEffect": "changeEquip|eq002", "sQuality": "A", "sImgUrl": "qingyingjian.png" } }

// 所有道具信息
let Items = new Map();

// 品质颜色
const qualityColor = new Map()
qualityColor['S'] = '#FFD700';
qualityColor['A'] = '#9400D3';
qualityColor['B'] = '#87CEFA';
qualityColor['C'] = '#32CD32';

// 请求地址
const local = 'http:127.0.0.1:19000/game';
const reqUrls = {
    loginUrl: local + '/local/login',
    itemsOptionUrl: local + '/local/itemsOption',
}

// 表格数据初始化
function tableDataInit() {
    for (let key in pItems) {
        Items.set(key, pItems[key]);
    }
    console.log(Items)
}

tableDataInit();
