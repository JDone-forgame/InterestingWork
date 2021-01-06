let pItems = {"i001":{"sID":"i001","sItemName":"筑基丹","sItemType":1,"sDescribe":"使用后可以增加突破筑基的概率!","sEffect":"addReiki|500","sQuality":"A","sImgUrl":"zhujidan.png"},"i002":{"sID":"i002","sItemName":"阴女丹","sItemType":1,"sDescribe":"使用后可以增加突破筑基的概率!","sEffect":"addReiki|1000","sQuality":"S","sImgUrl":"yinnvdan.png"},"i003":{"sID":"i003","sItemName":"清风丸","sItemType":1,"sDescribe":"使用后可以增加少量灵气!","sEffect":"addReiki|100","sQuality":"B","sImgUrl":"qingfengwan.png"},"i101":{"sID":"i101","sItemName":"基础功法","sItemType":2,"sDescribe":"使用后可以学习基础修仙功法!","sEffect":"learnAtk|a001|1","sQuality":"C","sImgUrl":"jichugongfa.png"},"i102":{"sID":"i102","sItemName":"青元剑诀","sItemType":2,"sDescribe":"使用后可以学习青元剑诀!","sEffect":"learnAtk|a002|1","sQuality":"A","sImgUrl":"qingyuanjianjue.png"},"i103":{"sID":"i103","sItemName":"金翎功法","sItemType":2,"sDescribe":"使用后可以学习金翎功法!","sEffect":"learnAtk|a003|2","sQuality":"B","sImgUrl":"jinlinggongfa.png"},"i104":{"sID":"i104","sItemName":"无相水诀","sItemType":2,"sDescribe":"使用后可以学习无相水诀!","sEffect":"learnAtk|a004|3","sQuality":"A","sImgUrl":"wuxiangshuijue.png"},"i105":{"sID":"i105","sItemName":"龙幽千影诀","sItemType":2,"sDescribe":"使用后可以学习龙幽千影诀!","sEffect":"learnAtk|a005|4","sQuality":"S","sImgUrl":"longyouqianyingjue.png"},"i106":{"sID":"i106","sItemName":"下品灵石","sItemType":3,"sDescribe":"黯淡的灵石，散发着微弱的灵气。","sEffect":"None","sQuality":"C","sImgUrl":"xiapinlingshi.png"},"i107":{"sID":"i107","sItemName":"中品灵石","sItemType":3,"sDescribe":"光亮的灵石，灵气充沛。","sEffect":"None","sQuality":"B","sImgUrl":"zhongpinlingshi.png"},"i108":{"sID":"i108","sItemName":"高品灵石","sItemType":3,"sDescribe":"闪亮的灵石，内里有灵气如实质般流动。","sEffect":"None","sQuality":"A","sImgUrl":"gaopinlingshi.png"},"i109":{"sID":"i109","sItemName":"极品灵石","sItemType":3,"sDescribe":"耀眼的灵石，十分光滑，散发的灵气令周围空气中的灵气紊乱。","sEffect":"None","sQuality":"S","sImgUrl":"jipinlingshi.png"}}


let Items = new Map();

function dataInit() {
    for (let key in pItems) {
        Items.set(key, pItems[key]);
    }
    console.log(Items)
}

dataInit();