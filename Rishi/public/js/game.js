$(function () {
    /**-------------------------------------------------全局变量----------------------------------------------------------------- */
    let ATKknow = [{
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

    let Rlevel = [{
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

    let Items = [
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

    let Task = []

    let DEFAULT_ELENUM = 10;

    let curPlayer;

    let up;

    /**-------------------------------------------------前端方法----------------------------------------------------------------- */
    function startGame() {
        var name = $('#name').val();
        if (name == null || name == '') {
            showErrMsg('请输入您的名称!');
            return
        }

        if (!checkLocalData(name)) {
            curPlayer = playerInit(name);
        } else {
            curPlayer = JSON.parse(localStorage.getItem(name));
            curPlayer.isNew = false;
        }

        if (curPlayer.isNew) {
            console.log('新玩家');
            addItem(curPlayer, 'i003', 1);
            addItem(curPlayer, 'i101', 2);
        }

        // 测试用
        console.log(curPlayer);

        updata(curPlayer);
        showFel(curPlayer);

        $('#items').click(openPackage)
        $('#xbtn1').click(xbtn1);
        $('#save').click(saveGame);
        $('#head').html('<img src="./public/img/head/' + curPlayer.headUrl + '">')
        $('#KAISHI').hide();
        $('#XIULIAN').show();
    }

    function saveGame() {
        let name = curPlayer.name;
        let qData = localStorage.getItem(name);
        let data = JSON.stringify(curPlayer)
        if (qData) {
            localStorage.removeItem(name);
        }
        localStorage.setItem(name, data);
        showErrMsg('保存成功!');
    }

    function xbtn1() {
        let info = {
            funcName: "learnAtkDrop",
        }
        showUseMsg('<p>你确定要散功吗？散功会流失你的部分灵力!</p>', curPlayer, info)
    }

    function openPackage() {
        $('#KAISHI').hide();
        $('#XIULIAN').hide();
        showItems(curPlayer);
        $('#ITEMS').show();
        $('.item').click(usePackageItem)
        $('.close').click(() => {
            $('div').remove(".item");
            $('#ITEMS').hide();
            $('#XIULIAN').show();
        });
    }

    function usePackageItem() {
        let itemId = $(this).attr("id");
        console.log('查看' + itemId)
        let aitem;
        for (let item of Items) {
            if (item.itemId == itemId) {
                aitem = item;
            }
        }
        let info = {
            funcName: "useItem",
            itemId: itemId
        }
        showUseMsg(aitem.descri, curPlayer, info);
    }

    /**-------------------------------------------------后端方法----------------------------------------------------------------- */
    function showItems(player) {
        let items = player.items
        for (let item of items) {
            if (item.number > 0) {
                $('#ITEMS').append('<div id="' + item.itemId + '" class="item"><img src="./public/img/items/' + item.imgUrl + '"><span class="' + item.quality + '">' + item.itemName + '*' + item.number + '</span></div>')
            }

        }
    }

    function checkLocalData(name) {
        let qData = localStorage.getItem(name);
        if (qData) {
            return true
        }
        return false
    }

    function showFel(player) {
        let fel = player.Felements
        for (let i in fel) {
            if (fel[i] > 0) {
                let felName = changeElement(i);
                $('#fel').append('<p>' + felName + fel[i] + '</p>')
            }
        }
    }

    function addItem(player, itemId, number) {
        let aitem;
        let check = false;
        for (let item of Items) {
            if (item.itemId == itemId) {
                aitem = item;
                check = true;
                break;
            }
        }
        if (!check) {
            showErrMsg('没有这种物品!');
            return;
        }
        for (let item of player.items) {
            if (item.itemId == itemId) {
                item.number += number;
                return;
            }
        }
        Object.assign(aitem, { number: number });
        player.items.unshift(aitem)
        showErrMsg('<p>你获得了' + number + '个<span class="' + aitem.quality + '">' + aitem.itemName + '</span>!</p>');
    }

    function delItem(player, itemId) {
        let items = player.items;
        let index = 0;
        let check = true;
        let newArr = [];
        for (let item of items) {
            index += 1;
            if (item.itemId == itemId) {
                check = false;
                if (item.number > 1) {
                    item.number -= 1;
                    return;
                }
                continue;
            }
            newArr.unshift(item);
        }
        if (check) {
            showErrMsg('<p>没有这个道具!</p>')
            return;
        }
        player.items = newArr;
        console.log('index' + index + '道具' + player.items)
    }

    // fixme
    function useItem(player, itemId) {
        let itemInfo;
        for (let item of player.items) {
            if (item.itemId == itemId) {
                itemInfo = item;
                if (item.number == 0) {
                    showErrMsg('<p>道具不足!</p>')
                    return;
                }
                break;
            }
        }
        let itemEffect = itemInfo.itemEffect.split('|')
        if (itemEffect.length < 2) {
            showErrMsg('<p>物品效果异常!</p>')
            return;
        }
        switch (itemEffect[0]) {
            case 'addReiki':
                itemInfo.number -= 1;
                //delItem(player, itemId);
                player.reiki = round((player.reiki + Number(itemEffect[1])), 2);
                showErrMsg('<p>使用物品成功，你的灵力增加了' + Number(itemEffect[1]) + '点!</p>');
                break;
            case 'learnAtk':
                if (player.atk.atkName == itemEffect[1]) {
                    // delItem(player, itemId);
                    itemInfo.number -= 1;
                    learnAtkUsed(player, itemEffect[1], false)
                    showErrMsg('<p>功法领悟完成，你的功法已经更进一步!</p>');
                    break;
                }
                else if (player.atk.atkName == '') {
                    itemInfo.number -= 1;
                    // delItem(player, itemId);
                    learnAtkUsed(player, itemEffect[1], true)
                    showErrMsg('<p>功法领悟完成，你的主功法已经变为' + itemEffect[1] + '!</p>');
                    break;
                } else {
                    showErrMsg('<p>你当前功法与所学功法不匹配，请先散功!</p>');
                    break;
                }
        }
    }

    function updata(player) {
        up = setInterval(() => {
            countReiki(player, 0)
            checkRlevel(player)
            $('#reiki').text("灵力" + round(player.reiki, 2));
            $('#xinxi').html('<p>' + player.name + '</p>' + '<p>' + player.atk.learnAtk + '</p>' + '<p>' + player.Rlevel + '</p>');
        }, 1000);
    }

    function isSameDay(timeStampA, timeStampB) {
        let dateA = new Date(timeStampA);
        let dateB = new Date(timeStampB);
        return (dateA.setHours(0, 0, 0, 0) == dateB.setHours(0, 0, 0, 0));
    }

    function showErrMsg(errMsg) {
        $('#msg').append(errMsg)
        $('#MSG').show();
        $('#msgConfim').hide();
        $('.close').click(() => {
            $('#msg').empty();
            $('#MSG').hide();
        });
    }

    function showUseMsg(msgInfo, player, info) {
        $('#msg').append(msgInfo)
        $('#MSG').show();
        $('#msgConfim').show();
        $('.close').click(() => {
            $('#msg').empty();
            $('#MSG').hide();
        });
        $('.confim').click(() => {
            $('#msg').empty();
            $('#MSG').hide();
            switch (info.funcName) {
                case 'useItem':
                    useItem(player, info.itemId);
                    break;
                case 'learnAtkDrop':
                    learnAtkDrop(player);
                    break;
            }
        });

    }

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
            showErrMsg('<p>惊人!你居然是百年难得一见的天灵根!</p>');
            player.label.push('幸运儿');
        }
        return player;
    }

    // 随机从[min,max]区间取值
    function getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    // 数组、洗牌算法乱序
    function shuffle(arr) {
        for (let i = arr.length - 1; i >= 0; i--) {
            let rIndex = Math.floor(Math.random() * (i + 1));
            let temp = arr[rIndex];
            arr[rIndex] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }

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

    function searchAtk(atkName) {
        for (let i in ATKknow) {
            if (atkName == ATKknow[i].atkName) {
                return ATKknow[i];
            }
        }
        return null;
    }

    function learnAtkUsed(player, atkName, isNew) {
        let atk = searchAtk(atkName);
        if (atk == null) {
            showErrMsg('<p>没有这种功法!</p>');
            return;
        }
        let needFelement = atk.needFelement.split('|');
        if (needFelement.length != 2) {
            showErrMsg('<p>这个功法的需求有问题!</p>');
            return;
        }
        let fel = player.Felements;
        let pAtk = player.atk;

        if (!isNew) {
            if (pAtk.atkLevel < atk.maxLevel) {
                pAtk.atkLevel += 1;
            } else {
                showErrMsg('<p>你已修炼到该功法的最高等级!</p>');
                return;
            }

        } else {
            pAtk.atkLevel = 1;
        }

        if (needFelement[0] == "any") {
            for (let i in fel) {
                if (fel[i] > needFelement[1]) {
                    pAtk.learnAtk = atkName + pAtk.atkLevel + '阶';
                    pAtk.atkName = atkName;
                    player.handledSpeed = atk.handledSpeed * pAtk.atkLevel;
                    break;
                }
            }
        } else {
            for (let i in fel) {
                if (i == needFelement[0]) {
                    if (fel[i] >= needFelement[1]) {
                        pAtk.learnAtk = atkName + pAtk.atkLevel + '阶';
                        player.handledSpeed = Math.round(atk.handledSpeed * pAtk.atkLevel);
                    } else {
                        showErrMsg('<p>你的' + changeElement(i) + '灵根能力不够!</p>');
                        return;
                    }
                }
            }
        }
        let eefect = countEEffect(checkFiveElemets(player));
        showErrMsg('<p>学习' + atkName + '成功，当前修炼速度为每秒' + round((player.handledSpeed * eefect), 2) + '灵气!</p>')
    }

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

    function learnAtkDrop(player) {
        player.atk.learnAtk = '';
        player.atk.atkName = '';
        player.atk.atkLevel = 0;
        player.handledSpeed = 0;
        let otherReiki = Math.round(getRandom(50, 90) * player.reiki / 100);
        player.reiki = 1;
        player.lastCTime = Date.now();
        showErrMsg('<p>散功完成!<p>')
        return;
    }

    function countReiki(player) {
        let nowTime = Date.now();
        let eefect = countEEffect(checkFiveElemets(player));
        if (nowTime > player.lastCTime) {
            let earnTime = (nowTime - player.lastCTime) / 1000;
            player.reiki += round((earnTime * player.handledSpeed * eefect), 2);
            player.lastCTime = nowTime;
            return;
        } else {
            showErrMsg('<p>灵气尚未聚集!<p>');
            return;
        }
    }

    function checkRlevel(player) {
        let reiki = player.reiki;
        for (let i in Rlevel) {
            let needReiki = Rlevel[i].needReiki.split('|');
            if (needReiki.length != 2) {
                showErrMsg('这个境界有问题!');
                return;
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
                return;
            }
        }
    }

    function round(number, precision) {
        return Math.round(+number + 'e' + precision) / Math.pow(10, precision);
    }

    /**-------------------------------------------------主函数------------------------------------------------------------------ */
    // 初始化
    function init() {
        $('#KAISHI').show();
        $('#XIULIAN').hide();
        $('#MSG').hide();
        $('#ITEMS').hide();


        $('#startGame').click(startGame);
    }


    init();
})