let MAINTIME = setInterval(() => {
    update()
}, 1000)

let gaming = true;

let player = {
    name: '玩家',
    shenshi: 50,
    jueding: 'option',
    moveSpeed: 2,
    moveForword: 'right',
    location: 0,
}

let npc = {
    name: 'NPC',
    shenshi: 30,
    jueding: 'peace',
    moveSpeed: 0,
    moveForword: 'none',
    location: 60 // Math.floor(Math.random() * 100 + 50)
}

function update() {
    console.log('-----------------------------------------')

    if (gaming) {
        moveAction(player);
        moveAction(npc)

        if (isInRange(player, npc)) {
            let distance = Math.abs(player.location - npc.location)
            if (player.shenshi > distance) {
                option(player, npc)
            }
            if (npc.shenshi > distance) {
                option(npc, player)
            }
        }
    } else {
        console.log('游戏暂停')
    }

    console.log('-----------------------------------------')
}

function moveAction(player) {
    switch (player.moveForword) {
        case 'right':
            player.location += player.moveSpeed
            break;
        case 'none':
            break;
        case 'left':
            player.location -= player.moveSpeed
            break;
    }
    console.log("[" + player.name + "]当前位置：" + player.location)
}

function isInRange(a, b) {
    let inRange = false;
    let distance = Math.abs(a.location - b.location)
    let descri = '相距' + distance + '米'
    if (a.shenshi > distance || b.shenshi > distance) {
        inRange = true;
    }
    console.log(descri)
    return inRange;
}

function option(a, b) {
    console.log(b.name + '在' + a.name + '神识范围内')
    switch (a.jueding) {
        case 'peace':
            cPeace(a, b);
            break;
        case 'stop':
            cStop(a, b);
            break;
        case 'attack':
            cAttack(a, b);
            break;
        case 'chat':
            cChat(a, b);
            break;
        case 'warning':
            cWarning(a, b);
            break;
        case 'option':
            cOption(a, b);
            break;
    }
}

function cPeace(a, b) {
    console.log(a.name + '选择不理会')
}
function cStop(a, b) {
    console.log(a.name + '选择停下来')
    a.moveForword = 'none'
}
function cAttack(a, b) {
    console.log(a.name + '选择攻击' + b.name)
}
function cChat(a, b) {
    console.log(a.name + '选择传话给' + b.name)
}
function cWarning(a, b) {
    console.log(a.name + '选择警告' + b.name)
}
function cOption(a, b) {
    console.log(a.name + '正在选择操作...')
    gaming = false;
    setTimeout(() => { player.jueding = 'attack', gaming = true }, 3000)
}