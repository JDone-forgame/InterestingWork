$(function () {

    // 保底
    let guarantee = 0;
    // 最终结果
    let resultStar = []
    // 抽卡结果
    let tenCards = []
    // 当前卡序号
    let curCard = 0;

    let cards = [
        {
            weight: 959,
            descri: 'B',
        },
        {
            weight: 35,
            descri: 'A',
        },
        {
            weight: 6,
            descri: 'S',
        }
    ]

    // 初始化
    function init() {
        // 绑定十连抽按键
        $('#getTen').click(getTen);
        // 绑定点击展示效果
        $('#cardShow').click(clickCard);
    }

    // 获取一个包含 min 和 max 的随机数
    function getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    // 单抽
    function getOne() {
        let result;


        // 计算总权重
        let totalWeight = 0;
        for (let i = 0; i < cards.length; i++) {
            totalWeight += cards[i].weight;
        }

        // 根据权重出货
        let remainDistance = Math.random() * totalWeight;
        for (let i = 0; i < cards.length; ++i) {
            remainDistance -= cards[i].weight;
            if (remainDistance < 0) {
                result = cards[i];
                break;
            }
        }

        // 保底机制
        if (guarantee === 40 || result.descri == 'S') {
            guarantee = 0;
            cards[2].weight = 6
            cards[0].weight = 959
            result = cards[2];
        }
        cards[2].weight += 1
        cards[0].weight -= 1

        guarantee += 1;


        return result;
    }

    // 十连抽
    function getTen() {
        $('#cardShow').empty();
        $('#showText').html("**********");
        curCard = 0;
        tenCards = [];
        resultStar = [];


        let gIndex = getRandom(0, 9);

        for (let i = 0; i < 10; i++) {
            if (i === gIndex) {
                tenCards.push(cards[1]);
                guarantee += 1;
                continue;
            }
            let oneCard = getOne()
            tenCards.push(oneCard)
        }


        // 返回展示
        for (let i = 0; i < tenCards.length; i++) {
            resultStar.push(tenCards[i].descri)
            $('#cardShow').append('<div class="card get' + tenCards[i].descri + '">' + tenCards[i].descri + '</div>')
        }

    }

    // 展示效果
    function clickCard() {
        curCard += 1;
        let str = "";
        for (let i = 0; i < curCard; i++) {
            str += tenCards[i].descri;
        }
        for (let i = curCard; i < 10; i++) {
            str += "*";
        }


        $('#showText').html(str);
        $("#cardShow").children().eq(0).animate({
            left: '100%',
            opacity: '0.5',
            height: '0%',
        }, "middle", () => {
            $("#cardShow").children().eq(0).remove();
        });
    }




    init();
})