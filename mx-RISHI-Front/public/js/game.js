$(function () {
    // 大循环
    setInterval(() => {
        updata();
    }, 1000);


    // 清理 session
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('token');

    // 信息弹窗模块
    let msgc = {
        // 信息弹窗是否已经打开
        msgOpening: false,
        // 信息板
        msgs: [],
        // 信息弹窗是否需要刷新内容
        msgNeedRload: false,
    }

    // 是否需要更新修炼参数
    let changePP = true;
    // 修炼参数
    let earnSpeed = 0;
    let lastSave = 0;
    let reiki = 0;

    // 本次登录的时间
    let startTime = 0;

    /**-------------------------------------------------流程函数------------------------------------------------------------------ */

    // 登录
    function login() {
        let name = $('#name').val();
        let password = $('#password').val();

        if (name == null || name == '') {
            msgc.msgs.push('请输入您的名称!')
            return;
        }

        let param = {
            name: name,
            password: password,
        }

        $.ajax({
            type: "GET",
            url: reqUrls.loginUrl,
            data: param,
            async: true,
            cache: false,
            complete(XHR, TS) {
                if (TS == 'success') {
                    let data = XHR.responseJSON;
                    if (data.code == 0) {
                        let role = data.role;
                        let roleJson = JSON.stringify(role);

                        // 初始化登录参数
                        startTime = data.localTime;

                        // 保存到 session 中
                        sessionStorage.setItem('token', data.token);
                        sessionStorage.setItem('role', roleJson);

                        // 展示页面
                        startPage()

                        isGettingData = false;
                    } else {
                        msgc.msgs.push('<p>code:' + data.code + '</p><p>errMsg:' + data.errMsg + '</p>')
                    }

                } else {
                    console.log('failed over!')
                }
            }
        });
    }

    // 开始页面
    function startPage() {
        let role = JSON.parse(sessionStorage.getItem('role'))

        // 显示个人信息
        showBaseInfo();

        // 页面切换
        $('#KAISHI').hide();
        $('#XIULIAN').show();

        // TODO:随机或者指定背景
        let bgIndex = getRandom(1, 50);
        $('#XIULIAN').css('background-image', "url('./public/img/bg/" + bgIndex + ".png')");

        // TODO:弹窗
        msgc.msgs.push('<p>登录者--[' + role.nickName + ']!</p>')
    }

    // 显示个人信息
    function showBaseInfo() {
        let role = JSON.parse(sessionStorage.getItem('role'));
        let fel = role.fElements;
        let atkMethod = role.atkMethod;
        let practice = role.practice;


        // 头像信息
        $('#head').html('<img src="./public/img/head/' + role.baseInfo.headUrl + '">')

        // 元素信息
        $('#fel').empty();
        for (let i in fel) {
            if (fel[i] > 0) {
                let felName = changeElement(i);
                $('#fel').append('<p>' + felName + fel[i] + '</p>')
            }
        }
        $('#xinxi').html('<p>' + role.nickName + '</p>' + '<p>' + atkMethod.atkName + atkMethod.atkLevel + '阶' + '</p>' + '<p>' + practice.rLevel + '</p>');

        // 精力信息
        $('#lc_energy').text('[精力]' + role.practice.energy)
    }

    // 打开背包
    function openPackage() {
        $('#XIULIAN').hide();
        $('#ITEMS').show();

        showItems('all');
    }

    // 点击道具导航
    function clickItemList() {
        let choList = $(this).attr("id");
        console.log('点击了' + choList)

        changeItemList(choList)
    }

    // 改变道具展示
    function changeItemList(choList) {
        let allList = ['cho_all', 'cho_danyao', 'cho_gongfa', 'cho_chailiao', 'cho_zhuangbei'];
        for (let i = 0; i < allList.length; i++) {
            let curL = allList[i];
            if (curL != choList) {
                $('#' + curL).css('background-color', 'black');
            }
        }
        $('#' + choList).css('background-color', 'teal');

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
    }

    // 打开装备页面
    function openEquipInfo() {
        $('#XIULIAN').hide();
        $('#EQUIP').show();
        showEquip();
    }

    // 展示道具
    function showItems(itemType) {
        $('div').remove(".item");
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
        $('.item').click(usePackageItem);
    }

    // 展示装备
    function showEquip() {
        let role = JSON.parse(sessionStorage.getItem('role'));
        let equipment = role.equipment;

        for (let key in equipment) {
            if (key == 'totalAtk' || key == 'totalDef' || key == 'totalSpe' || key == 'totalCri' || key == 'totalCsd' || key == 'totalHea') {
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

        let atk = equipment.totalAtk;
        let def = equipment.totalDef;

        let showInfo = "<p>总攻击:&emsp;<span class='fire'>" + atk.Fire + "</span>&emsp;<span class='water'>" + atk.Water + "</span>&emsp;<span class='metal'>" + atk.Metal + "</span>&emsp;<span class='wood'>" + atk.Wood + "</span>&emsp; <span class='earth'>" + atk.Earth + "</span>&emsp;<span class='physical'>" + atk.Physical + "</span></p>";
        showInfo += "<p>总防御:&emsp;<span class='fire'>" + def.Fire + "</span>&emsp;<span class='water'>" + def.Water + "</span>&emsp;<span class='metal'>" + def.Metal + "</span>&emsp;<span class='wood'>" + def.Wood + "</span> &emsp;<span class='earth'>" + def.Earth + "</span>&emsp;<span class='physical'>" + def.Physical + "</span></p>";
        showInfo += "<p>总速度:" + equipment.totalSpe + "</p>";
        showInfo += "<p>暴击率:" + equipment.totalCri + "%</p>";
        showInfo += "<p>暴击伤害:" + equipment.totalCsd + "%</p>";
        showInfo += "<p>血量:" + equipment.totalHea + "</p>";

        $('#eq_eqInfo').html(showInfo)
    }

    // 脱下装备
    function takeOffEquip() {
        let choList = $(this).attr("id");
        console.log('点击了' + choList)

        let role = JSON.parse(sessionStorage.getItem('role'));
        let token = sessionStorage.getItem('token');

        let location = choList.slice(3, choList.length)
        let param = {
            gameId: role.gameId,
            token: token,
            location: location,
        }

        $.ajax({
            type: "POST",
            url: reqUrls.takeOffEquip,
            data: param,
            async: true,
            cache: false,
            complete(XHR, TS) {
                if (TS == 'success') {
                    let data = XHR.responseJSON;

                    if (data.code == 0) {
                        role = data.role;

                        sessionStorage.setItem('role', JSON.stringify(role));

                        $('#' + choList).css('background-image', "");
                        $('#' + choList).css('border', "solid rgb(59, 59, 59) 1rem");
                        $('#' + choList).html('');
                        showEquip();
                    }

                } else {
                    console.log('failed over!')
                }
            }
        });
    }

    // 使用背包道具
    function usePackageItem() {
        let itemId = $(this).attr("id");

        let info = {
            funcName: "use",
            itemId: itemId,
            showUse: true,
            itemName: '',
        }

        let item = Items.get(itemId);
        let msgInfo = '<p>' + item.sDescribe + '</p>';
        if (item.sItemType == 2) {
            msgInfo += '<p>注意：你将要使用功法道具，如果你已经修行了别的功法，改学功法可能会损失一定的灵气！</p>';
        }
        if (item.sEffect == 'None') {
            $('#msgConfim').hide();
            info.showUse = false;
        }

        info.itemName = item.sItemName;
        console.log('查看了' + item.sItemName + ',itemId:' + info.itemId + ',itemEffect:' + item.sEffect)
        showUseMsg(msgInfo, info);
    }

    // 使用道具弹窗
    function showUseMsg(msgInfo, info) {
        $('#msg').append(msgInfo)
        $('#MSG').show();

        // 是否展示使用按钮
        if (info.showUse) {
            $('#msgConfim').show();
            $('#msgConfim').text('使用' + info.itemName);
            $('#msgClose').text('取消')
        }

        $("#msgConfim").bind("click", () => {
            optionsItem(info.funcName, info.itemId, 1)
        })

    }

    // 操作道具
    function optionsItem(option, itemId, count) {
        let token = sessionStorage.getItem('token');
        let role = JSON.parse(sessionStorage.getItem('role'));

        let param = {
            gameId: role.gameId,
            token: token,
            optionStr: option + '|' + itemId + '|' + count
        }

        console.log(param.optionStr)
        $.ajax({
            type: "POST",
            url: reqUrls.itemsOptionUrl,
            data: param,
            async: true,
            cache: false,
            complete(XHR, TS) {
                if (TS == 'success') {
                    let data = XHR.responseJSON;
                    if (data.code == 0) {
                        // 表示使用成功，更新信息
                        role = data.role;

                        // 保存到 session 中
                        sessionStorage.setItem('role', JSON.stringify(role))

                        // 更新修炼信息
                        changePP = true;

                        // 页面操作
                        changeItemList('cho_all');
                    } else {
                        msgc.msgs.push('<p>code:' + data.code + '</p><p>errMsg:' + data.errMsg + '</p>')
                    }
                } else {
                    console.log('failed over!')
                }
            }
        });
    }

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

        let param = {
            gameId: role.gameId,
            token: token,
            type: type,
            count: count,
        }
        $.ajax({
            type: "POST",
            url: reqUrls.luckChance,
            data: param,
            async: true,
            cache: false,
            complete(XHR, TS) {
                if (TS == 'success') {
                    let data = XHR.responseJSON;
                    let resultLC = [];

                    if (data.code == 0) {
                        // 表示使用成功，更新信息
                        role = data.role;
                        resultLC = data.resultLC;
                        let luckChance = role.luckChance;
                        for (let key in luckChance) {
                            if (key == type) {
                                luckChance[key] += count;
                            }
                        }


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
                            msgc.msgs.push('<p><span class="' + item.sQuality + '">' + item.sItemName + '</span>:' + lcInfo[1] + '</p>')
                            msgc.msgNeedRload = true;
                        }

                    } else {
                        msgc.msgs.push('<p>code:' + data.code + '</p><p>errMsg:' + data.errMsg + '</p>')
                    }
                } else {
                    console.log('failed over!')
                }
            }
        });
    }

    // 每日一缘
    function getluckday() {
        let role = JSON.parse(sessionStorage.getItem('role'));
        if (role.luckChance.luckday >= 3) {
            return;
        }
        let nowTime = Date.now();
        // 每次获取间隔-分钟
        let timeLimit = 0.5;
        if (((nowTime - startTime) / 1000) > timeLimit * 60) {
            // 可以获得每日一缘了
            xmlLuckChance('luckday', 1);
            startTime = nowTime;
        }
    }

    // 进入副本选择页面
    function openFightRoom() {
        $('#XIULIAN').hide();
        $('#FIGHTROOM').show();
        $('#fr_close').click(() => {
            $('#FIGHTROOM').hide();
            $('#XIULIAN').show();
        });
    }








    /**-------------------------------------------------辅助函数------------------------------------------------------------------ */
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
        $('#startGame').click(login);

        // 弹窗页面
        $('#msgConfim').hide();
        $('#msgClose').click(() => {
            msgc.msgOpening = false;
            msgc.msgs.splice(0, msgc.msgs.length);
            $('#msgConfim').unbind();
            $('#msgConfim').hide();
            $('#msgClose').text('已阅');
            $('#msg').empty();
            $('#MSG').hide();
        });

        // 修炼页面
        $('#itemsIcon').click(openPackage)
        $('#luckChanceIcon').click(openLuckChance)
        $('#equipIcon').click(openEquipInfo)
        $('#fightRoomIcon').click(openFightRoom)

        // 背包页面
        $('.cho').click(clickItemList);
        $('#it_close').click(() => {
            $('#ITEMS').hide();
            $('#XIULIAN').show();
        });

        // 装备页面
        $('.eqBlock').click(takeOffEquip)
        $('#eq_close').click(() => {
            $('#EQUIP').hide();
            $('#XIULIAN').show();
        });

    }

    // 第一层循环
    function updata() {
        // 检测消息板
        if ((!msgc.msgOpening && msgc.msgs.length > 0) || (msgc.msgOpening && msgc.msgNeedRload)) {
            showErrMsg();
        }

        // 只有登录后才开始执行
        if (sessionStorage.getItem('role')) {
            showCycleInfo();
            // 检测是否可以获得每日一缘
            getluckday();
        }
    }

    // 第二层循环
    function showCycleInfo() {
        if (changePP) {
            let role = JSON.parse(sessionStorage.getItem('role'));
            let practice = role.practice;

            // 更新修炼信息
            earnSpeed = practice.earnSpeed;
            lastSave = practice.lastSave;
            reiki = practice.reiki;

            // 更新展示信息
            showBaseInfo();

            changePP = false;
        }

        let nowTime = Date.now();
        let earnTime = (nowTime - lastSave) / 1000;
        let addReiki = Math.sqrt(earnTime * earnSpeed);
        reiki += addReiki;
        lastSave = nowTime;
        $('#reiki').text("灵力" + Math.floor(reiki));
    }

    // *提示信息
    function showErrMsg() {
        if(msgc.msgOpening && msgc.msgNeedRload){
            // 如果是在打开中更新
            $('#msg').empty();
        }
        for (let msg of msgc.msgs) {
            $('#msg').append(msg);
        }
        msgc.msgOpening = true;
        $('#MSG').show();
    }

    init();
})