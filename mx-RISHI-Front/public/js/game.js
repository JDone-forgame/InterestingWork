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
    // 本次登录的时间
    let startTime = 0;

    // 每日一缘次数
    let luckday = 0;

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

                if (data.code == 0) {
                    let role = data.role;
                    sRole = JSON.stringify(role);

                    // 保存本次登录时间
                    startTime = data.localTime;
                    luckday = role.luckChance['luckday'];

                    // 保存到 session 中
                    sessionStorage.setItem('loginData', xmlhttp.responseText);
                    sessionStorage.setItem('role', sRole);

                    // 展示页面
                    startPage(role)
                } else {
                    msgs.push('<p>code:' + data.code + '</p><p>errMsg:' + data.errMsg + '</p>')
                }

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
        $('#itemsIcon').click(openPackage)
        $('#luckChanceIcon').click(openLuckChance)

        // 页面切换
        $('#KAISHI').hide();
        $('#XIULIAN').show();

        // 欢迎弹窗
        msgs.push('<p>[' + role.nickName + ']欢迎回来!</p>')
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

    /**----------Items---------------------------------------------------------------------- */
    // 打开背包
    function openPackage() {
        $('#KAISHI').hide();
        $('#XIULIAN').hide();
        showItems();
        $('#ITEMS').show();
        $('.item').click(usePackageItem)
        $('.close').click(() => {
            $('div').remove(".item");
            $('#ITEMS').hide();
            $('#XIULIAN').show();
        });
    }


    // 展示道具
    function showItems() {
        let role = JSON.parse(sessionStorage.getItem('role'));
        let items = role.playerItems;
        for (let key in items) {
            if (items[key] > 0) {
                let item = Items.get(key);
                $('#ITEMS').append('<div id="' + item.sID + '" class="item"><img src="./public/img/items/' + item.sImgUrl + '"><span class="' + item.sQuality + '">' + item.sItemName + '*' + items[key] + '</span></div>')
            }
        }
    }


    // 使用背包道具
    function usePackageItem() {
        let itemId = $(this).attr("id");
        console.log('查看了' + itemId)

        let info = {
            funcName: "use",
            itemId: itemId
        }

        let item = Items.get(itemId);
        let msgInfo = '<p>' + item.sDescribe + '</p>';
        if (item.sItemType == 2) {
            msgInfo += '<p>注意：你将要使用功法道具，如果你已经修行了别的功法，改学功法可能会损失一定的灵气！</p>';
        }

        showUseMsg(msgInfo, info);
    }


    // 使用道具弹窗
    function showUseMsg(msgInfo, info) {
        let sData = JSON.parse(sessionStorage.getItem('loginData'));
        let role = sData.role;

        $('#msg').append(msgInfo)
        $('#MSG').show();
        $('#msgConfim').show();
        $('.close').click(() => {
            $('#msg').empty();
            $('#MSG').hide();
        });
        $('.confim').click(() => {
            let optionStr = info.funcName + '|' + info.itemId + '|' + '1';
            let param = 'gameId=' + role.gameId + '&token=' + sData.token + '&optionStr=' + optionStr;
            loadXMLDoc(local + "/local/itemsOption", param, function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    data = JSON.parse(xmlhttp.responseText);

                    if (data.code == 0) {
                        // 表示使用成功，更新信息
                        role.playerItems = data.playerItems;
                        role.practice = data.practice;
                        role.atkMethod = data.atkMethod;
                        // 保存到 session 中
                        sRole = JSON.stringify(role);
                        sessionStorage.setItem('role', sRole)
                        // 更新修炼信息
                        changePP = true;
                    } else {
                        msgs.push('<p>code:' + data.code + '</p><p>errMsg:' + data.errMsg + '</p>')
                    }



                    // 页面操作
                    $('div').remove(".item");
                    showItems();

                    $('#msg').empty();
                    $('#MSG').hide();
                }
            });
        });
    }

    /**----------LuckChance---------------------------------------------------------------------- */
    // 打开机缘页面
    function openLuckChance() {
        let sData = JSON.parse(sessionStorage.getItem('loginData'));
        let role = sData.role;

        $('#XIULIAN').hide();
        $('#LUCKCHANCE').show();
        $('#lc_energy').text('[精力]' + role.practice.energy)
        $('.lcImg').click(getLuckChance)
        $('.close').click(() => {
            $('#LUCKCHANCE').hide();
            $('#XIULIAN').show();
        });
    }

    // 获取机缘
    function getLuckChance() {
        let lcId = $(this).attr("id");
        console.log('选择了' + lcId)

        let sData = JSON.parse(sessionStorage.getItem('loginData'));
        let role = sData.role;

        let count = 0;
        let type = 'normal';

        if (lcId == 'lc_oneLC') {
            count = 1;
        } else if (lcId == 'lc_fiveLC') {
            count = 5
        }

        xmlLuckChance(type, count)
    }

    // 请求机缘
    function xmlLuckChance(type, count) {
        let sData = JSON.parse(sessionStorage.getItem('loginData'));
        let role = sData.role;

        let param = 'gameId=' + role.gameId + '&token=' + sData.token + '&type=' + type + '&count=' + count;
        loadXMLDoc(local + "/local/luckChance", param, function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                data = JSON.parse(xmlhttp.responseText);

                let resultLC = [];

                if (data.code == 0) {
                    // 表示使用成功，更新信息
                    role.playerItems = data.playerItems;
                    role.practice = data.practice;
                    resultLC = data.resultLC;


                    // 保存到 session 中
                    sRole = JSON.stringify(role);
                    sessionStorage.setItem('role', sRole)


                    // 更新修炼信息
                    changePP = true;
                } else {
                    msgs.push('<p>code:' + data.code + '</p><p>errMsg:' + data.errMsg + '</p>')
                }

                // 页面展示
                for (let i = 0; i < resultLC.length; i++) {
                    let str = resultLC[i];
                    let lcInfo = str.split('|');
                    let item = Items.get(lcInfo[0]);
                    msgs.push('<p><span class="' + item.sQuality + '">' + item.sItemName + '</span>:' + lcInfo[1] + '</p>')
                }
            }
        });
    }

    // 每日一缘
    function getluckday() {
        if(luckday>=3){
            return;
        }
        let nowTime = Date.now();
        // 每次获取间隔-分钟
        let timeLimit = 1;
        if (((nowTime - startTime) / 1000) > timeLimit * 60) {
            // 可以获得每日一缘了
            xmlLuckChance('luckday', 1);
            startTime = nowTime;
            luckday += 1;
        }
    }






    // 第一层循环
    function updata() {
        // 检测消息板
        if (!msgOpen && msgs.length > 0) {
            showErrMsg();
        }

        if (start) {
            showCycleInfo(changePP);
            // 检测是否可以获得每日一缘
            getluckday();
        }
    }


    // 第二层循环
    function showCycleInfo(changePP) {
        if (changePP) {
            let role = JSON.parse(sessionStorage.getItem('role'));
            let practice = role.practice;

            // 更新修炼信息
            earnSpeed = practice.earnSpeed;
            lastSave = practice.lastSave;
            reiki = practice.reiki;

            // 更新展示信息
            showBaseInfo(role);
            changePP = false;
        }

        let nowTime = Date.now();
        let earnTime = (nowTime - lastSave) / 1000;
        let addReiki = earnTime * earnSpeed;
        reiki += addReiki;
        lastSave = nowTime;
        $('#reiki').text("灵力" + Math.floor(reiki));
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
        $('#LUCKCHANCE').hide();

        // $('#KAISHI').hide();
        // $('#XIULIAN').hide();
        // $('#MSG').hide();
        // $('#ITEMS').hide();
        // $('#LUCKCHANCE').show();


        $('#startGame').click(startGame);
    }

    init();
})