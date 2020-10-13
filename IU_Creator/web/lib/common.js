
//弹窗点击
function windowPageControl(board, content, state, style) {
    // 获取背景板和文本区域
    var board = document.getElementById('board');
    var content = document.getElementById('content');
    if (style == 1) {
        _controlStyle1(board, content, state)
    }
}

// 第一种弹窗风格
function _controlStyle1(board, content, state) {
    if (state == 1) {
        setTimeout(function () {
            content.style.display = "block";
        }, 400);
        board.style.width = "90rem";
        board.style.left = "20%";
    } else if (state == 0) {
        content.style.display = "none";
        board.style.width = "0rem";
        board.style.left = "50%";
    } else {
        window.alert('未知的操作状态')
    }

}