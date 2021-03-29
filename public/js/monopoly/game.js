$(function () {

    // 开场语
    $(".control_msg_content").html('<p>仿照的大富翁玩法，体验一下？</p><p>万丈高楼平地起，辉煌只能靠自己</p>');

    let updateInterval = setInterval(updateWorld, 1000);

    let player = {
        // 玩家的地图
        map: [],
        // 金币
        coin: 0,
        // 钻石
        diamond: 0,
        // 当前所在的建筑ID
        curBuildingSeq: 1,
        // 骰子个数
        diceCount: 20,
        // 总人口
        sumPeople: 20,
        // 城市等级
        cityLevel: 1,

        // 上次更新时间
        lastUpdataTime: 0,
    }

    // 当前所在的城市的数据
    let otherCityData = null;

    // 每列最大值
    const liMax = 5;
    // 每次骰子点数 为 0 则代表随机
    const dicePoint = 0;
    // 当前展示的建筑
    let curShowBuildSite = null;
    // 每多少秒恢复 1 骰子
    const diceRecoverInterval = 60;
    // 骰子上限
    const diceCountMax = 25;
    // 是否在自己城市
    let inSelfCity = true;

    // 在建筑时的css类
    const inBuilding = 'inThisBuilding';

    // 建筑的css类
    const BUILDCLASS = {
        build_vault: 'build_vault',
        build_ktv: 'build_ktv',
        build_foodStreet: 'build_foodStreet',
        build_skyscraper: 'build_skyscraper',
        build_shower: 'build_shower',
        build_station: 'build_station',
    };

    // 建筑type收益类型
    const BTYPE = {
        // 金币
        coin: 0,
        // 钻石
        diamond: 1,
    };

    // 城市各个等级
    const CITY_LEVEL = [
        {
            pLimit: 150,
            cityLevel: 8,
            cityLable: '一线城市',
        },
        {
            pLimit: 95,
            cityLevel: 7,
            cityLable: '二线城市',
        },
        {
            pLimit: 70,
            cityLevel: 6,
            cityLable: '三线城市',
        },
        {
            pLimit: 55,
            cityLevel: 5,
            cityLable: '大城镇',
        },
        {
            pLimit: 35,
            cityLevel: 4,
            cityLable: '小城镇',
        },
        {
            pLimit: 25,
            cityLevel: 3,
            cityLable: '大村落',
        },
        {
            // 人口要求
            pLimit: 21,
            // 城市要求
            cityLevel: 2,
            // 该等级城市标签
            cityLable: '小村落',
        }
    ];

    // 特殊建筑
    const SPE_BUILD = [
        {
            cityLevel: 4,
            unlockBuild: [{
                type: 1,
                buildingName: '摩天',
                buildingId: 20,
                earn: 2,
                event: 'e003',
                eachLevel: 2000,
                eachEarn: 2,
                buildClass: BUILDCLASS.build_skyscraper,
            }]
        },
        {
            cityLevel: 3,
            unlockBuild: [{
                type: 0,
                buildingName: 'KTV',
                buildingId: 14,
                earn: 15,
                event: 'e002',
                eachLevel: 250,
                eachEarn: 20,
                buildClass: BUILDCLASS.build_ktv,
            }, {
                type: 0,
                buildingName: '小吃',
                buildingId: 5,
                earn: 20,
                event: 'e002',
                eachLevel: 300,
                eachEarn: 25,
                buildClass: BUILDCLASS.build_foodStreet,
            }
            ]
        },
        {
            cityLevel: 2,
            unlockBuild: [{
                type: 1,
                buildingName: '金库',
                buildingId: 10,
                earn: 1,
                event: 'e001',
                eachLevel: 1000,
                eachEarn: 1,
                buildClass: BUILDCLASS.build_vault,
            },
            {
                type: 0,
                buildingName: '洗浴',
                buildingId: 2,
                earn: 10,
                event: 'e004',
                eachLevel: 200,
                eachEarn: 10,
                buildClass: BUILDCLASS.build_shower,
            },
            {
                type: 0,
                buildingName: '车站',
                buildingId: 15,
                earn: 10,
                event: 'e005',
                eachLevel: 200,
                eachEarn: 10,
                buildClass: BUILDCLASS.build_station,
            },
            ]
        }
    ];

    // 特殊建筑事件
    const EVENTS = [
        {
            eId: 'e001',
            desi: '金币大爆发！金币+1000',
            effect: 'addCoin',
            count: 1000,
        },
        {
            eId: 'e002',
            desi: '营业额大增！金币+500',
            effect: 'addCoin',
            count: 500,
        },
        {
            eId: 'e003',
            desi: '在摩天大楼俯瞰城市！钻石+5',
            effect: 'addDiamond',
            count: 5,
        },
        {
            eId: 'e004',
            desi: '在洗浴中心好好按了个摩！体力+5',
            effect: 'addDice',
            count: 5,
        },
        {
            eId: 'e005',
            desi: '去拜访其他的城市吧！',
            effect: 'goOtherCity',
            count: 1,
        },
    ]

    // 默认的土地
    const DEFBUILDING = {
        type: BTYPE.coin,
        name: '空地',
        earn: 10,
        event: '',
        level: 1,
        people: 1,
        eachLevel: 200,
        eachEarn: 10,
        eachPeople: 1,
    }

    // 主角的城市
    let otherCity1 = `{"map":[[{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"洗浴","earn":10,"event":"e004","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1}],[{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"空地","earn":20,"event":"","level":2,"people":2,"eachLevel":400,"eachEarn":20,"eachPeople":1},{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":1,"name":"金库","earn":1,"event":"e001","level":1,"people":1,"eachLevel":1000,"eachEarn":1,"eachPeople":1}],[{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"车站","earn":10,"event":"e005","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1}],[{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1},{"type":0,"name":"空地","earn":10,"event":"","level":1,"people":1,"eachLevel":200,"eachEarn":10,"eachPeople":1}]],"coin":140,"diamond":1,"curBuildingSeq":15,"diceCount":12,"sumPeople":90,"cityLevel":4,"lastUpdataTime":1616752681543}`

    //---------------------------------------------------------------//
    // 读取本地数据
    function initData() {
        if (localStorage.getItem('player')) {
            player = JSON.parse(localStorage.getItem('player'));
            updateDice();
        } else {
            // 初始化玩家的 map
            for (let j = 0; j < 4; j++) {
                let buildingLi = [];
                for (let i = 0; i < liMax; i++) {
                    buildingLi.push(DEFBUILDING);
                }
                player.map.push(buildingLi)
            }
            player.lastUpdataTime = Date.now();
            saveData(player);
        }
    }

    // 保存数据
    function saveData(player) {
        localStorage.setItem('player', JSON.stringify(player));
    }

    // 更新骰子
    function updateDice() {
        let nowTime = Date.now();
        if ((nowTime - player.lastUpdataTime) > 1) {
            let second = Math.floor((nowTime - player.lastUpdataTime) / 1000);
            let addDiceCount = Math.floor(second / diceRecoverInterval);
            if (addDiceCount >= 1) {
                player.diceCount += addDiceCount;
                if (player.diceCount > diceCountMax) {
                    player.diceCount = diceCountMax;
                    $("#diceCountRe").hide();
                } else {
                    $("#diceCountRe").show();
                }
                player.lastUpdataTime = nowTime;
            } else {
                let diceRe = diceRecoverInterval - second;
                updateInfo('diceRe', diceRe);
            }
        }
        updateInfo('dice', player.diceCount);
    }

    // 初始化游戏
    function initGame() {
        initMap();

        $('#roll').click(rollTheDice);
        $("#closeDetail").click(() => {
            curShowBuildSeq = [];
            openAndClosMsg(false, '')
        });

        $("#upBuildingLevel").click(upBuildingLevel);
        $("#control_msg_close").click(() => {
            $(".control_board").css('width', '0%');
        })

        updateInfo('all', 0);

    }

    // 初始化地图
    function initMap() {
        let buildId = 1;
        for (let j = 0; j < 4; j++) {
            $('#roadLi' + (j + 1)).empty();
            for (let i = 0; i < liMax; i++) {
                let site = idToSite(buildId);
                $('#roadLi' + (j + 1)).append(`<div id="` + buildId + `" class="building">` + player.map[site.li][site.lic].name + `</div>`);
                if (buildId == player.curBuildingSeq) {
                    $('#' + player.curBuildingSeq).addClass(inBuilding);
                }
                buildId++;
            }
        }

        // 检查该等级已解锁的建筑
        checkUnlockBuilding(player.cityLevel);

        $(".building").on('click', function () {
            let id = $(this).attr("id");
            clickBuilding(id);
        })
    }

    // 初始化其他城市
    function loadOtherCity(cityData) {
        let buildId = 1;
        for (let j = 0; j < 4; j++) {
            $('#roadLi' + (j + 1)).empty();
            for (let i = 0; i < liMax; i++) {
                let site = idToSite(buildId);
                let thisBuild = cityData.map[site.li][site.lic];
                $('#roadLi' + (j + 1)).append(`<div id="` + buildId + `" class="building">` + thisBuild.name + `</div>`);
                buildId++;
            }
        }
        console.log(cityData.map);
        checkUnlockBuilding(cityData.cityLevel);
    }

    // 初始化玩家刚到其他城市信息
    function initPlayerInOtherCity() {
        $("#15").addClass(inBuilding);
        player.curBuildingSeq = 15;
    }

    // 控制菜单弹窗
    function openAndClosMsg(open, msg = '') {
        $(".control_msg_content").html(msg);
        if (open) {
            $("#control_msg").addClass('control_btn_choosed');
            $(".control_board").css('width', '100%');
            $(".control_msg_board").css('width', '50%');
        } else {
            $("#buildingDetail").hide();
        }
    }

    // 掷骰子
    function rollTheDice() {
        if (player.diceCount <= 0 && inSelfCity) {
            openAndClosMsg(true, '<p>骰子点数不足！</p>')
            return;
        }

        // 测试模式使用
        let point = dicePoint;
        if (dicePoint == 0) {
            point = 1 + Math.floor(Math.random() * 6);
        }

        // 骰子图片展示
        let imgName = dicePoint != 0 ? 7 : point;
        $('#touzi').empty();
        $('#touzi').append(`<img src="/public/img/monopoly/t` + imgName + `.png">`)

        // 移动及收益
        $('#roll').unbind("click");
        moveBlock(point);

        // 扣次数
        if (inSelfCity) {
            player.diceCount--;
            updateInfo('dice', player.diceCount);
        }
    }

    // 移动
    function moveBlock(moveSteps) {
        let lastSteps = moveSteps;
        let sumAddCoin = 0;
        let sumAddDiamond = 0;

        let goSteps = setInterval(() => {
            let li = Math.floor((player.curBuildingSeq + 1) / liMax);
            let lic = (player.curBuildingSeq + 1) % liMax;

            $('#' + (player.curBuildingSeq + 1)).addClass(inBuilding);

            if (lic == 0) {
                li--;
                lic = liMax - 1;
            } else {
                lic--;
            }

            if (li > 3) {
                li = 0;
            }

            let curBuilding = inSelfCity ? player.map[li][lic] : otherCityData.map[li][lic];

            if (curBuilding.type == BTYPE.coin) {
                player.coin += curBuilding.earn;
                sumAddCoin += curBuilding.earn;
                updateInfo('coin', player.coin);
                showInfo('coin', sumAddCoin);
            } else if (curBuilding.type == BTYPE.diamond) {
                player.diamond += curBuilding.earn;
                sumAddDiamond += curBuilding.earn;
                updateInfo('diamond', player.diamond);
                showInfo('diamond', sumAddDiamond);
            }

            // 清除前面的效果
            let lastId = player.curBuildingSeq;
            if (lastId == 0) {
                lastId = 20;
            }
            $('#' + (lastId)).removeClass(inBuilding);

            // 在别人城市判断经过车站回来
            if (player.curBuildingSeq == 15 && !inSelfCity) {
                triggerEvent(curBuilding.event);
            }

            player.curBuildingSeq++;
            if (player.curBuildingSeq > (4 * liMax - 1)) {
                player.curBuildingSeq = 0;
            }

            // 最后一步、触发最后一个建筑的事件
            if (lastSteps == 1 && curBuilding.event != '') {
                triggerEvent(curBuilding.event);
            }

            lastSteps--;

            if (lastSteps <= 0) {
                $('#roll').click(rollTheDice);
                if (sumAddCoin > 0) {
                    showInfo('coin', sumAddCoin, true);
                }
                if (sumAddDiamond > 0) {
                    showInfo('diamond', sumAddDiamond, true);
                }
                clearInterval(goSteps);
                saveData(player);
            }
        }, 300);
    }

    // 触发事件
    function triggerEvent(eId) {
        for (let event of EVENTS) {
            if (eId == event.eId) {
                switch (event.effect) {
                    case "addCoin":
                        player.coin += event.count;
                        updateInfo('coin', player.coin);
                        showInfo('coin', event.count, true);
                        break;
                    case "addDiamond":
                        player.diamond += event.count;
                        updateInfo('diamond', player.diamond);
                        showInfo('diamond', event.count, true);
                        break;
                    case "addDice":
                        player.diceCount += event.count;
                        updateInfo('dice', player.diceCount);
                        break;
                    case "goOtherCity":
                        if (inSelfCity) {
                            showCanGoCityList();
                        } else {
                            backToSelfCity();
                        }
                        break;
                }
                openAndClosMsg(true, "<p>" + event.desi + "</p>");
            }
        }
        saveData(player);
    }

    // 更新数值信息
    function updateInfo(infoType, number) {
        switch (infoType) {
            case "coin":
                if (inSelfCity) {
                    checkUpBuild();
                }
                $("#coin").text("金币:" + number);
                break;
            case "people":
                if (inSelfCity) {
                    checkUpCity();
                }
                $("#peopleNum").text("人口:" + number);
                break;
            case "diamond":
                $("#diamond").text("钻石:" + number);
                break;
            case "dice":
                $("#diceCount").text('次数:' + number);
                break;
            case "diceRe":
                $("#diceCountRe").text('距离下次恢复剩余时间:' + number + 's');
                break;
            case "all":
                $("#coin").text("金币:" + player.coin);
                $("#peopleNum").text("人口:" + player.sumPeople);
                $("#diamond").text("钻石:" + player.diamond);
                $("#diceCount").text('次数:' + player.diceCount);
                break;
        }
    }

    // 更新数值加减展示信息
    function showInfo(infoType, number, hidden = false) {
        let icon = number >= 0 ? '+' : '';
        let id = '';
        switch (infoType) {
            case "coin":
                id = 'addCoin';
                break;
            case "people":
                id = 'addPeople';
                hidden = true;
                break;
            case "diamond":
                id = 'addDiamond';
                break;
        }

        $("#" + id).fadeIn('slow');
        $("#" + id).text(icon + number);
        if (hidden) {
            setTimeout(() => {
                $("#" + id).fadeOut('slow');
            }, 500);
        }
    }

    // id转下标
    function idToSite(id) {
        let li = Math.floor(parseInt(id) / liMax);
        let lic = parseInt(id) % liMax;

        if (lic == 0) {
            li--;
            lic = liMax - 1;
        } else {
            lic--;
        }

        return { li: li, lic: lic };
    }

    // 点击建筑
    function clickBuilding(id) {
        $("#tip").text("");
        $("#buildingDetail").show();

        let site = idToSite(id);

        let building = player.map[site.li][site.lic];
        showBuildInfo(building);

        curShowBuildSite = site;
    }

    // 展示建筑信息
    function showBuildInfo(building) {
        let earnType = building.type == BTYPE.coin ? '金币' : '钻石';
        let buildStr = `
        <p>等级:`+ building.level + `</p>
        <p>收益:`+ building.earn + earnType + `</p>
        <p>人口:`+ building.people + `</p>
        <p>升级花费:`+ building.eachLevel + `金币</p>
    `
        $("#buildingInfo").html(buildStr);
    }

    // 升级建筑
    function upBuildingLevel() {
        let curBuilding = player.map[curShowBuildSite.li][curShowBuildSite.lic];
        if (curShowBuildSite != null && player.coin >= curBuilding.eachLevel) {
            player.coin -= curBuilding.eachLevel;
            updateInfo('coin', player.coin);
            showInfo('coin', 0 - curBuilding.eachLevel, true);

            curBuilding.level += 1;
            curBuilding.earn += curBuilding.eachEarn;
            curBuilding.eachEarn = curBuilding.eachEarn * 2;
            curBuilding.eachLevel = curBuilding.eachLevel * curBuilding.level;
            player.sumPeople += curBuilding.eachPeople;
            updateInfo('people', player.sumPeople);
            showInfo('people', curBuilding.eachPeople);
            curBuilding.people += curBuilding.eachPeople;
            curBuilding.people = curBuilding.eachPeople * 2;

            player.map[curShowBuildSite.li][curShowBuildSite.lic] = curBuilding;
            saveData(player);
            showBuildInfo(curBuilding);
            $("#tip").text("升级成功！");
        } else {
            $("#tip").text("金币不足！");
        }
    }

    // 检查建筑是否可以升级
    function checkUpBuild() {
        let buildId = 1;
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < liMax; i++) {
                let curBuild = player.map[j][i];
                if (player.coin >= curBuild.eachLevel) {
                    $("#" + buildId).text('升级');
                    $("#" + buildId).addClass('upBuilding');
                } else {
                    $("#" + buildId).text(curBuild.name);
                    $("#" + buildId).removeClass('upBuilding');
                }
                buildId++;
            }
        }
    }

    // 检查城市等级是否可以升级
    function checkUpCity() {
        let level = inSelfCity ? player.cityLevel : otherCityData.cityLevel;
        let sumPeople = inSelfCity ? player.sumPeople : otherCityData.sumPeople;
        for (let i = 0; i < CITY_LEVEL.length; i++) {
            if (level < CITY_LEVEL[i].cityLevel && sumPeople >= CITY_LEVEL[i].pLimit) {
                $("#cityLevel").text(CITY_LEVEL[i].cityLable);
                let unlockBuilds = checkUnlockBuilding(level);
                if (inSelfCity) {
                    player.cityLevel++;
                    openAndClosMsg(true, '<p>您的城市已经升级至' + CITY_LEVEL[i].cityLable + '!</p><p>解锁建筑：' + unlockBuilds + '</p>');
                }
            }
        }
    }

    // 检查解锁的建筑
    function checkUnlockBuilding(curCityLevel) {
        let unlockBuildStr = '';
        for (let i = 0; i < SPE_BUILD.length; i++) {
            let curSpeBuild = SPE_BUILD[i];
            if (curCityLevel >= curSpeBuild.cityLevel) {
                for (let unlockBuilding of curSpeBuild.unlockBuild) {
                    let site = idToSite(unlockBuilding.buildingId);
                    $("#" + unlockBuilding.buildingId).addClass(unlockBuilding.buildClass);
                    $("#" + unlockBuilding.buildingId).text(unlockBuilding.buildingName);

                    let curBuilding = player.map[site.li][site.lic];
                    if (!inSelfCity) {
                        curBuilding = otherCityData.map[site.li][site.lic];
                    }

                    if (curBuilding.name != unlockBuilding.buildingName) {
                        curBuilding.type = unlockBuilding.type;
                        curBuilding.earn = unlockBuilding.earn;
                        curBuilding.event = unlockBuilding.event;
                        curBuilding.level = 1;
                        curBuilding.eachLevel = unlockBuilding.eachLevel;
                        curBuilding.eachEarn = unlockBuilding.eachEarn;
                        curBuilding.name = unlockBuilding.buildingName;
                    }

                    if (inSelfCity) {
                        player.map[site.li][site.lic] = curBuilding;
                    }

                    unlockBuildStr += unlockBuilding.buildingName + ',';
                }
            }
        }
        if (inSelfCity) { saveData(player); }

        return unlockBuildStr.slice(0, unlockBuildStr.length - 1);
    }

    // 展示可去城市弹窗
    function showCanGoCityList() {
        $("#cityList").show();
        $(".control_board").css('width', '100%');

        $(".otherCity").click(function () {

            let cityName = $(this).text();
            let cityData = null;
            inSelfCity = false;
            switch (cityName) {
                case "主角的城市":
                    cityData = JSON.parse(otherCity1);
                    break;
            }

            otherCityData = cityData;
            loadOtherCity(cityData);

            goToOtherCity(cityName);
        })
    }

    // 加载完数据点击城市后执行的样式变化
    function goToOtherCity(cityName) {
        $("#cityList").hide();
        $("#map").css({
            borderColor: '#A0522D',
            backgroundColor: '#D2B48C'
        });
        $("#cityName").show();
        $("#cityName").text(cityName);

        $("#diceCount").hide();
        $("#diceCountRe").hide();
        initPlayerInOtherCity();
    }

    // 返回自己的城市
    function backToSelfCity() {
        otherCityData = null;
        inSelfCity = true;

        $("#map").css({
            borderColor: 'white',
            backgroundColor: '#696969'
        });
        $("#cityName").hide();
        $("#diceCount").show();
        $("#diceCountRe").show();

        initMap();
    }

    function updateWorld() {
        updateDice();
    }

    initData();
    initGame();
})