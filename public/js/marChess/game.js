$(function () {
    const moveClass = 'chess_block_choose_move_area';
    const chooseClass = 'chess_block_choose';
    const cavalryClass = 'chess_block_cavalry';
    const marinesClass = 'chess_block_marines';
    const halberdierClass = 'chess_block_halberdier';

    // 当前方块可移动区域
    let canMoveArea = [];
    // 当前方块
    let curBlockId = '';

    // 初始化控制菜单
    function initControlMenu() {
        $(".control_msg_content").html('小时候自己设计了一种棋，蛮有意思，现在可以用代码实现当然最好了！');
    }

    // 初始化棋盘
    function initChessBlock() {
        let blocks = [];
        for (let j = 0; j < 12; j++) {
            let row = [];
            for (let i = 0; i < 12; i++) {
                let id = i + "a" + j;
                row.push(0);
                let block = `
                <div class="chess_block_board">
                    <div id="`+ id + `" class="chess_block"></div>
                </div>
                `
                $("#chessBoard").append(block)
            }
            blocks.push(row);
        }
    }

    // 初始化战局
    function initFightSite() {
        setUnitBySite('cavalry', '2a2')
        setUnitBySite('cavalry', '7a2')
        setUnitBySite('marines', '6a2')
        setUnitBySite('halberdier', '2a8')
    }

    // 通过位置放置战斗单位
    function setUnitBySite(unitType, site) {
        let unitClass = '';
        let nickName = '';
        switch (unitType) {
            case 'cavalry':
                unitClass = cavalryClass;
                nickName = '骑兵';
                break;
            case 'marines':
                unitClass = marinesClass;
                nickName = '枪兵';
                break;
            case 'halberdier':
                unitClass = halberdierClass;
                nickName = '戟兵';
                break;
        }
        $("#" + site).addClass(unitClass);
        $("#" + site).text(nickName);
    }

    // 选择战斗单位
    function chooseUnit(unitType, site) {
        $('.chess_block').removeClass(chooseClass);
        $("#" + site).addClass(chooseClass);

        canMoveArea = showMoveArea(unitType, site);
    }

    // 取消选择
    function unChooseUnit(unitType, curBlockId) {
        $('#' + curBlockId).text('');
        let removeClass = '';
        switch (unitType) {
            case 'cavalry':
                removeClass = cavalryClass;
                break;
            case 'marines':
                removeClass = marinesClass;
                break;
            case 'halberdier':
                removeClass = halberdierClass;
                break;
        }
        $('#' + curBlockId).removeClass(removeClass);

        $('.chess_block').removeClass(moveClass);
        $('.chess_block').removeClass(chooseClass);
    }

    // 判断是否在移动范围
    function inMoveArea(id) {
        let ret = false;

        if (canMoveArea != 0) {
            for (let cId of canMoveArea) {
                if (id == cId) {
                    ret = true;
                }
            }
        }

        // console.log('id:' + id + ',moveArea:' + canMoveArea);

        return ret;
    }

    // 展示某个位置的某兵种可移动范围
    function showMoveArea(unitType, site) {
        $('.chess_block').removeClass(moveClass);

        let x = parseInt(site.split('a')[0]);
        let y = parseInt(site.split('a')[1]);

        let sx = 0;
        let sy = 0;
        let ex = 0;
        let ey = 0;

        switch (unitType) {
            case 'cavalry':
                sx = x - 2 >= 0 ? x - 2 : 0;
                sy = y - 2 >= 0 ? y - 2 : 0;
                ex = x + 2 < 11 ? x + 2 : 11;
                ey = y + 2 < 11 ? y + 2 : 11;
                break;
            case 'marines':
            case 'halberdier':
                sx = x - 1 >= 0 ? x - 1 : 0;
                sy = y - 1 >= 0 ? y - 1 : 0;
                ex = x + 1 < 11 ? x + 1 : 11;
                ey = y + 1 < 11 ? y + 1 : 11;
                break;
        }

        // console.log("(" + sx + "," + sy + "),(" + ex + "," + ey + ")");

        // 可移动范围
        let canMoveArea = [];

        for (let j = sy; j <= ey; j++) {
            for (let i = sx; i <= ex; i++) {
                if (('' + i + j) == site || $("#" + i + "a" + j).text() != '') {
                    continue;
                }
                $("#" + i + "a" + j).addClass(moveClass);
                canMoveArea.push(i + "a" + j);
            }
        }

        return canMoveArea;
    }

    // 中文转英文
    function chToEn(ch) {
        let en = '';
        switch (ch) {
            case '骑兵':
                en = 'cavalry';
                break;
            case '枪兵':
                en = 'marines';
                break;
            case '戟兵':
                en = 'halberdier';
                break;
        }
        return en;
    }




    initControlMenu();
    initChessBlock();
    initFightSite();


    // 棋格按键事件绑定
    $('.chess_block').on('click', function () {
        let id = $(this).attr("id");
        let unitType = $(this).text();

        // 如果点击原方块，则取消选择
        if (curBlockId == id) {
            unChooseUnit();
            curBlockId = '';
            return;
        }

        // 如果点击了移动范围内的块
        if (curBlockId != '' && inMoveArea(id)) {
            let unitType = chToEn($('#' + curBlockId).text());
            unChooseUnit(unitType, curBlockId);
            setUnitBySite(unitType, id);
            curBlockId = '';
            console.log('in move area!');
            return;
        }

        console.log('this id:' + id + ",this unitType :" + unitType);

        if (id && unitType) {
            if (curBlockId == '') {
                curBlockId = id;
                chooseUnit(chToEn(unitType), id);
            }
        }
    });

})