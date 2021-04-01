$(function () {
    // 控制页面
    let controlHtml = `<div class="control_board closeMenu"><img src="/public/img/JDone.png" class="JDone"></div>
    <div class="control_msg_board">
        <div class="control_msg_bar">
            <div id="control_msg_close" class="control_msg_bar_btn">X</div>
        </div>
        <div class="control_msg_content">
            这是文本显示区！
        </div>
    </div>
    </div>
    <div class="control_area">
        <div class="control_title control_title_ani">控制菜单</div>

        <div class="control_back">
            <div class="control_btn closeMenu">
                关闭菜单
            </div>
        </div>

        <div class="control_back">
            <div id="control_exit" class="control_btn">
                返回首页
            </div>
        </div>

        <div class="control_back">
            <div id="control_msg" class="control_btn">
                消息面板
            </div>
        </div>  
        
        <div class="control_back">
            <div id="control_reload" class="control_btn">
                重新开始
            </div>
        </div> 

    </div>`

    // 判断是否需要直接显示该控件
    // <div id="controlShow" hidden>show</div>
    $("body").prepend(controlHtml);
    if ($("#controlShow").text() == 'show') {
        setTimeout(clickTitleAnim, 400);
        setTimeout(openMsgBoard, 800);
    }

    $(".control_title").click(clickTitleAnim);
    $("#control_msg").click(openMsgBoard);
    $("#control_msg_close").click(closeMsgBoard);
    $(".closeMenu").on('click', closeMenuAnim);
    $(".gDiv").hover(checkDiv);
    $("#control_reload").click(() => {
        location.reload();
    })

    // 退出至首页
    $("#control_exit").click(() => {
        location.href = '/';
    })

})

// 添加控制按键
let cBtnSeq = 1;
function addConBtn(btnName, func, isStateBtn = false) {
    let state = isStateBtn ? 'control_btn_choosed' : '';
    let add = `<div class="control_back"><div id="cBtn` + cBtnSeq + `" class="control_btn closeMenu ` + state + `">` + btnName + `</div></div>`;
    $(".control_area").append(add);
    $("#cBtn" + cBtnSeq).click(func);
    cBtnSeq++;
    $(".closeMenu").on('click', closeMenuAnim);
}

// 添加完毕后的重新绑定
function addOver() {
    $(".closeMenu").on('click', closeMenuAnim);
}


// 点击菜单的动画
function clickTitleAnim() {
    $(".control_area").css({
        boxShadow: '0 0 2rem 1rem white',
        height: '100%',
        borderBottomRightRadius: '0rem',
    });
    $(".control_board").css('width', '100%');
    $(".control_title").removeClass("control_title_ani");
}

// 点击关闭菜单的动画
function closeMenuAnim() {
    closeMsgBoard();
    $(".control_area").css({
        boxShadow: '0 0 0rem 0rem white',
        height: '4rem',
        borderBottomRightRadius: '4rem',
    });
    $(".control_board").css('width', '0%');
    $(".control_title").addClass("control_title_ani");
}

// 消息面板打开与关闭
function openMsgBoard() {
    $("#control_msg").addClass('control_btn_choosed');
    $(".control_msg_board").css('width', '50%');
}

function closeMsgBoard() {
    $(".control_msg_content").text('');
    $("#control_msg").removeClass('control_btn_choosed');
    $(".control_msg_board").css('width', '0%');
}

// 有状态的按键
function changeState(id, state, name = '') {
    if (name != '') {
        $('#' + id).text(name);
    }

    if (state == 'open') {
        $('#' + id).addClass('control_btn_choosed');
    } else if (state == 'close') {
        $('#' + id).removeClass('control_btn_choosed');
    }
}


// gDiv检查信息
function checkDiv() {
    console.log($(this).attr('id'));
    let divBgColor = '';

    $(this).mousedown(function (mouseDown) {
        divBgColor = $(this).css('background');

        let mLeft = mouseDown.clientX;
        let mRight = mouseDown.clientY;
        console.log(mLeft, mRight);

        let divInfo = `<div class="divInfo" style="left: ` + mLeft + `px;top: ` + mRight + `px;">
        <p>ID:`+ $(this).attr('id') + `</p>
        <p>宽:`+ $(this).css('width') + `</p>
        <p>高:`+ $(this).css('height') + `</p>
        <p>左:`+ $(this).css('left') + `</p>
        <p>上:`+ $(this).css('top') + `</p>
        </div>`;
        $(document.body).append(divInfo);
    });

    $(this).mouseup(function () {
        $(".divInfo").remove();
    })
}

