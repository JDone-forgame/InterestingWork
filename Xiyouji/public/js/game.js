$(function () {

    let winWidth = window.screen.width;
    let winHeight = window.screen.height;
    let showWidth = 0;
    let showHeight = 0;
    let wideScreen = false;
    const wh = 1.7;


    let isNew = true;
    let everyTypeMax = 4;
    let playerNum = 3;
    let cups = [0, 0, 0];
    let curCard = 0;
    sessionStorage.clear();

    // 初始化适合屏幕的样式
    function initScreen() {
        //判断是否宽屏
        let winWide = window.screen.width;
        // alert(winWide);
        wideScreen = false;
        if (winWide <= 1024) {
            //1024及以下分辨率
            // 小屏幕 竖屏
            $("#css").attr("href", "./public/css/index2.css");
        } else {
            // 大屏幕 横屏
            $("#css").attr("href", "./public/css/index.css");
            //是宽屏
            wideScreen = true;
        }

        // 设置总背景块
        if (wideScreen) {
            showWidth = winHeight / wh;
            showHeight = winHeight;
        } else {
            showWidth = winWidth;
            showHeight = showWidth * wh
        }

        setBackBord(showWidth, showHeight);
    }

    // 根据屏幕设置背景板大小
    function setBackBord(width, height) {
        $('#backBord').css({
            width: width + 'px',
            height: height + 'px',
        })
    }

    // 主函数
    function main() {
        // 初始化屏幕
        initScreen();

        // 如果是新人则弹出提示
        if (isNew) {
            $('#newGuide').show();
            $('#guideOver').click(() => {
                isNew = false;
                startGame();
                $('#newGuide').hide();
            })
        }

        // 开始游戏
        $('#sendCard').click(startGame);
    }

    // 开始游戏
    function startGame() {
        // 新到的所有牌
        let originCards = createCards(everyTypeMax);
        // 新发的牌组
        let sendResult = sendCards(playerNum, originCards);

        // 保存牌组
        sessionStorage.setItem('sendResult', JSON.stringify(sendResult));

        givingCards(sendResult);
    }

    // 发牌动画
    function givingCards(sendResult) {
        let playerCards = sendResult[0];
        let curGiveRoleSeq = 0;
        let playerCurCard = 0;

        updateMsg('开始发牌：')

        let givingCard = setInterval(() => {
            if (curGiveRoleSeq == 0) {
                // 发玩家的
                let card = playerCards[playerCurCard];
                let curCardZH = getZH(card);
                let str = `<div class="handCard" style="background:` + getImg(card) + `;background-size: 100% 100%;">` + curCardZH + `</div>`
                $('#playerTable').append(str);
                playerCurCard++;
                curGiveRoleSeq = 1;
            }
            else if (curGiveRoleSeq == 1) {
                // 发玩家1的
                let str = `<div class="otherHandCard">*</div>`
                $('#oPlayer1').append(str);
                curGiveRoleSeq = 2;
            }
            else if (curGiveRoleSeq == 2) {
                // 发玩家2的
                let str = `<div class="otherHandCard">*</div>`
                $('#oPlayer2').append(str);
                curGiveRoleSeq = 0;
            }
            if (playerCurCard == playerCards.length && curGiveRoleSeq == 0) {
                // 结束时间循环
                clearInterval(givingCard);
                $('.handCard').click(handCardClick);
                $('#cupAdd').click(cupAdd)
            }
        }, 200)
    }

    // 计算每个玩家得到了什么牌
    function sendCards(playerNum, originCards) {
        // 每个玩家的牌数
        let all = [];
        // 总牌数
        let allCardsNum = originCards.length;
        // 每人应发牌数
        let everyOneCardNum = Math.floor(allCardsNum / playerNum);
        // 牌的序号
        let originCardSeq = 0;
        // 重置每个人要喝的酒数量
        cups = [];

        for (let i = 0; i < playerNum; i++) {
            cups.push(0);
            let str = '[玩家' + i + '要喝酒杯数]:' + 0 + '<br>';
            if (i == 0) {
                str = '[你要喝酒杯数]:' + 0 + '<br>';
            }
            $('#cups').append(str)
            let playerCards = [];
            for (let m = 0; m < everyOneCardNum; m++) {
                playerCards.push(originCards[originCardSeq]);
                originCardSeq++;
            }
            all.push(playerCards);
        }

        return all;
    }

    // 创造卡牌池
    function createCards(everyTypeMax) {
        let roles = [3, 5, 8, 10, 11, 12, 13, 15, 16];
        let cards = [];
        for (let role of roles) {
            if (role == 15 || role == 16) {
                for (let i = 0; i < Math.floor(everyTypeMax / 2); i++) {
                    cards.push(role);
                }
            } else {
                for (let i = 0; i < everyTypeMax; i++) {
                    cards.push(role);
                }
            }
        }
        return shuffle(cards);
    }

    // 乱序
    function shuffle(arr) {
        for (let i = arr.length - 1; i >= 0; i--) {
            let rIndex = Math.floor(Math.random() * (i + 1));
            let temp = arr[rIndex];
            arr[rIndex] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }

    // 通过牌数字获得中文
    function getZH(number) {
        let zh = '';
        switch (number) {
            case 3:
                zh = `<span class='shitu'>沙僧</span>`;
                break;
            case 5:
                zh = `<span class='shitu'>悟空</span>`;
                break;
            case 8:
                zh = `<span class='shitu'>八戒</span>`;
                break;
            case 10:
                zh = `<span class='shitu'>师傅</span>`;
                break;
            case 11:
                zh = `<span class='yaoguai'>小妖怪</span>`;
                break;
            case 12:
                zh = `<span class='yaoguai'>中妖怪</span>`;
                break;
            case 13:
                zh = `<span class='yaoguai'>大妖怪</span>`;
                break;
            case 15:
                zh = `<span class='fo'>观音</span>`;
                break;
            case 16:
                zh = `<span class='fo'>佛祖</span>`;
                break;
            default:
                zh = '*';
                break;
        }
        return zh;
    }

    // 通过中文获取数字
    function getNum(ZH) {
        let number = 0;
        switch (ZH) {
            case '沙僧':
                number = 3;
                break;
            case '悟空':
                number = 5;
                break;
            case '八戒':
                number = 8;
                break;
            case '师傅':
                number = 10;
                break;
            case '小妖怪':
                number = 11;
                break;
            case '中妖怪':
                number = 12;
                break;
            case '大妖怪':
                number = 13;
                break;
            case '观音':
                number = 15;
                break;
            case '佛祖':
                number = 16;
                break;
        }
        return number;
    }

    // 通过数字获取图片
    function getImg(number) {
        let imgUrl = '';
        switch (number) {
            case 3:
                imgUrl = `url('./public/img/shitu_shaseng.jpg')`;
                break;
            case 5:
                imgUrl = `url('./public/img/shitu_wukong.jpg')`;
                break;
            case 8:
                imgUrl = `url('./public/img/shitu_bajie.jpg')`;
                break;
            case 10:
                imgUrl = `url('./public/img/shitu_shifu.jpg')`;
                break;
            case 11:
                imgUrl = `url('./public/img/yaoguai_hongmang.jpg')`;
                break;
            case 12:
                imgUrl = `url('./public/img/yaoguai_shiziguai.jpg')`;
                break;
            case 13:
                imgUrl = `url('./public/img/yaoguai_baigujing.jpg')`;
                break;
            case 15:
                imgUrl = `url('./public/img/fo_guanyin.jpg')`;
                break;
            case 16:
                imgUrl = `url('./public/img/fo_rulai.jpg')`;
                break;
            default:
                imgUrl = '';
                break;
        }
        return imgUrl;
    }

    // 喝一杯
    function cupAdd() {
        cups[0] += 1;
        curCard = 0;
        updateMsg('你喝了一杯！请出牌：');
        updateCups();
    }

    // 出牌
    let clicking = false;
    function handCardClick() {
        if (clicking) {
            return;
        }
        clicking = true;

        // 手中有无可压制的牌
        let found = false;
        // 玩家选中的手牌
        let clickCard = getNum($(this).text());
        if (curCard != 0) {
            let canAtk = rule(curCard);
            for (let num of canAtk) {
                if (num == clickCard) {
                    found = true;
                }
            }
        } else {
            found = true;
        }

        if (!found) {
            clicking = false;
            updateMsg('这张牌不能克制对方出的牌!');
            return;
        }

        let sendResult = JSON.parse(sessionStorage.getItem('sendResult'));
        if (curCard == 0 || found) {
            // console.log('click at ' + clickCard)
            $(this).hide();
            outCardAdd(clickCard);
            updateMsg('你出了' + getZH(clickCard));
            deleteCard(0, clickCard, sendResult);
        }

        curCard = clickCard;
        // 其他玩家的操作
        let i = 1;
        let handleTime = setInterval(() => {
            robotOption(i, sendResult);
            i++;
            if (i == 3) {
                clicking = false;
                clearInterval(handleTime);

                updateCups();

                // 判断是否游戏结束
                if (gameOver()) {
                    updateMsg('--------游戏结束--------');
                    str = '游戏结束!<br>本局你要喝:' + cups[0] + '杯<br>';
                    for (let i = 1; i < cups.length; i++) {
                        str += '玩家' + i + '要喝:' + cups[i] + '杯<br>';
                    }
                    updateMsg(str);
                }
            }
        }, 1000)
    }

    // 机器人操作
    function robotOption(i, sendResult) {
        let robotCards = sendResult[i];
        let robotResult = robotTurn(robotCards, curCard);
        if (!robotResult.canAtk) {
            updateMsg('玩家' + i + '没有牌可以克制! 他选择喝一杯!');
            cups[i] += 1;
            curCard = robotCards[getRandom(0, robotCards.length - 1)];
            deleteCard(i, curCard, sendResult)
            outCardAdd(curCard);
            updateMsg('玩家' + i + '出了' + getZH(curCard) + '来克制!');
        } else {
            curCard = robotResult.atkCard;
            deleteCard(i, curCard, sendResult);
            outCardAdd(curCard);
            updateMsg('玩家' + i + '有牌克制! 他出了' + getZH(curCard));
        }
    }

    // 更新消息板
    function updateMsg(text) {
        let msg = $('#msg').html();
        let str = text + '<br>';
        $('#msg').html(str + msg)
    }

    // 返回机器人能否克制已经具体克制的牌
    function robotTurn(robotCards, playerSendCard) {
        let result = {
            canAtk: false,
            atkCard: 0,
        }

        let reAtkCards = rule(playerSendCard);
        for (let canCard of reAtkCards) {
            for (let robotCard of robotCards) {
                if (robotCard == canCard) {
                    result.canAtk = true;
                    result.atkCard = robotCard;
                    // console.log('found!')
                    return result;
                }
            }
        }

        return result;
    }

    // 根据规则，输入这张牌，返回可以克制的牌
    function rule(cardNumber) {
        let canResult = [];
        switch (cardNumber) {
            case 3:
                canResult = [8, 5, 10, 15, 16];
                break;
            case 5:
                canResult = [10, 15, 16];
                break;
            case 8:
                canResult = [5, 10, 15, 16];
                break;
            case 10:
                canResult = [11, 12, 13, 15, 16];
                break;
            case 11:
                canResult = [3, 8, 5, 12, 13, 15, 16];
                break;
            case 12:
                canResult = [3, 8, 5, 13, 15, 16];
                break;
            case 13:
                canResult = [3, 8, 5, 15, 16];
                break;
            case 15:
                canResult = [16];
                break;
            case 16:
                canResult = [];
                break;
            default:
                canResult = [];
                break;

        }
        return canResult;
    }

    // 删除牌 i是在发牌里的对象 0是玩家 1是玩家1 2是玩家2
    function deleteCard(i, cardNumber, sendResult) {
        // 数据里删除
        let curCards = sendResult[i];
        let found = false;
        let newNumArr = [];
        for (let num of curCards) {
            if (!found && num == cardNumber) {
                found = true;
                continue;
            }
            newNumArr.push(num);
        }
        sendResult[i] = newNumArr;
        sessionStorage.setItem('sendResult', JSON.stringify(sendResult));

        // 其他玩家更新牌
        if (i != 0) {
            $('#oPlayer' + i).empty();
            for (let j = 0; j < curCards.length - 1; j++) {
                $('#oPlayer' + i).append(`<div class="otherHandCard">*</div>`)
            }
        }
    }

    // 获取一个随机数
    function getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    // 是否游戏结束
    function gameOver() {
        let sendResult = JSON.parse(sessionStorage.getItem('sendResult'));
        let over = true;
        for (let player of sendResult) {
            if (player.length > 0) {
                over = false;
                break;
            }
        }
        return over;
    }

    // 更新喝的杯数
    function updateCups() {
        $('#cups').empty();
        for (let i = 0; i < cups.length; i++) {
            let str = '[玩家' + i + '要喝酒杯数]:' + cups[i] + '<br>';
            if (i == 0) {
                str = '[你要喝酒杯数]:' + cups[i] + '<br>';
            }
            $('#cups').append(str)
        }
    }

    // 出牌区加牌
    function outCardAdd(cardNumber) {
        let outCardNum = $('#outCardBord').children('div').length;
        console.log(outCardNum)

        if (outCardNum > 4) {
            if (wideScreen) {
                $('#outCardBord').css({
                    left: -(9 * (outCardNum - 4)) + 'rem'
                })
            } else {
                $('#outCardBord').css({
                    left: -(6.5 * (outCardNum - 4)) + 'rem'
                })
            }
            console.log('位移了')
            console.log($('#outCardBord').css('left'))
        }

        let str = `<div class="outCard" style="background:` + getImg(cardNumber) + `;background-size: 100% 100%;"><span class="shitu">` + getZH(cardNumber) + `</span></div>`
        $('#outCardBord').append(str);
    }

    main();

})