// // 副本控制
// let fightRoomState = {
//     // 是否战斗中
//     fighting: false,
//     // 是否在副本中
//     inFroom: false,
//     // 开始战斗的时间
//     startFightTime: 0,
//     // 副本是否结束
//     fightRoomOver: false,
//     // 副本暂停
//     frStop: false,
// }


let fightRoom = {
    fightingCycle: fightingCycle,
    unFightingCycle: unFightingCycle,
    moveAction: moveAction,
}

const eSender = {
    system: '系统',
}


// 战斗中逻辑处理
function fightingCycle() {
    // 副本状态
    let fightRoomState = JSON.parse(sessionStorage.getItem('fightRoomState'));
    let nowTime = Date.now();


    // startFightTime = 0 表示目前没有战斗
    if (fightRoomState.startFightTime == 0) {
        fightRoomState.startFightTime = nowTime;
        sessionStorage.setItem('fightRoomState', JSON.stringify(fightRoomState));
    }


    // [test]判断是否结束战斗
    if ((nowTime - fightRoomState.startFightTime) / 1000 > 5 && fightRoomState.startFightTime != 0) {
        endFight();
    }
}

// 结束战斗处理
function endFight() {
    // 副本状态
    let fightRoomState = JSON.parse(sessionStorage.getItem('fightRoomState'));
    // 副本信息
    let frInfo = JSON.parse(sessionStorage.getItem('frInfo'));
    // 怪物信息
    let enemyInfo = frInfo.enemyInfo;


    // 战斗状态结束
    fightRoomState.fighting = false;
    fightRoomState.startFightTime = 0;


    // 将怪物的状态设置为死亡
    for (let i = 0; i < enemyInfo.length; i++) {
        let enemy = enemyInfo[i];
        if (enemy.eState != 'death') {
            enemy.eState = 'death';
            break;
        }
    }


    // 保存 session
    sessionStorage.setItem('frInfo', JSON.stringify(frInfo));
    sessionStorage.setItem('fightRoomState', JSON.stringify(fightRoomState));
}

// 副本循环判断
function unFightingCycle() {
    // 副本状态
    // let fightRoomState = JSON.parse(sessionStorage.getItem('fightRoomState'));
    let frInfo = JSON.parse(sessionStorage.getItem('frInfo'));


    let enemyInfo = frInfo.enemyInfo;
    let playerInfo = frInfo.playerInfo;


    for (let i = 0; i < enemyInfo.length; i++) {
        let enemy = enemyInfo[i];


        // 距离该敌人的距离
        let distance = enemy.eLocation - playerInfo.location;
        // 如果敌人已经是死亡状态或者错过状态则跳过该敌人
        if (enemy.eState == 'over' || enemy.eState == 'death') {
            continue;
        }


        // [test]
        console.log('distance:' + distance)
        console.log('playerLocation:' + playerInfo.location, 'enemyLocation:' + enemy.eLocation)


        // 其中一个进入了另一个的神识
        if (isInRange(playerInfo, enemy)) {
            // 一方进入另一方神识了
            console.log('in range')
            firstSeeOption(i);
        }


        if (enemy.eState == 'alive') {
            break;
        }
    }
}

// 一方察觉时操作
function firstSeeOption(i) {
    let fightRoomState = JSON.parse(sessionStorage.getItem('fightRoomState'));
    let frInfo = JSON.parse(sessionStorage.getItem('frInfo'));
    let playerInfo = frInfo.playerInfo;
    let enemy = frInfo.enemyInfo[i];

    // 察觉者
    let playerS = {
        name: playerInfo.name,
        attitude: playerInfo.attitude,
        level: playerInfo.rlevel,
    }

    // 被发现者
    let enemyS = {
        name: enemy.eName,
        attitude: enemy.eAttitude,
        level: enemy.eRlevel,
    }

    let detectors = playerS;
    let founder = enemyS;
    if (enemy.eSpirit > playerInfo.spirit) {
        // 说明是敌人先察觉
        detectors = enemyS;
        founder = playerS;
    }

    // 根据双方态度决定事件
    let judge = judgeOccurEvent(detectors.attitude, founder.attitude);
    console.log(judge, detectors.attitude, founder.attitude)
    switch (judge.event) {
        case 'fight':
            fightRoomState.fighting = true;

            addMsg(eSender.system, founder.name + `在` + detectors.name + '神识范围内了！' + detectors.name + '决定和' + founder.name + '进行战斗！')

            break;
        case 'wait':
            fightRoomState.frStop = true;
            addMsg(eSender.system, firstR + '停了下来。')
            break;
        case 'wantFight':
            if ((detectors.level[0] == founder.level[0] && detectors.level[1] >= founder.level[1]) || (detectors.level[0] > founder.level[0])) {
                fightRoomState.fighting = true;
                addMsg(eSender.system, founder.name + `在` + detectors.name + '神识范围内了！' + detectors.name + '决定和' + founder.name + '进行战斗！')
            } else {
                enemy.eState = 'over';
            }
            break;
        case 'none':

            break;
        case 'getLuckChance':

            break;
        case 'roleBreak':

            break;
    }

    sessionStorage.setItem('frInfo', JSON.stringify(frInfo));
    sessionStorage.setItem('fightRoomState', JSON.stringify(fightRoomState));
}

// 副本移动处理
function moveAction() {
    let fightRoomState = JSON.parse(sessionStorage.getItem('fightRoomState'));
    let frInfo = JSON.parse(sessionStorage.getItem('frInfo'));
    let playerInfo = frInfo.playerInfo;


    // 判断是否结束副本
    if (playerInfo.location >= frInfo.roomInfo.roomLength) {
        fightRoomState.fightRoomOver = true;
        fightRoomState.inFroom = false;
        sessionStorage.setItem('fightRoomState', JSON.stringify(fightRoomState));
    }


    switch (playerInfo.moveForward) {
        case 'right':
            playerInfo.location += playerInfo.moveSpeed;
            break;
        case 'none':
            break;
        case 'left':
            playerInfo.location -= playerInfo.moveSpeed
            break;
    }


    sessionStorage.setItem('frInfo', JSON.stringify(frInfo));
}

// 添加信息
function addMsg(sender, msg) {
    let frMsgs = JSON.parse(sessionStorage.getItem('frMsgs'));
    if (!frMsgs) {
        frMsgs = {
            refresh: true,
            frMsg: '<p>[战斗信息]</p>',
        }
    }

    let addMsg = `<p>[` + sender + `]:` + msg + `</p>`;

    frMsgs.frMsg += addMsg;

    sessionStorage.setItem('frMsgs', JSON.stringify(frMsgs));
}







// 根据双方态度判断发生的事件-只判断不处理
function judgeOccurEvent(aAttitude, bAttitude) {
    // 结果
    result = {
        event: 'none',
        msg: '',
        time: 0,
    }

    switch (aAttitude) {
        // 友善
        case 'friendly':
            switch (bAttitude) {
                case 'friendly':
                    // 驻足 + 无事发生|概率机缘|概率突破
                    let r = Math.floor(Math.random() * 101);

                    // 随机一个时间 1-5 秒
                    let rTime = 1 + Math.floor(Math.random() * 5);
                    result.time = rTime;

                    if (r <= 60) {
                        result.event = 'wait';
                    } else if (r > 60 && r <= 95) {
                        result.event = 'getLuckChance';
                    } else if (r > 95) {
                        result.event = 'roleBreak';
                    }
                    break;
                case 'bellicose':
                    // 如果a等于或低于b阶段则发生战斗
                    result.event = 'wantFight';
                    break;
                case 'careful':
                    // 错开
                    break;
                default:
                    break;
            }
            break;
        // 敌视
        case 'bellicose':
            switch (bAttitude) {
                case 'friendly':
                    // b等级高则返回提示
                    result.event = 'wantFight';
                    break;
                case 'bellicose':
                    // 发生战斗
                    result.event = 'fight';
                    break;
                case 'careful':
                    // 发生战斗
                    result.event = 'fight';
                    break;
                default:
                    break;
            }
            break;
        // 谨慎
        case 'careful':
            switch (bAttitude) {
                case 'friendly':
                    // 错开
                    break;
                case 'bellicose':
                    // 发生战斗
                    result.event = 'fight';
                    break;
                case 'careful':
                    // 错开
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return result;
}

// 是否进了一方神识范围
function isInRange(playerInfo, enemy) {
    let inRange = false;
    let distance = enemy.eLocation - playerInfo.location
    if ((playerInfo.spirit > distance || enemy.eSpirit > distance) && distance > 0) {
        inRange = true;
    }
    return inRange;
}