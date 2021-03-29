let fs = require('fs');

let monopoly = {
    urlToFunction: urlToFunction,
}

async function urlToFunction(url, param) {
    let funcName = url.split('/')[2];
    let gameId = param.get('gameId');
    let player = null;

    // 获取玩家数据
    getPlayerData(gameId).then((loadData) => {
        player = loadData.playerData;
        return aa(player, funcName);
    }).catch((loadData) => {
        if (loadData.code == ErrorCode.not_found_data) {
            setPlayerData(gameId).then((setData) => {
                if (setData && setData.code == ErrorCode.ok) {
                    player = setData.playerData;
                    return aa(player, funcName);
                } else {
                    return { code: ErrorCode.not_found_data, errMsg: 'create data failed!' };
                }
            });
        } else {
            return { code: ErrorCode.not_found_data, errMsg: 'no loadData , not found data!' };
        }
    });
}

function aa(player, funcName) {
    console.log(player);
    switch (funcName) {
        case 'rollTheDice':
            return rollTheDice();
            break;
        default:
            return { code: 1, errMsg: 'not found this func:' + funcName }
            break;
    }
}

// 获取玩家数据
async function getPlayerData(gameId) {
    if (!gameId) {
        return Promise.reject({ code: ErrorCode.no_gameId, errMsg: 'no gameId!' });
    }

    // 读取玩家数据
    fs.readFile('./data/monopoly/' + gameId + '.json', function (err, data) {
        if (err) { return Promise.reject({ code: ErrorCode.not_found_data, errMsg: 'not found data!' }) };
        var playerJsonData = JSON.parse(data.toString());
        return Promise.resolve({ code: ErrorCode.ok, player: playerJsonData });
    })
}

// 新建、保存玩家数据
async function setPlayerData(gameId, playerData = null) {
    if (!gameId) {
        return Promise.reject({ code: ErrorCode.no_gameId, errMsg: 'no gameId!' });
    }

    if (playerData == null) {
        // 新建信息
        playerData = {
            level: 1,
            map: [],
            coin: 0,
            diamond: 0,
            curBuildingSeq: 1,
            diceCount: 15,
            sumPeople: 20,
        }
    }

    fs.writeFile('./data/monopoly/' + gameId + '.json', JSON.stringify(playerData), function (error) {
        if (error) {
            console.log('文件写入失败')
        } else {
            console.log('文件写入成功')
            return Promise.resolve({ code: ErrorCode.ok, player: playerJsonData });
        }
    })
}

function rollTheDice() {
    return { code: 0, errMsg: 'in the func' }
    // if (diceCount <= 0) {
    //     openAndClosMsg(true, '<p>骰子点数不足！</p>')
    //     return;
    // }

    // let point = dicePoint;
    // if (dicePoint == 0) {
    //     point = 1 + Math.floor(Math.random() * 6);
    // }

    // let imgName = point > 6 ? 7 : point;
    // $('#touzi').empty();
    // $('#touzi').append(`<img src="/public/img/monopoly/t` + imgName + `.png">`)

    // $('#roll').unbind("click");
    // moveBlock(point);

    // diceCount--;
    // updateInfo('dice', diceCount);
}


const ErrorCode = {
    ok: 0,
    no_gameId: 1,
    not_found_data: 2,
}

exports.monopoly = monopoly;