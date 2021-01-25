$(function () {

    //判断是否宽屏
    var winWide = window.screen.width;
    // alert(winWide);
    var wideScreen = false;
    if (winWide <= 1024) {//1024及以下分辨率
        $("#css").attr("href", "./public/css/index2.css");
        // alert('小屏');
    } else {
        $("#css").attr("href", "./public/css/index.css");
        // alert('大屏');
        wideScreen = true; //是宽屏
    }


    let everyTypeMax = 4;
    let playerNum = 3;
    let cups = [0, 0, 0];
    let curCard = 0;
    sessionStorage.clear();

    function main() {
        let originCards = createCards(everyTypeMax);
        let sendResult = sendCards(playerNum, originCards);

        sessionStorage.setItem('sendResult', JSON.stringify(sendResult));

        let width = Math.floor(100 / (playerNum - 1));

        for (let i = 1; i < sendResult.length; i++) {
            let cards = toSecret(sendResult[i]);
            let showCards = '';
            for (let j = 0; j < cards.length; j++) {
                let mLeft = -2;
                if (!wideScreen) {
                    mLeft = -0.1;
                }
                if (j == 0) {
                    mLeft = 0;
                }
                showCards += `<div class="otherHandCard" style="margin-left: ` + mLeft + `%;">*</div>`
            }

            let str = `<div id="other` + i + `" class="ohterTable" style="width: ` + width + `%;">` + showCards + `</div>`
            $('#otherTables').append(str);
        }

        showHandCards(sendResult[0]);
    }

    function sendCards(playerNum, originCards) {
        let all = [];
        let allCardsNum = originCards.length;
        let everyOneCardNum = Math.floor(allCardsNum / playerNum);
        let originCardSeq = 0;
        cups = [];

        for (let i = 0; i < playerNum; i++) {
            cups.push(0);
            let str = '[player' + i + ' cup]:' + 0 + '<br>';;
            if (i == 0) {
                str = '[your cup]:' + 0 + '<br>';
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

    function shuffle(arr) {
        for (let i = arr.length - 1; i >= 0; i--) {
            let rIndex = Math.floor(Math.random() * (i + 1));
            let temp = arr[rIndex];
            arr[rIndex] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }

    function toSecret(arr) {
        let secretArr = [];
        for (let i = 0; i < arr.length; i++) {
            secretArr.push('*');
        }
        return secretArr;
    }

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

    function showHandCards(arr) {
        for (let i = 0; i < arr.length; i++) {
            let curCardZH = getZH(arr[i]);
            let mLeft = -2;
            let str = `<div class="handCard" style="margin-left: ` + mLeft + `%;">` + curCardZH + `</div>`
            $('#playerTable').append(str);
        }
        $('.handCard').click(handCardClick);
        $('#cupAdd').click(cupAdd)
    }

    function cupAdd() {
        cups[0] += 1;
        curCard = 0;
        updateMsg('your cup add!');
        updateCups();
    }

    function handCardClick() {
        let found = false;
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
            updateMsg('this card can not reAtk!');
            return;
        }

        let sendResult = JSON.parse(sessionStorage.getItem('sendResult'));
        if (curCard == 0 || found) {
            // console.log('click at ' + clickCard)
            $(this).hide();
            updateMsg('you send ' + getZH(clickCard));
            deleteCard(0, clickCard, sendResult);
        }

        curCard = clickCard;
        for (let i = 1; i < sendResult.length; i++) {
            let robotCards = sendResult[i];
            let robotResult = robotTurn(robotCards, curCard);
            if (!robotResult.canAtk) {
                updateMsg('player' + i + ' can not reAtk! cup one!');
                cups[i] += 1;
                curCard = robotCards[getRandom(0, robotCards.length - 1)];
                deleteCard(i, curCard, sendResult)
                updateMsg('player' + i + ' send ' + getZH(curCard) + '!');
            } else {
                curCard = robotResult.atkCard;
                deleteCard(i, curCard, sendResult);
                updateMsg('player' + i + ' can reAtk! he send ' + getZH(curCard));
            }
        }

        updateCups();

        if (gameOver()) {
            updateMsg('game over!');
            str = 'game over!<br>your cup:' + cups[0] + '杯<br>';
            for (let i = 1; i < cups.length; i++) {
                str += 'player' + i + ' cup:' + cups[i] + '杯<br>';
            }
            updateMsg(str);
        }

    }

    function updateMsg(text) {
        let msg = $('#msg').html();
        let str = text + '<br>';
        $('#msg').html(str + msg)
    }

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
                    console.log('found!')
                    return result;
                }
            }
        }

        return result;
    }

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

    function deleteCard(i, cardNumber, sendResult) {
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

        if (i != 0) {
            $('#other' + i).empty();

            let cards = toSecret(curCards);
            // let cardsNum = cards.length;
            // if (cards.length == 0) {
            //     cardsNum = 1;
            // }
            // let width = Math.floor(parseInt($('#other' + i).css('width').split('px')[0]) / cardsNum);
            // console.log(width)
            for (let j = 0; j < cards.length - 1; j++) {
                let mLeft = -2
                if (j == 0) {
                    mLeft = 0;
                }

                $('#other' + i).append(`<div class="otherHandCard" style="margin-left: ` + mLeft + `%;">*</div>`)
            }
        }
    }

    function getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

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

    function updateCups() {
        $('#cups').empty();
        for (let i = 0; i < cups.length; i++) {
            let str = '[player' + i + ' cup]:' + cups[i] + '<br>';;
            if (i == 0) {
                str = '[your cup]:' + cups[i] + '<br>';
            }
            $('#cups').append(str)
        }
    }

    main();

})