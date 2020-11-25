// five elements
// metal, wood, water, fire and earth

let ATKknow = [
    {
        atkName: '青元剑诀',
        needFelement: 'Wood|8',
        handledSpeed: 0.8,
    }
]

let Rlevel = [
    {
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

let ErrorCode = {
    ok: 0,
    param_error: 1,

    element_level_not_enough: 50,

    atk_needFelement_error: 100,

    rlevel_needReiki_error: 150,

    reki_is_gathering: 200,
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
    let player = {
        name: name,
        Felements: {
            Metal: 0,
            Wood: 0,
            Water: 0,
            Fire: 0,
            Earth: 0
        },
        handledSpeed: 0,
        reiki: 0,
        lastCTime: Date.now(),
        learnAtk: '',
        atkLevel: 0,
        label: [],
        Rlevel: '',
    }
    return player;
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
        return { code: ErrorCode.param_error, errMsg: 'no this atk!' };
    }
    let needFelement = atk.needFelement.split('|');
    if (needFelement.length != 2) {
        return { code: ErrorCode.atk_needFelement_error, errMsg: 'this atk needFelement is error!' };
    }
    let fel = player.Felements;

    if (!isNew) {
        player.atkLevel += 1;
    } else {
        player.atkLevel = 1;
    }

    for (let i in fel) {
        if (i == needFelement[0]) {
            if (fel[i] >= needFelement[1]) {
                player.learnAtk = atkName + player.atkLevel + '阶';
                player.handledSpeed = atk.handledSpeed * player.atkLevel;
                return { code: ErrorCode.ok, errMsg: 'learn this atk success!' };
            } else {
                return { code: ErrorCode.element_level_not_enough, errMsg: 'your ' + i + ' element level is not enough!' };
            }
        }
    }
    return { code: ErrorCode.atk_needFelement_error, errMsg: 'no this element of atk need!' };
}

function learnAtkDrop(player) {
    player.learnAtk = '';
    player.handledSpeed = 0;
    return { code: ErrorCode.ok, errMsg: 'drop atk success!' };
}

function countReiki(player) {
    let nowTime = Date.now();
    let eefect = countEEffect(checkFiveElemets(player));
    if (nowTime > player.lastCTime) {
        let earnTime = (nowTime - player.lastCTime) / 1000;
        player.reiki = Math.round(player.reiki + earnTime * player.handledSpeed * eefect);
        player.lastCTime = nowTime;
        return { code: ErrorCode.ok, errMsg: 'get reiki success!' };
    } else {
        return { code: ErrorCode.reki_is_gathering, errMsg: 'wait for reiki gather!' };
    }
}

function checkRlevel(player) {
    let reiki = player.reiki;
    for (let i in Rlevel) {
        let needReiki = Rlevel[i].needReiki.split('|');
        if (needReiki.length != 2) {
            return { code: ErrorCode.rlevel_needReiki_error, errMsg: 'this rlevel is error!' };
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
            return { code: ErrorCode.ok, errMsg: 'check rlevel success!' };
        }
    }
}


function main() {
    let A = playerInit('韩立')
    A.Felements.Wood = 10;
    A.lastCTime = 1606291440358;

    // let a = checkFiveElemets(A)
    // console.log(a)
    // let b = countEEffect(a)
    // console.log(b)
    let c = learnAtkUsed(A, '青元剑诀', true)
    console.log(c)

    let d = countReiki(A)
    console.log(d)

    // let e = learnAtkDrop(A)
    // console.log(e)

    let f = checkRlevel(A)
    console.log(f)


    console.log(A)
}

main()