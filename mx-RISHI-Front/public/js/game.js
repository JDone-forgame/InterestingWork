$(function () {
    // 大循环
    setInterval(() => {
        updata();
    }, 500);

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
    // 令牌
    let token = '';

    // 每日一缘次数
    let luckday = 0;

    // 交互中
    let isGettingData = false;

    // ajax 请求
    let xmlhttp;

    const qualityColor = new Map()
    qualityColor['S'] = '#FFD700';
    qualityColor['A'] = '#9400D3';
    qualityColor['B'] = '#87CEFA';
    qualityColor['C'] = '#32CD32';


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
                    sessionStorage.setItem('token', data.token);
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
        $('#equipIcon').click(openEquipInfo)

        // 页面切换
        $('#KAISHI').hide();
        // todo随机或者指定背景
        let bgIndex = getRandom(1, 50);
        $('#XIULIAN').css('background-image', "url('./public/img/bg/" + bgIndex + ".png')");
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
        showItems('all');
        $('#ITEMS').show();
        $('.cho').click(changeItemList);
        $('.item').click(usePackageItem);
        $('#it_close').click(() => {
            $('div').remove(".item");
            $('#ITEMS').hide();
            $('#XIULIAN').show();
        });
    }

    // 点击道具导航
    function changeItemList() {
        let choList = $(this).attr("id");
        console.log('点击了' + choList)

        let allList = ['cho_all', 'cho_danyao', 'cho_gongfa', 'cho_chailiao', 'cho_zhuangbei'];
        for (let i = 0; i < allList.length; i++) {
            let curL = allList[i];
            if (curL != choList) {
                $('#' + curL).css('background-color', 'black');
            }
        }
        $('#' + choList).css('background-color', 'teal');


        $('div').remove(".item");
        switch (choList) {
            case 'cho_all':
                showItems('all');
                break;
            case 'cho_danyao':
                showItems('1');
                break;
            case 'cho_gongfa':
                showItems('2');
                break;
            case 'cho_chailiao':
                showItems('3');
                break;
            case 'cho_zhuangbei':
                showItems('4');
                break;
        }

        $('.cho').click(changeItemList);
        $('.item').click(usePackageItem);
        $('#it_close').click(() => {
            $('div').remove(".item");
            $('#ITEMS').hide();
            $('#XIULIAN').show();
        });
    }

    // 打开装备页面
    function openEquipInfo() {
        $('#XIULIAN').hide();
        $('#EQUIP').show();
        showEquip();
        $('#eq_close').click(() => {
            $('#EQUIP').hide();
            $('#XIULIAN').show();
        });
    }

    // 展示道具
    function showItems(itemType) {
        let role = JSON.parse(sessionStorage.getItem('role'));
        let items = role.playerItems;
        for (let key in items) {
            if (items[key] > 0) {
                let item = Items.get(key);
                if (item.sItemType == itemType || itemType == 'all') {
                    $('#ITEMS').append('<div id="' + item.sID + '" class="item"><img src="./public/img/items/' + item.sImgUrl + '"><span class="' + item.sQuality + '">' + item.sItemName + '*' + items[key] + '</span></div>')
                }
            }
        }
    }

    // 展示装备
    function showEquip() {
        let role = JSON.parse(sessionStorage.getItem('role'));
        let equipment = role.equipment;

        for (let key in equipment) {
            if (key == 'totalAtk' || key == 'totalDef' || key == 'totalSpe') {
                continue;
            }
            let curEquip = equipment[key];
            if (curEquip != '') {
                let item = Items.get(curEquip);
                $('#eq_' + key).css('background-image', "url('./public/img/items/" + item.sImgUrl + "')");
                $('#eq_' + key).css('border', "solid " + qualityColor[item.sQuality] + " 1rem");
                $('#eq_' + key).html('<span class="' + item.sQuality + '">' + item.sItemName + '</span>');
            }
        }

        let showInfo = "<p>总攻击:</p>";
        showInfo += "<p>火伤:" + equipment.totalAtk.Fire + "</p>";
        showInfo += "<p>水伤:" + equipment.totalAtk.Water + "</p>";
        showInfo += "<p>金伤:" + equipment.totalAtk.Metal + "</p>";
        showInfo += "<p>木伤:" + equipment.totalAtk.Wood + "</p>";
        showInfo += "<p>土伤:" + equipment.totalAtk.Earth + "</p>";
        showInfo += "<p>物伤:" + equipment.totalAtk.Physical + "</p>";
        showInfo += "<p>总防御:</p>";
        showInfo += "<p>火抗:" + equipment.totalDef.Fire + "</p>";
        showInfo += "<p>水抗:" + equipment.totalDef.Water + "</p>";
        showInfo += "<p>金抗:" + equipment.totalDef.Metal + "</p>";
        showInfo += "<p>木抗:" + equipment.totalDef.Wood + "</p>";
        showInfo += "<p>土抗:" + equipment.totalDef.Earth + "</p>";
        showInfo += "<p>物抗:" + equipment.totalDef.Physical + "</p>";
        showInfo += "<p>总速度:" + equipment.totalSpe + "</p>";

        $('#eq_eqInfo').html(showInfo)
    }

    // 使用背包道具
    function usePackageItem() {
        let itemId = $(this).attr("id");
        console.log('查看了' + itemId)

        let info = {
            funcName: "use",
            itemId: itemId,
            showUse: true,
        }

        let item = Items.get(itemId);
        let msgInfo = '<p>' + item.sDescribe + '</p>';
        if (item.sItemType == 2) {
            msgInfo += '<p>注意：你将要使用功法道具，如果你已经修行了别的功法，改学功法可能会损失一定的灵气！</p>';
        }
        if (item.sEffect == 'None') {
            info.showUse = false;
        }

        showUseMsg(msgInfo, info);
    }


    // 使用道具弹窗
    function showUseMsg(msgInfo, info) {
        let token = sessionStorage.getItem('token');
        let role = JSON.parse(sessionStorage.getItem('role'));

        $('#msg').append(msgInfo)
        $('#MSG').show();

        // 是否展示使用按钮
        if (info.showUse) {
            $('#msgConfim').show();
        }
        $('.close').click(() => {
            $('#msg').empty();
            $('#MSG').hide();
        });
        $('.confim').click(() => {
            if (!isGettingData) {
                isGettingData = true;
                let optionStr = info.funcName + '|' + info.itemId + '|' + '1';
                let param = 'gameId=' + role.gameId + '&token=' + token + '&optionStr=' + optionStr;
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

                            // 页面操作
                            $('div').remove(".item");
                            showItems('all');

                            $('.cho').click(changeItemList);
                            $('.item').click(usePackageItem);
                            $('#it_close').click(() => {
                                $('div').remove(".item");
                                $('#ITEMS').hide();
                                $('#XIULIAN').show();
                            });

                            $('#msg').empty();
                            $('#MSG').hide();
                            isGettingData = false;
                        } else {
                            msgs.push('<p>code:' + data.code + '</p><p>errMsg:' + data.errMsg + '</p>')
                        }
                    }
                });
            }
        });
    }

    /**----------LuckChance---------------------------------------------------------------------- */
    // 打开机缘页面
    function openLuckChance() {
        let role = JSON.parse(sessionStorage.getItem('role'));

        $('#XIULIAN').hide();
        $('#LUCKCHANCE').show();
        $('#lc_energy').text('[精力]' + role.practice.energy)
        $('.lcImg').click(getLuckChance)
        $('#lc_close').click(() => {
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
        let token = sessionStorage.getItem('token');
        let role = JSON.parse(sessionStorage.getItem('role'));

        if (!isGettingData) {
            isGettingData = true;
            let param = 'gameId=' + role.gameId + '&token=' + token + '&type=' + type + '&count=' + count;
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

                        // 页面展示
                        for (let i = 0; i < resultLC.length; i++) {
                            let str = resultLC[i];
                            let lcInfo = str.split('|');
                            let item = Items.get(lcInfo[0]);
                            msgs.push('<p><span class="' + item.sQuality + '">' + item.sItemName + '</span>:' + lcInfo[1] + '</p>')
                        }

                        isGettingData = false;
                    } else {
                        msgs.push('<p>code:' + data.code + '</p><p>errMsg:' + data.errMsg + '</p>')
                    }


                }
            });
        }
    }

    // 每日一缘
    function getluckday() {
        if (luckday >= 3) {
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
            $('#lc_energy').text('[精力]' + role.practice.energy)
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
        isGettingData = false;
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

    // 随机从[min,max]区间取值
    function getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }
    /**-------------------------------------------------主函数------------------------------------------------------------------ */
    // 初始化
    function init() {
        $('#KAISHI').show();
        $('#XIULIAN').hide();
        $('#MSG').hide();
        $('#ITEMS').hide();
        $('#LUCKCHANCE').hide();
        $('#EQUIP').hide();


        // $('#KAISHI').hide();
        // $('#XIULIAN').hide();
        // $('#MSG').hide();
        // $('#ITEMS').show();
        // $('#LUCKCHANCE').hide();
        // $('#EQUIP').hide();


        $('#startGame').click(startGame);
    }

    init();
})