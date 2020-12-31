$(function () {
    setInterval(() => {
        updata();
    }, 1000);
    // 信息弹窗是否已经打开
    let msgOpen = false;
    let msgs = [];
    // 是否循环显示信息
    let isCycle = false;

    let httpC = require('./httpConnect');

    // 刷新的信息
    let showInfo = {
        reiki: 0,
        lastCTime: 0,
        rlevel: '',
        atkInfo: '',
    }

    // 开始游戏
    function startGame() {
        var name = $('#name').val();
        if (name == null || name == '') {
            msgs.push('请输入您的名称!')
            return;
        }

        let pResult =  
        let player = BACKGAME.getPlayerData(curPlayerName);

        // 测试用
        console.log(player);
        showFel(curPlayerName);

        initShowInfo();
        isCycle = true;

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
        for (let msg of msgs) {
            $('#msg').append(msg);
        }
        msgOpen = true;
        $('#MSG').show();
        $('#msgConfim').hide();
        $('.close').click(() => {
            msgOpen = false;
            msgs.splice(0, msgs.length);
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
                     BACKGAME.useItem(name, info.itemId);
                    break;
                case 'learnAtkDrop':
                     BACKGAME.learnAtkDrop(name);
                    break;
            }
        });

    }

    // 展示道具
    function showItems(name) {
        let items =  BACKGAME.getItems(name)
        for (let item of items) {
            if (item.number > 0) {
                $('#ITEMS').append('<div id="' + item.itemId + '" class="item"><img src="./public/img/items/' + item.imgUrl + '"><span class="' + item.quality + '">' + item.itemName + '*' + item.number + '</span></div>')
            }

        }
    }

    // 显示元素
    function showFel(name) {
        let fel =  BACKGAME.getFel(name)
        for (let i in fel) {
            if (fel[i] > 0) {
                let felName =  BACKGAME.changeElement(i);
                $('#fel').append('<p>' + felName + fel[i] + '</p>')
            }
        }
    }



    // 第一层循环
    function updata() {
        // 检测消息板
        if (!msgOpen && msgs.length > 0) {
            showErrMsg();
        }

        // 检测是否需要刷新
        if (refreshData) {
             BACKGAME.savePlayer(curPlayerName, showInfo);
            refreshData = false;
            initShowInfo();
        }

        // 循环显示
        if (isCycle) {
            showCycleInfo();
        }
    }

    // 更新展示信息
    function initShowInfo() {
        let player =  BACKGAME.getPlayerData(curPlayerName);
        showInfo.reiki = player.reiki;
        showInfo.lastCTime = player.lastCTime;
        showInfo.rlevel = player.Rlevel;
        showInfo.atkInfo = player.atk.learnAtk;  
    }

    // 第二层循环
    function showCycleInfo() {
        let player =  BACKGAME.getPlayerData(curPlayerName);
        let res =  BACKGAME.countAddReiki(player, showInfo.reiki, showInfo.lastCTime);
        showInfo.reiki += res.addReiki;
        showInfo.lastCTime = res.newTime;
        showInfo.rlevel =  BACKGAME.checkRlevel(showInfo.reiki);
        $('#xinxi').html('<p>' + player.name + '</p>' + '<p>' + showInfo.atkInfo + '</p>' + '<p>' + showInfo.rlevel + '</p>');
        $('#reiki').text("灵力" +  BACKGAME.round(showInfo.reiki, 2));
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