$(function () {
    // 玩家的地图
    let playerMap = [];
    // 在建筑时的css类
    const inBuilding = 'inThisBuilding';
    // 建筑的css类
    const BUILDCLASS = {
        build_vault: 'build_vault',
        build_ktv: 'build_ktv',
        build_foodStreet: 'build_foodStreet',
        build_skyscraper: 'build_skyscraper',
        build_shower: 'build_shower',
    };
    // 金币
    let coin = 150;
    // 钻石
    let diamond = 0;
    // 每列最大值
    let liMax = 5;
    // 当前展示的建筑ID
    let curBuildingSeq = 0;
    // 当前展示的建筑
    let curShowBuildSeq = [];
    // 骰子个数
    let diceCount = 99;
    // 总人口
    let sumPeople = 20;
    // 城市等级
    let cityLevel = 1;
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
            desi: '在摩天大楼俯瞰你的城市！钻石+5',
            effect: 'addDiamond',
            count: 5,
        },
        {
            eId: 'e004',
            desi: '在洗浴中心好好按了个摩！体力+5',
            effect: 'addDice',
            count: 5,
        },
    ]

    //---------------------------------------------------------------//

    // 初始化游戏
    function initGame() {
        let step = 1;
        for (let j = 0; j < 4; j++) {
            let buildingLi = [];
            for (let i = 0; i < liMax; i++) {
                let defBuilding = {
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

                if (step == 1) {
                    curBuildingSeq = 1;
                    $('#roadLi' + (j + 1)).append(`<div id="` + step + `" class="building ` + inBuilding + `">` + defBuilding.name + `</div>`)
                } else {
                    $('#roadLi' + (j + 1)).append(`<div id="` + step + `" class="building">` + defBuilding.name + `</div>`)
                }

                buildingLi.push(defBuilding);
                step++;
            }
            playerMap.push(buildingLi);
        }
        console.log(playerMap);

        $('#roll').click(rollTheDice);
        $("#closeDetail").click(() => {
            curShowBuildSeq = [];
            openAndClosMsg(false, '')
        });
        $(".building").on('click', function () {
            let id = $(this).attr("id");
            clickBuilding(id);
        })
        $("#upBuildingLevel").click(upBuildingLevel)

        $(".control_msg_content").html('<p></p>');
    }

    // 弹窗
    function openAndClosMsg(open, msg = '') {
        $(".control_msg_content").html(msg);
        if (open) {
            $("#control_msg").addClass('control_btn_choosed');
            $(".control_msg_board").css('width', '50%');
        } else {
            $("#buildingDetail").hide();
        }
    }

    // 掷骰子
    function rollTheDice() {
        if (diceCount <= 0) {
            openAndClosMsg(true, '<p>骰子点数不足！</p>')
            return;
        }

        let point = 1 + Math.floor(Math.random() * 6);
        $('#touzi').empty();
        $('#touzi').append(`<img src="/public/img/monopoly/t` + point + `.png">`)

        $('#roll').unbind("click");
        moveBlock(point);

        diceCount--;
        updateInfo('dice',diceCount);
    }

    // 移动
    function moveBlock(moveSteps) {
        let lastSteps = moveSteps;
        let sumAddCoin = 0;
        let sumAddDiamond = 0;


        let goSteps = setInterval(() => {
            let li = Math.floor((curBuildingSeq + 1) / liMax);
            let lic = (curBuildingSeq + 1) % liMax;

            $('#' + (curBuildingSeq + 1)).addClass(inBuilding);

            if (lic == 0) {
                li--;
                lic = liMax - 1;
            } else {
                lic--;
            }

            if (li > 3) {
                li = 0;
            }

            console.log('li:' + li + ',lic:' + lic)
            console.log(curBuildingSeq)

            let curBuilding = playerMap[li][lic];

            if (curBuilding.type == BTYPE.coin) {
                coin += curBuilding.earn;
                sumAddCoin += curBuilding.earn;
                updateInfo('coin', coin);
                showInfo('coin', sumAddCoin);
            } else if (curBuilding.type == BTYPE.diamond) {
                diamond += curBuilding.earn;
                sumAddDiamond += curBuilding.earn;
                updateInfo('diamond', diamond);
                showInfo('diamond', sumAddDiamond);
            }



            // 清除前面的效果
            let lastId = curBuildingSeq;
            if (lastId == 0) {
                lastId = 20;
            }
            $('#' + (lastId)).removeClass(inBuilding);

            curBuildingSeq++;
            if (curBuildingSeq > (4 * liMax - 1)) {
                curBuildingSeq = 0;
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
            }
        }, 300);
    }

    // 触发事件
    function triggerEvent(eId) {
        for (let event of EVENTS) {
            if (eId == event.eId) {
                switch (event.effect) {
                    case "addCoin":
                        coin += event.count;
                        updateInfo('coin', coin);
                        showInfo('coin', event.count, true);
                        break;
                    case "addDiamond":
                        diamond += event.count;
                        updateInfo('diamond', diamond);
                        showInfo('diamond', event.count, true);
                        break;
                    case "addDice":
                        diceCount += event.count;
                        updateInfo('dice', diceCount);
                        break;
                }
                openAndClosMsg(true, "<p>" + event.desi + "</p>");
            }
        }
    }

    // 更新数值信息
    function updateInfo(infoType, number) {
        switch (infoType) {
            case "coin":
                checkUpBuild();
                $("#coin").text("金币:" + number);
                break;
            case "people":
                checkUpCity();
                $("#peopleNum").text("人口:" + number);
                break;
            case "diamond":
                $("#diamond").text("钻石:" + number);
                break;
            case "dice":
                $("#diceCount").text('次数:' + number);
                break;
        }

        console.log(infoType, number)
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

        let building = playerMap[site.li][site.lic];
        showBuildInfo(building);

        curShowBuildSeq = [site.li, site.lic];
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
        let curBuilding = playerMap[curShowBuildSeq[0]][curShowBuildSeq[1]];
        if (curShowBuildSeq.length > 0 && coin >= curBuilding.eachLevel) {
            coin -= curBuilding.eachLevel;
            updateInfo('coin', coin);
            showInfo('coin', 0 - curBuilding.eachLevel, true);

            curBuilding.level += 1;
            curBuilding.earn += curBuilding.eachEarn;
            curBuilding.eachEarn = curBuilding.eachEarn * 2;
            curBuilding.eachLevel = curBuilding.eachLevel * curBuilding.level;
            sumPeople += curBuilding.eachPeople;
            updateInfo('people', sumPeople);
            showInfo('people', curBuilding.eachPeople);
            curBuilding.people += curBuilding.eachPeople;
            curBuilding.people = curBuilding.eachPeople * 2;

            playerMap[curShowBuildSeq[0]][curShowBuildSeq[1]] = curBuilding;
            showBuildInfo(curBuilding);
            $("#tip").text("升级成功！");
        } else {
            $("#tip").text("金币不足！");
        }
    }

    // 检查建筑是否可以升级
    function checkUpBuild() {
        let step = 1;
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < liMax; i++) {
                let curBuild = playerMap[j][i];
                if (coin >= curBuild.eachLevel) {
                    $("#" + step).text('升级');
                    $("#" + step).addClass('upBuilding');
                } else {
                    $("#" + step).text(curBuild.name);
                    $("#" + step).removeClass('upBuilding');
                }
                step++;
            }
        }
    }

    // 检查城市等级是否可以升级
    function checkUpCity() {
        for (let i = 0; i < CITY_LEVEL.length; i++) {
            if (cityLevel < CITY_LEVEL[i].cityLevel && sumPeople >= CITY_LEVEL[i].pLimit) {
                $("#cityLevel").text(CITY_LEVEL[i].cityLable);
                cityLevel++;
                let unlockBuilds = checkUnlockBuilding();
                openAndClosMsg(true, '<p>您的城市已经升级至' + CITY_LEVEL[i].cityLable + '!</p><p>解锁建筑：' + unlockBuilds + '</p>');
            }
        }
    }

    // 检查解锁的建筑
    function checkUnlockBuilding() {
        let unlockBuildStr = '';
        for (let i = 0; i < SPE_BUILD.length; i++) {
            let curSpeBuild = SPE_BUILD[i];
            if (cityLevel >= curSpeBuild.cityLevel) {
                for (let unlockBuilding of curSpeBuild.unlockBuild) {
                    let site = idToSite(unlockBuilding.buildingId);
                    $("#" + unlockBuilding.buildingId).addClass(unlockBuilding.buildClass);
                    $("#" + unlockBuilding.buildingId).text(unlockBuilding.buildingName);

                    let curBuilding = playerMap[site.li][site.lic];
                    curBuilding.type = unlockBuilding.type;
                    curBuilding.earn = unlockBuilding.earn;
                    curBuilding.event = unlockBuilding.event;
                    curBuilding.level = 1;
                    curBuilding.eachLevel = unlockBuilding.eachLevel;
                    curBuilding.eachEarn = unlockBuilding.eachEarn;
                    curBuilding.name = unlockBuilding.buildingName;

                    playerMap[site.li][site.lic] = curBuilding;

                    unlockBuildStr += unlockBuilding.buildingName + ',';
                }
            }
        }

        return unlockBuildStr.slice(0, unlockBuildStr.length - 1);
    }

    initGame();
})