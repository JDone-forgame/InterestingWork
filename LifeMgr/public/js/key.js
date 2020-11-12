$(function () {

    keyInit();

    // 初始化
    function keyInit() {
        //为保存按钮绑定事件
        $('#saveKey').click(function(){
            $('#newkey').submit();
        });

    }

})