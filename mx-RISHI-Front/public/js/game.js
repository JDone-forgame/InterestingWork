$(function () {
    // 大循环
    setInterval(() => {
        updata();
    }, 100);


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

    // 交互中
    let isGettingData = false;

    // 请求
    let xmlhttp;

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

        if (!isGettingData) {
            isGettingData = true;

            let data = Net.jqAjax(reqUrls.loginUrl, param)
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


            // Net.loadXMLDoc(reqUrls.loginUrl, param, () => {
            //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //         data = JSON.parse(xmlhttp.responseText);

            //         if (data.code == 0) {
            //             let role = data.role;
            //             let roleJson = JSON.stringify(role);

            //             // 初始化登录参数
            //             startTime = data.localTime;

            //             // 保存到 session 中
            //             sessionStorage.setItem('token', data.token);
            //             sessionStorage.setItem('role', roleJson);

            //             // 展示页面
            //             startPage()

            //             isGettingData = false;
            //         } else {
            //             msgc.msgs.push('<p>code:' + data.code + '</p><p>errMsg:' + data.errMsg + '</p>')
            //         }
            //     }
            // })
        }
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
        $('#eq_close').click(() => {
            $('#EQUIP').hide();
            $('#XIULIAN').show();
        });
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

        console.log('查看了' + item.sItemName + ',itemId:' + info.itemId)
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

        $('#msgConfim').click(() => {
            if (!isGettingData) {
                isGettingData = true;

                let param = {
                    gameId: role.gameId,
                    token: token,
                    optionStr: info.funcName + '|' + info.itemId + '|' + '1'
                }
                Net.loadXMLDoc(reqUrls.itemsOptionUrl, param, () => {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        data = JSON.parse(xmlhttp.responseText);

                        if (data.code == 0) {
                            // 表示使用成功，更新信息
                            role.playerItems = data.playerItems;
                            role.practice = data.practice;
                            role.atkMethod = data.atkMethod;

                            // 保存到 session 中
                            sessionStorage.setItem('role', JSON.stringify(role))

                            // 更新修炼信息
                            changePP = true;

                            // 页面操作
                            changeItemList('cho_all');

                            $('#msg').empty();
                            $('#MSG').hide();
                            isGettingData = false;
                        } else {
                            msgc.msgs.push('<p>code:' + data.code + '</p><p>errMsg:' + data.errMsg + '</p>')
                        }
                    }
                })
            }
        })
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
                            msgc.msgs.push('<p><span class="' + item.sQuality + '">' + item.sItemName + '</span>:' + lcInfo[1] + '</p>')
                        }

                        isGettingData = false;
                    } else {
                        msgc.msgs.push('<p>code:' + data.code + '</p><p>errMsg:' + data.errMsg + '</p>')
                    }


                }
            });
        }
    }

    // 每日一缘
    function getluckday() {
        let role = JSON.parse(sessionStorage.getItem('role'));
        if (role.luckChance.luckday >= 3) {
            return;
        }
        console.log('每日一缘次数：' + role.luckChance.luckday);
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
    // 发送请求模块
    let Net = {
        post: (reqUrl, param) => {
            // let xmlhttp;
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            }
            else {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    data = JSON.parse(xmlhttp.responseText);
                    return data;
                }
            }

            xmlhttp.open("POST", reqUrl, true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send(param);
        },
        get: (url, params, cfunc) => {
            // let xmlhttp;
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            }
            else {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            // 处理参数
            let param = '';
            for (let key in params) {
                param += "&" + key + "=" + params[key];
            }
            param = param.slice(1, param.length);
            xmlhttp.onreadystatechange = cfunc
            xmlhttp.open("GET", url + '?' + param, true);
            xmlhttp.send();
            // 测试用
            console.log(url + '?' + param);
        },
        loadXMLDoc: (url, params, cfunc) => {
            console.log('url:' + url + ',params:')
            console.log(params)
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            }
            else {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            // 处理参数
            let param = '';
            for (let key in params) {
                param += "&" + key + "=" + params[key];
            }
            param = param.slice(1, param.length);

            xmlhttp.onreadystatechange = cfunc;
            xmlhttp.open("POST", url, true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send(param);

            // 测试用
            console.log(url + '?' + param);
        },
        jqAjax: (url, params, cfunc) => {
            $.ajax({
                type: "GET",
                url: url,
                data: params,
                async: false,
                cache: false,
                complete(XHR, TS) {
                    if (TS == 'success') {
                        let data = XHR.responseJSON;
                        console.log(data);
                        return data;
                    } else {
                        console.log('failed over!')
                    }
                }
            });
        }
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
        $('#startGame').click(login);

        // 弹窗页面
        $('#msgConfim').hide();
        $('#msgClose').click(() => {
            msgc.msgOpening = false;
            msgc.msgs.splice(0, msgc.msgs.length);
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
        let addReiki = earnTime * earnSpeed;
        reiki += addReiki;
        lastSave = nowTime;
        $('#reiki').text("灵力" + Math.floor(reiki));
    }

    // *提示信息
    function showErrMsg() {
        for (let msg of msgc.msgs) {
            $('#msg').append(msg);
        }
        msgc.msgOpening = true;
        isGettingData = false;
        $('#MSG').show();
        // $('#msgConfim').hide();
        // $('#msgClose').click(() => {
        //     msgc.msgOpening = false;
        //     msgc.msgs.splice(0, msgc.msgs.length);
        //     $('#msg').empty();
        //     $('#MSG').hide();
        // });
    }

    init();
})