$(function() {
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

    let DEFAULT_ELENUM = 10;

    let curPlayer;
    /**-------------------------------------------------页面方法----------------------------------------------------------------- */

    /**-------------------------------------------------流程方法----------------------------------------------------------------- */
    function checkLocalData(name) {
        let qData = localStorage.getItem(name);
        if (qData) {
            let data = JSON.parse(qData);
            curPlayer = data;
            return true
        }
        return false
    }

    function startGame() {
        var name = $('#name').val();
        if (name == null || name == '') {
            showErrMsg('请输入您的名称!');
            return
        }

        if (!checkLocalData(name)) {
            curPlayer = playerInit(name);
        }

        // 测试用
        console.log(curPlayer);

        updata();
        showFel(curPlayer);

        $('#head').html('<img src="./public/img/head/' + curPlayer.headUrl + '">')
        $('#KAISHI').hide();
        $('#XIULIAN').show();
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

    function updata() {
        setInterval(() => {
            countReiki(curPlayer)
            checkRlevel(curPlayer)
            $('#reiki').text("灵力" + round(curPlayer.reiki, 2));
            $('#xinxi').html('<p>' + curPlayer.name + '</p>' + '<p>' + curPlayer.learnAtk + '</p>' + '<p>' + curPlayer.Rlevel + '</p>');
        }, 1000);
    }

    function learn() {
        if (curPlayer.isNew) {
            learnAtkUsed(curPlayer, '基础功法', true);
            curPlayer.isNew = false;
        } else {
            learnAtkUsed(curPlayer, '基础功法', false);
        }
        // learnAtkUsed(curPlayer, '青元剑诀', true)
    }

    function showErrMsg(errMsg) {
        $('#msg').html(errMsg)
        $('#MSG').show();
    }

    function closeErrMsg() {
        $('#msg').html('')
        $('#MSG').hide();
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
            learnAtk: '',
            atkLevel: 0,
            label: [],
            Rlevel: '',
            itms: []
        }
        if (checkFiveElemets(player) == 1) {
            showErrMsg('惊人!你居然是百年难得一见的天灵根!');
            player.label.push('幸运儿');
        }
        return player;
    }

    function getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

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
            showErrMsg('没有这种功法!');
            return;
        }
        let needFelement = atk.needFelement.split('|');
        if (needFelement.length != 2) {
            showErrMsg('这个功法的需求有问题!');
            return;
        }
        let fel = player.Felements;

        if (!isNew) {
            if (player.atkLevel < atk.maxLevel) {
                player.atkLevel += 1;
            } else {
                showErrMsg('你已修炼到该功法的最高等级!');
                return;
            }

        } else {
            player.atkLevel = 1;
        }

        if (needFelement[0] == "any") {
            for (let i in fel) {
                if (fel[i] > needFelement[1]) {
                    player.learnAtk = atkName + player.atkLevel + '阶';
                    player.handledSpeed = atk.handledSpeed * player.atkLevel;
                    break;
                }
            }
        } else {
            for (let i in fel) {
                if (i == needFelement[0]) {
                    if (fel[i] >= needFelement[1]) {
                        player.learnAtk = atkName + player.atkLevel + '阶';
                        player.handledSpeed = Math.round(atk.handledSpeed * player.atkLevel);
                    } else {
                        showErrMsg('你的' + changeElement(i) + '灵根能力不够!');
                        return;
                    }
                }
            }
        }
        let eefect = countEEffect(checkFiveElemets(player));
        showErrMsg('学习' + atkName + '成功，当前修炼速度为每秒' + round((player.handledSpeed * eefect), 2) + '灵气!')
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
        player.learnAtk = '';
        player.handledSpeed = 0;
        showErrMsg('散功完成!')
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
            showErrMsg('灵气尚未聚集!');
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

        $('#close').click(closeErrMsg);
        $('#learnAtk').click(learn);
        $('#save').click(saveGame);
        $('#startGame').click(startGame);
    }


    init();
})