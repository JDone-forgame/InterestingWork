$(function () {
    // 开始游戏时间
    let startGameTime = Date.now();

    // 主循环本体
    let mainInterval = setInterval(() => {
        mainCycle();
    }, 100)

    // 事件绑定
    function bindEventsToBtn() {
        // 退出游戏
        $("#exitButton").click(() => {
            $("div").css('border-color', '#800000');
            setTimeout(closeWindow, 1000);
        });

        // 开始游戏->展示主页面
        $("#startButton").click(() => {
            // 过于生硬
            // $("#gameTitle").fadeTo(500, 0, () => {
            //     $("#gameTitle").hide();
            // })

            $("#gameTitle").css({
                opacity: 0,
            });
            setTimeout(() => {
                $("#gameTitle").hide();
            }, 600)
        });
    }

    // 主循环方法
    function mainCycle() {
        startAnimControl();


    }

    // 开始游戏动画控制
    function startAnimControl() {
        // 已经游玩的时间
        let playTime = (Date.now() - startGameTime) / 1000;

    }

    // 关闭窗口
    function closeWindow() {
        let userAgent = navigator.userAgent;
        if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
            location.href = "about:blank";
        } else {
            window.opener = null;
            window.open('', '_self');
        }
        window.close();
    }

    


    bindEventsToBtn();
})