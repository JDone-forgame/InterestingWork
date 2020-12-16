const ATKknow = [{
    atkName: '青元剑诀',
    needFelement: 'Wood|8',
    handledSpeed: 0.8,
    maxLevel: 15,
},
{
    atkName: '基础功法',
    needFelement: 'any|2',
    handledSpeed: 0.2,
    maxLevel: 15,
}
]

const Rlevel = [{
    levelName: '练气',
    needReiki: '1|1999',
    eachGroup: 120
},
{
    levelName: '筑基',
    needReiki: '2000|9999',
    eachGroup: 2500
},
{
    levelName: '结丹',
    needReiki: '10000|99999',
    eachGroup: 30000
},
{
    levelName: '元婴',
    needReiki: '100000|999999',
    eachGroup: 300000
}
]

const Items = [
    {
        itemId: 'i001',
        itemName: "筑基丹",
        itemEffect: "addReiki|",
        quality: "A",
        imgUrl: "zhujidan.png",
        descri: "<p>使用后可以增加突破筑基的概率!</p>",
    },
    {
        itemId: 'i002',
        itemName: "阴女丹",
        itemEffect: "addReiki|",
        quality: "S",
        imgUrl: "yinnvdan.png",
        descri: "<p>使用后可以增加突破筑基的概率!</p>",
    },
    {
        itemId: 'i003',
        itemName: "清风丸",
        itemEffect: "addReiki|100",
        quality: "B",
        imgUrl: "qingfengwan.png",
        descri: "<p>使用后可以增加少量灵气!</p>",
    },
    {
        itemId: 'i101',
        itemName: "基础功法",
        itemEffect: "learnAtk|基础功法|1",
        quality: "B",
        imgUrl: "jichugongfa.png",
        descri: "<p>使用后可以学习基础修仙功法!</p>",
    },
]

const Task = []

let msgs = []

// 初始元素总量
const DEFAULT_ELENUM = 10;



// 保存游戏
function saveGameData(player) {
    if (checkLocalData(player.name)) {
        localStorage.removeItem(player.name);
    }
    let data = JSON.stringify(player)
    sessionStorage.setItem(player.name, data);
    localStorage.setItem(player.name, data);
    return;
}

// 获取玩家数据
function getPlayerData(name) {
    let player = JSON.parse(sessionStorage.getItem(name));

    // 先从缓存找
    if (!player) {
        if (!checkLocalData(name)) {
            player = playerInit(name);
        } else {
            let qData = localStorage.getItem(name);
            player = JSON.parse(qData);
            sessionStorage.setItem(name, qData);
            player.isNew = false;
        }
    }

    return player
}

// 检查本地数据
function checkLocalData(name) {
    let qData = localStorage.getItem(name);
    if (qData) {
        return true;
    }
    return false;
}

// 获取道具信息
function getItems(name) {
    let player = this.getPlayerData(name);
    return player.items;
}

// 获取灵根属性
function getFel(name) {
    let player = this.getPlayerData(name);
    return player.Felements
}

// 添加道具
function addItem(name, itemId, number) {
    let addResult = false;
    let player = this.getPlayerData(name);

    // 待添加道具
    let aitem;
    // 是否是已存在道具
    let check = false;

    for (let item of Items) {
        if (item.itemId == itemId) {
            aitem = item;
            check = true;
            break;
        }
    }

    // 道具不存在
    if (!check) {
        return addResult;
    }

    Object.assign(aitem, { number: number });
    player.items.unshift(aitem)

    this.saveGameData(player);
    return addResult;
}

// 更新道具
function updata(name, itemId, number) {
    let player = this.getPlayerData(name);

    for (let item of player.items) {
        if (item.itemId == itemId) {
            item.number += number;
            return;
        }
    }

    this.saveGameData(player);
}

// 删除道具
function delItem(name, itemId) {
    let player = this.getPlayerData(name);
    let items = player.items;
    let newItems = [];

    for (let item of items) {
        if (item.itemId != itemId) {
            newItems.push(item);
        }
    }

    player.items = newItems;
    this.saveGameData(player);
}

// *是否是同一天
function isSameDay(timeStampA, timeStampB) {
    let dateA = new Date(timeStampA);
    let dateB = new Date(timeStampB);
    return (dateA.setHours(0, 0, 0, 0) == dateB.setHours(0, 0, 0, 0));
}

// *检查有几种属性
function checkFiveElemets(player) {
    let obj = player.Felements
    let count = 0;
    if (!obj) {
        return count;
    }
    for (let i in obj) {
        if (obj[i] > 0) {
            count += 1;
        }
    }
    return count;
}

// *计算几种属性对修炼的影响
function countEEffect(num) {
    let expEffect = 0;
    switch (num) {
        case 0:
            expEffect = 0;
            break;
        case 1:
            expEffect = 1.5;
            break;
        case 2:
            expEffect = 1.2;
            break;
        case 3:
            expEffect = 1;
            break;
        case 4:
            expEffect = 0.8;
            break;
        case 5:
            expEffect = 0.5;
            break;
    }
    return expEffect;
}

// 角色初始化
function playerInit(name) {
    let a = randomFel();
    let b = randomSHead();
    let player = {
        name: name,
        Felements: {
            Metal: a[0],
            Wood: a[1],
            Water: a[2],
            Fire: a[3],
            Earth: a[4]
        },
        isNew: true,
        sex: b[0],
        headUrl: b[1],
        handledSpeed: 0,
        reiki: 0,
        lastCTime: Date.now(),
        atk: {
            learnAtk: '',
            atkName: '',
            atkLevel: 0,
        },
        label: [],
        Rlevel: '',
        items: [],
        task: [],
    }
    if (checkFiveElemets(player) == 1) {
        addMsg("惊人!你居然是百年难得一见的天灵根!");
        player.label.push('幸运儿');
    }
    return player;
}

// 消息板
function addMsg(msg) {
    msg = '<p>' + msg + '</p>';
    msgs.push(msg)
}

// 随机五属性
function randomFel() {
    let result = [0, 0, 0, 0, 0]
    let min = 0;
    let max = DEFAULT_ELENUM;

    for (let i = 0; i < 5; i++) {
        result[i] = getRandom(min, max);
        max -= result[i];
        if (max <= 0) {
            break;
        }
    }

    return shuffle(result);
}

// 随机指定一条属性 eg:'R',0,0
function randomEle(elementName, min, max) {
    let result = {
        elementName: "",
        num: 0
    }

    // 随机属性
    if (elementName == "R") {
        let a = getRandom(1, 5);
        switch (a) {
            case 1:
                result.elementName = 'Fire';
                break;
            case 2:
                result.elementName = 'Wood';
                break;
            case 3:
                result.elementName = 'Metal';
                break;
            case 4:
                result.elementName = 'Water';
                break;
            case 5:
                result.elementName = 'Earth';
                break;
        }
    } else {
        result.elementName = elementName;
    }

    // 随机数值
    if (max == 0) {
        result.num = getRandom(min, max)
    } else {
        result.num = max;
    }

    return result;
}

// 随机性别头像
function randomSHead() {
    let result = []
    let sex = getRandom(0, 1)
    if (sex == 0) {
        result[0] = '男';
        result[1] = 'nan/' + getRandom(1, 10) + '.png';
    } else {
        result[0] = '女';
        result[1] = 'nv/' + getRandom(1, 10) + '.png';
    }
    return result
}

// 查询功法
function searchAtk(atkName) {
    for (let i in ATKknow) {
        if (atkName == ATKknow[i].atkName) {
            return ATKknow[i];
        }
    }
    return null;
}

// *随机从[min,max]区间取值
function getRandom(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

// *数组、洗牌算法乱序
function shuffle(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let rIndex = Math.floor(Math.random() * (i + 1));
        let temp = arr[rIndex];
        arr[rIndex] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

// 学习功法
function learnAtkUsed(name, atkName, isFirst) {
    let player = getPlayerData(name);


    let atk = searchAtk(atkName);
    if (atk == null) {
        return addMsg('没有这种功法!');
    }


    // 属性要求
    let needFelement = atk.needFelement.split('|');
    if (needFelement.length != 2) {
        return addMsg('这个功法的需求有问题!');
    }


    let fel = player.Felements;
    let pAtk = player.atk;


    if (!isFirst) {
        if (pAtk.atkLevel < atk.maxLevel) {
            pAtk.atkLevel += 1;
        } else {
            return addMsg('你已修炼到该功法的最高等级!');
        }
    } else {
        pAtk.atkLevel = 1;
    }


    // 对属性没有要求
    if (needFelement[0] == "any") {
        for (let i in fel) {
            if (fel[i] > needFelement[1]) {
                pAtk.learnAtk = atkName + pAtk.atkLevel + '阶';
                pAtk.atkName = atkName;
                player.handledSpeed = atk.handledSpeed * pAtk.atkLevel;
                break;
            }
        }
    }
    // 对属性有要求
    else {
        for (let i in fel) {
            // 找到对应属性
            if (i == needFelement[0]) {
                if (fel[i] >= needFelement[1]) {

                    pAtk.learnAtk = atkName + pAtk.atkLevel + '阶';
                    player.handledSpeed = Math.round(atk.handledSpeed * pAtk.atkLevel);

                } else {
                    return addMsg('你的' + changeElement(i) + '灵根能力不够!');
                }
            }
        }
    }

    // 属性对修炼的影响
    let eefect = countEEffect(checkFiveElemets(player));

    saveGameData(player);

    return addMsg('学习' + atkName + '成功，当前修炼速度为每秒' + round((player.handledSpeed * eefect), 2) + '灵气!')
}

// *元素转文字
function changeElement(elementName) {
    let result = '';
    switch (elementName) {
        case "Metal":
            result = "<span class='metal'>金</span>";
            break;
        case "Wood":
            result = "<span class='wood'>木</span>";
            break;
        case "Water":
            result = "<span class='water'>水</span>";
            break;
        case "Fire":
            result = "<span class='fire'>火</span>";
            break;
        case "Earth":
            result = "<span class='earth'>土</span>";
            break;
    }
    return result;
}

// 散功
function learnAtkDrop(name) {
    let player = getPlayerData(name);


    player.atk.learnAtk = '';
    player.atk.atkName = '';
    player.atk.atkLevel = 0;
    player.handledSpeed = 0;


    player.reiki = round((getRandom(50, 90) / 100) * player.reiki, 1);
    player.lastCTime = Date.now();

    saveGameData(player);
    return addMsg('散功完成!');
}

// 计算灵气
function countReiki(name) {
    let player = getPlayerData(name);


    let nowTime = Date.now();
    let eefect = countEEffect(checkFiveElemets(player));


    if (nowTime > player.lastCTime) {
        let earnTime = (nowTime - player.lastCTime) / 1000;
        let addReiki = round((earnTime * player.handledSpeed * eefect), 2);
        return { addReiki: addReiki, newTime: nowTime };

    } else {
        addMsg('灵气尚未聚集!');
        return { addReiki: 0, newTime: nowTime };
    }
}

// 计算修炼等级
function checkRlevel(name) {
    let player = getPlayerData(name);
    let reiki = player.reiki;

    for (let i in Rlevel) {
        let needReiki = Rlevel[i].needReiki.split('|');
        if (needReiki.length != 2) {
            return addMsg('这个境界有问题!');
        }

        let min = +needReiki[0];
        let max = +needReiki[1]


        if (reiki >= min && reiki <= max) {

            let rlevel = Rlevel[i];
            let eachGroup = rlevel.eachGroup;
            let bRlevel = '';
            let b = rlevel.levelName == '练气' ? 15 : 3;


            for (b; b >= 0; b--) {
                if (reiki > (min + b * eachGroup)) {
                    bRlevel = b
                    switch (b) {
                        case 0:
                            bRlevel = rlevel.levelName == '练气' ? '一层' : '前期';
                            break;
                        case 1:
                            bRlevel = rlevel.levelName == '练气' ? '二层' : '中期';
                            break;
                        case 2:
                            bRlevel = rlevel.levelName == '练气' ? '三层' : '后期';
                            break;
                        case 3:
                            bRlevel = rlevel.levelName == '练气' ? '四层' : '大圆满';
                            break;
                        case 4:
                            bRlevel = '五层';
                            break;
                        case 5:
                            bRlevel = '六层';
                            break;
                        case 6:
                            bRlevel = '七层';
                            break;
                        case 7:
                            bRlevel = '八层';
                            break;
                        case 8:
                            bRlevel = '九层';
                            break;
                        case 9:
                            bRlevel = '十层';
                            break;
                        case 10:
                            bRlevel = '十一层';
                            break;
                        case 11:
                            bRlevel = '十二层';
                            break;
                        case 12:
                            bRlevel = '十三层';
                            break;
                        case 13:
                            bRlevel = '十四层';
                            break;
                        case 14:
                            bRlevel = '十五层';
                            break;
                        case 15:
                            bRlevel = '大圆满';
                            break;
                    }
                    break;
                }
            }
            player.Rlevel = rlevel.levelName + bRlevel;
            saveGameData(player);
            return;
        }
    }
}

// *取指定位数小数
function round(number, precision) {
    return Math.round(+number + 'e' + precision) / Math.pow(10, precision);
}

// 使用道具
function useItem(name, itemId) {
    let player = getPlayerData(name);
    let itemInfo = null;

    // 检查并扣除道具
    for (let item of player.items) {
        if (item.itemId == itemId) {
            itemInfo = item;
            if (item.number > 0) {
                item.number -= 1;
            } else {
                return addMsg('道具不足!');
            }
            break;
        }
    }

    // 道具效果
    let itemEffect = itemInfo.itemEffect.split('|')
    if (itemEffect.length < 2) {
        return addMsg('物品效果异常!!');;
    }


    switch (itemEffect[0]) {


        // 增加灵气
        case 'addReiki':
            player.reiki = round((player.reiki + Number(itemEffect[1])), 2);
            addMsg('使用物品成功，你的灵力增加了' + Number(itemEffect[1]) + '点!');
            break;


        // 学习功法
        case 'learnAtk':
            // 已学同样功法
            if (player.atk.atkName == itemEffect[1] && player.atk.atkName != '') {
                learnAtkUsed(player, itemEffect[1], false)
                addMsg('功法领悟完成，你的功法已经更进一步!');
                break;
            }

            // 未学习功法
            else if (player.atk.atkName == '' && itemEffect[1] != '') {
                learnAtkUsed(player, itemEffect[1], true)
                addMsg('功法领悟完成，你的主功法已经变为' + itemEffect[1] + '!');
                break;
            }

            // 已学功法，但道具功法不同
            else if (player.atk.atkName != '' && player.atk.atkName != itemEffect[1]) {
                addMsg('你当前功法与所学功法不匹配，请先散功!');
                break;
            }
    }

    saveGameData(player);
}



























