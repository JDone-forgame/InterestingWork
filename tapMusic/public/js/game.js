$(function () {
    // 开始游戏时间
    let startGameTime = Date.now();

    // 主循环本体
    let mainInterval = setInterval(() => {
        mainCycle();
    }, 100)

    // 由链接在一起的音频模块构建的音频处理图
    var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
    //实例化
    var audioContext = new AudioContext();

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

            // $("#bgMusic").attr('src',"./public/music/LoseControl.mp3");

            // $.get("./public/music/LoseControl.mp3", (data, status) => {
            //     musicArrayBuffer = data;
            //     parsingAudio()
            // });

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

    // 当歌曲被选择的时候
    $('#musicFile').change(function () {
        //当选择歌曲时，判断当前audioContext的状态，如果在进行中则关闭音频环境，
        //释放audioContext的所有资源，并重新实例化audioContext
        if (audioContext.state == 'running') {
            audioContext.close();
            audioContext = new AudioContext();
        }
        if (this.files.length == 0) return;
        parsingAudio();
    })

    // 解析音频
    function parsingAudio() {
        // 窗口的文档显示区的宽和高
        var canvasCtx = songCanvas.getContext("2d");

        // 拿到文件
        var file = $('#musicFile')[0].files[0];
        var fileReader = new FileReader();

        fileReader.readAsArrayBuffer(file);

        fileReader.onload = function (e) {
            let startDecodeTime = Date.now();
            $('#tip').text("文件已加载，解码中......")
            // 异步解码音频文件中的 ArrayBuffer
            audioContext.decodeAudioData(e.target.result, function (buffer) {

                $('#tip').text('解码成功，用时共计:' + (Date.now() - startDecodeTime) / 1000 + '秒')
                $('#cycleCD').css({
                    animation: "rotating 8s linear 0s infinite normal",
                    background: "url('./public/img/cover/LoseControl.jpg')",
                })

                var audioBufferSourceNode = audioContext.createBufferSource();
                var analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                audioBufferSourceNode.connect(analyser);
                analyser.connect(audioContext.destination);
                audioBufferSourceNode.buffer = buffer;
                audioBufferSourceNode.start();
                var bufferLength = analyser.frequencyBinCount;
                var dataArray = new Uint8Array(bufferLength);

                //播放暂停音频
                $("#playOrPause").show();
                $("#playOrPause").click(() => {
                    if (audioContext.state === 'running') {
                        // let transform = $("#cycleCD").css('transform');
                        $('#cycleCD').css({
                            "animation-play-state": "paused",
                        })
                        audioContext.suspend().then(function () {
                            $("#playOrPause").text('播放');
                        });
                    } else if (audioContext.state === 'suspended') {
                        $('#cycleCD').css({
                            "animation-play-state": "running",
                        })
                        audioContext.resume().then(function () {
                            $("#playOrPause").text('暂停');
                        });
                    }
                })

                var oW = songCanvas.width;
                var oH = songCanvas.height;
                // 定义从黑到白的渐变（从左向右），作为矩形的填充样式：渐变开始点的 x 坐标 , 渐变开始点的 y 坐标 , 渐变结束点的 x 坐标 , 渐变结束点的 y 坐标
                var color1 = canvasCtx.createLinearGradient(oW, oH - 10, oW, oH - 150);
                color1.addColorStop(0, '#1E90FF');
                color1.addColorStop(.25, '#FF7F50');
                color1.addColorStop(.5, '#8A2BE2');
                color1.addColorStop(.75, '#4169E1');
                color1.addColorStop(1, '#00FFFF');
                function draw() {
                    drawVisual = requestAnimationFrame(draw);
                    var barHeight;
                    // 自定义获取数组里边数据的频步
                    canvasCtx.clearRect(0, 0, oW, oH);
                    for (var i = 0; i < bufferLength; i++) {
                        barHeight = dataArray[i];
                        analyser.getByteFrequencyData(dataArray);
                        // 绘制向上的线条
                        canvasCtx.fillStyle = color1;
                        /* context.fillRect(x,y,width,height)
                         * x，y是坐标
                         * width，height线条的宽高
                         */
                        canvasCtx.fillRect(oW + (i * 8), oH, 4, -barHeight / 2);
                        canvasCtx.fillRect(oW - (i * 8), oH, 4, -barHeight / 2);
                    }
                };
                draw();
            })
        }
    }

    bindEventsToBtn();

})