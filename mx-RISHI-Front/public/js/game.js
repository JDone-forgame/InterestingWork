$(function () {
    // 大循环
    setInterval(() => {
        updata();
    }, 1000);

    // 信息弹窗是否已经打开
    let msgOpen = false;
    // 信息板
    let msgs = [];

    // 是否需要更新修炼参数
    let changePP = true;
    // 修炼参数
    let earnSpeed = 0;
    let lastSave = 0;
    let reiki = 0;

    // 是否开始了游戏
    let start = false;

    // ajax 请求
    let xmlhttp;

    const local = 'http:10.0.0.180:19000/game'

    // 开始游戏
    function startGame() {
        let name = $('#name').val();
        let password = $('#password').val();
        if (name == null || name == '') {
            msgs.push('请输入您的名称!')
            return;
        }

        let param = "name=" + name + "&password=" + password;

        loadXMLDoc(local + "/local/login", param, function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                data = JSON.parse(xmlhttp.responseText);
                let role = data.role;

                // 保存到 session 中
                sessionStorage.setItem('role',xmlhttp.responseText)

                // 展示页面
                startPage(role)
            }
        });
    }


    // 开始页面
    function startPage(role) {
        start = true;

        // 元素展示
        showFel(role);

        // 显示个人信息
        showBaseInfo(role);

        // 头像展示
        $('#head').html('<img src="./public/img/head/' + role.baseInfo.headUrl + '">')

        // 按键准备
        $('#items').click(openPackage)
        $('#xbtn1').click();

        // 页面切换
        $('#KAISHI').hide();
        $('#XIULIAN').show();
    }


    // 显示元素
    function showFel(role) {
        let fel = role.fElements;
        for (let i in fel) {
            if (fel[i] > 0) {
                let felName = changeElement(i);
                $('#fel').append('<p>' + felName + fel[i] + '</p>')
            }
        }
    }


    // 显示个人信息
    function showBaseInfo(role) {
        let atkMethod = role.atkMethod;
        let practice = role.practice;
        $('#xinxi').html('<p>' + role.nickName + '</p>' + '<p>' + atkMethod.atkName + atkMethod.atkLevel + '阶' + '</p>' + '<p>' + practice.rLevel + '</p>');
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


    // 展示道具
    function showItems(name) {
        let items = BACKGAME.getItems(name)
        for (let item of items) {
            if (item.number > 0) {
                $('#ITEMS').append('<div id="' + item.itemId + '" class="item"><img src="./public/img/items/' + item.imgUrl + '"><span class="' + item.quality + '">' + item.itemName + '*' + item.number + '</span></div>')
            }

        }
    }

    // 第一层循环
    function updata() {
        // 检测消息板
        if (!msgOpen && msgs.length > 0) {
            showErrMsg();
        }

        if(start){
            showCycleInfo(changePP);
        }
        
        
    }

    // 第二层循环
    function showCycleInfo(changePP) {
        if(changePP){
            let sData = sessionStorage.getItem('role');
            let role = JSON.parse(sData).role;
            let practice = role.practice;
            earnSpeed = practice.earnSpeed;
            lastSave = practice.lastSave;
            reiki = practice.reiki;
            changePP = false;
        }

        let nowTime = Date.now();
        let earnTime = (nowTime - lastSave) / 1000;
        let addReiki = earnTime * earnSpeed;
        reiki += addReiki;
        lastSave = nowTime;
        $('#reiki').text("灵力" + round(reiki, 2));
    }

    // // 测试按钮
    // function xbtn1() {
    //     let info = {
    //         funcName: "learnAtkDrop",
    //     }
    //     showUseMsg('<p>你确定要散功吗？散功会流失你的部分灵力!</p>', curPlayer, info)
    // }



    // // 使用背包道具
    // function usePackageItem() {
    //     let itemId = $(this).attr("id");
    //     console.log('查看' + itemId)
    //     let aitem;

    //     for (let item of Items) {
    //         if (item.itemId == itemId) {
    //             aitem = item;
    //         }
    //     }

    //     let info = {
    //         funcName: "useItem",
    //         itemId: itemId
    //     }
    //     showUseMsg(aitem.descri, curPlayerName, info);
    // }

    // // *提示信息
    // function showErrMsg() {
    //     for (let msg of msgs) {
    //         $('#msg').append(msg);
    //     }
    //     msgOpen = true;
    //     $('#MSG').show();
    //     $('#msgConfim').hide();
    //     $('.close').click(() => {
    //         msgOpen = false;
    //         msgs.splice(0, msgs.length);
    //         $('#msg').empty();
    //         $('#MSG').hide();
    //     });
    // }

    // // 使用道具弹窗
    // function showUseMsg(msgInfo, name, info) {
    //     $('#msg').append(msgInfo)
    //     $('#MSG').show();
    //     $('#msgConfim').show();
    //     $('.close').click(() => {
    //         $('#msg').empty();
    //         $('#MSG').hide();
    //     });
    //     $('.confim').click(() => {
    //         $('#msg').empty();
    //         $('#MSG').hide();
    //         switch (info.funcName) {
    //             case 'useItem':
    //                 BACKGAME.useItem(name, info.itemId);
    //                 break;
    //             case 'learnAtkDrop':
    //                 BACKGAME.learnAtkDrop(name);
    //                 break;
    //         }
    //     });

    // }









    

    /**-------------------------------------------------辅助函数------------------------------------------------------------------ */
    // 发送请求实现
    function loadXMLDoc(url, param, cfunc) {
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = cfunc;
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(param);
    }

    // 元素转文字
    function changeElement(elementName) {
        let result = '';
        switch (elementName) {
            case "Metal":
                result = "<span class='metal'>金</span>";
                break;
            case "Wood":
                result = "<span class='wood'>木</span>";
                break;
            case "Water":
                result = "<span class='water'>水</span>";
                break;
            case "Fire":
                result = "<span class='fire'>火</span>";
                break;
            case "Earth":
                result = "<span class='earth'>土</span>";
                break;
        }
        return result;
    }

    // 取指定位数小数
    function round(number, precision) {
        return Math.round(+number + 'e' + precision) / Math.pow(10, precision);
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