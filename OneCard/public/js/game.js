$(function () {
    /**-------------------------------------------------全局变量----------------------------------------------------------------- */
    // 保底
    let guarantee = 0;
    // 最终结果
    let resultStar = []
    // 抽卡结果
    let tenCards = []
    // 当前卡序号
    let curCard = 0;
    // 卡池
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

    /**-------------------------------------------------辅助方法----------------------------------------------------------------- */
    // 获取一个包含 min 和 max 的随机数
    function getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    // 点击卡牌展示效果
    function clickCard() {
        // 控制展示区渐露
        curCard += 1;
        let str = "";
        for (let i = 0; i < curCard; i++) {
            str += tenCards[i].descri;
        }
        for (let i = curCard; i < 10; i++) {
            str += "*";
        }

        // 页面组件控制
        $('#showText').html(str);
        $("#cardShow").children().eq(0).animate({
            left: '100%',
            opacity: '0.5',
            height: '0%',
        }, "middle", () => {
            $("#cardShow").children().eq(0).remove();
        });
    }

    /**-------------------------------------------------流程方法----------------------------------------------------------------- */
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
        if (guarantee === 39 || result.descri == 'S') {
            // 当抽到39次或者单抽结果是S卡时，重置权重
            guarantee = 0;
            cards[2].weight = 6;
            cards[1].weight = 35;
            cards[0].weight = 959;
            result = cards[2];
        }
        // 每抽一次，增加4/5星卡的权重，增加已抽卡次数
        cards[2].weight += 1;
        cards[1].weight += 2;
        cards[0].weight -= 3;
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


        // 随机获取一个数字作为保底出现的位置
        let gIndex = getRandom(0, 9);


        for (let i = 0; i < 10; i++) {
            // 处理保底出的卡牌
            if (i === gIndex) {
                tenCards.push(cards[1]);
                guarantee += 1;
                continue;
            }
            let oneCard = getOne()
            tenCards.push(oneCard)
        }


        // 在展示区依次添加卡牌
        for (let i = 0; i < tenCards.length; i++) {
            resultStar.push(tenCards[i].descri)
            $('#cardShow').append('<div class="card get' + tenCards[i].descri + '">' + tenCards[i].descri + '</div>')
        }

    }

    /**-------------------------------------------------主函数------------------------------------------------------------------ */
    // 初始化
    function init() {
        // 绑定十连抽按键
        $('#getTen').click(getTen);
        // 绑定点击展示效果
        $('#cardShow').click(clickCard);
    }


    init();
})