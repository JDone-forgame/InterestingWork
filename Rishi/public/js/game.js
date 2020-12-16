$(function () {
    let curPlayerName = '';
    let upHandle;

    // 开始游戏
    function startGame() {
        var name = $('#name').val();
        if (name == null || name == '') {
            return addMsg('请输入您的名称!');
        }

        curPlayerName = name;
        let player = getPlayerData(curPlayerName);

        if (player.isNew) {
            console.log('新玩家');
            addItem(player.name, 'i003', 1);
            addItem(player.name, 'i101', 2);
        }

        // 测试用
        console.log(player);
        showFel(curPlayerName);

        updata(curPlayerName);
        
        $('#items').click(openPackage)
        $('#xbtn1').click(xbtn1);
        $('#head').html('<img src="./public/img/head/' + player.headUrl + '">')
        $('#KAISHI').hide();
        $('#XIULIAN').show();
    }

    // 测试按钮
    function xbtn1() {
        let info = {
            funcName: "learnAtkDrop",
        }
        showUseMsg('<p>你确定要散功吗？散功会流失你的部分灵力!</p>', curPlayer, info)
    }

    // 打开背包
    function openPackage() {
        $('#KAISHI').hide();
        $('#XIULIAN').hide();
        showItems(curPlayerName);
        $('#ITEMS').show();
        $('.item').click(usePackageItem)
        $('.close').click(() => {
            $('div').remove(".item");
            $('#ITEMS').hide();
            $('#XIULIAN').show();
        });
    }

    // 使用背包道具
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
        showUseMsg(aitem.descri, curPlayerName, info);
    }

    // *提示信息
    function showErrMsg() {
        for(let msg of msgs){
            $('#msg').append(msg);
        }
        $('#MSG').show();
        $('#msgConfim').hide();
        $('.close').click(() => {
            msgs.splice(0);
            $('#msg').empty();
            $('#MSG').hide();
        });
    }

    // 使用道具弹窗
    function showUseMsg(msgInfo, name, info) {
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
                    useItem(name, info.itemId);
                    break;
                case 'learnAtkDrop':
                    learnAtkDrop(name);
                    break;
            }
        });

    }

    // 展示道具
    function showItems(name) {
        let items = getItems(name)
        for (let item of items) {
            if (item.number > 0) {
                $('#ITEMS').append('<div id="' + item.itemId + '" class="item"><img src="./public/img/items/' + item.imgUrl + '"><span class="' + item.quality + '">' + item.itemName + '*' + item.number + '</span></div>')
            }

        }
    }

    // 显示元素
    function showFel(name) {
        let fel = getFel(name)
        for (let i in fel) {
            if (fel[i] > 0) {
                let felName = changeElement(i);
                $('#fel').append('<p>' + felName + fel[i] + '</p>')
            }
        }
    }



    // 计时器
    function updata(name) {
        let player = getPlayerData(name);
        let curReiki = player.reiki;
        let curLastCTime = player.lastCTime;

        upHandle = setInterval(() => {
            if(msgs.length>0){
                showErrMsg()
            }

            let res = countReiki(name, 0);
            curReiki += res.addReiki;
            curLastCTime = res.newTime;

            checkRlevel(name);

            $('#reiki').text("灵力" + round(curReiki, 2));

            player = getPlayerData(name);
            $('#xinxi').html('<p>' + player.name + '</p>' + '<p>' + player.atk.learnAtk + '</p>' + '<p>' + player.Rlevel + '</p>');
        }, 1000);
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