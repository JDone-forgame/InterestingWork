let clickRecord = [];
let startTime = 0;

$(function () {
    // 主循环
    setInterval(() => {
        checkTap();
        changeColor();
    }, 10)

    // 清理 session
    sessionStorage.clear();

    // 默认颜色、点击颜色
    let defaultColor = "#228B22";
    let tapColor = "#FFA500";

    // 按键按下
    $(document).keydown(function (event) {
        // console.log("Key: " + event.keyCode);
        recordClick();
        changeDiv(tapColor, 20, 26, 85, 0.75);
    });

    // 按键弹起
    $(document).keyup(function (event) {
        changeDiv(defaultColor, 1000, 25, 80, 0.25);
    });

    // 保存点击记录
    $('#saveTap').click(() => {
        sessionStorage.setItem('musicTap', JSON.stringify(clickRecord));
        $('#saveTap').text('success!')
    })

    // 点击记录
    function recordClick() {
        let record = {
            seq: clickRecord.length + 1,
            time: Date.now() - startTime
        }
        clickRecord.push(record);
        console.log('record!' + record.seq + ':' + record.time)
        divText('<p>' + record.seq + '</p>')
    }

    // 改变点击块
    function changeDiv(color, time, h, w, o) {
        $('#tap').css({
            "transition": "all " + time + "ms",
            "height": h + "%",
            "width": w + "%",
            "background-color": color,
            "opacity": o,
        })
    }

    // 改变点击块文本
    function divText(text) {
        $('#tap').html(text)
    }

    // 初始化时间
    function timeInit() {
        if (startTime == 0) {
            startTime = Date.now();
            console.log('start!')
        }
    }

    // 计算分数
    function addScore() {

    }

    // 检查点击点
    let curTap = 0;
    function checkTap() {
        let nowTime = Date.now() - startTime;
        let aboutTime = 9;

        for (let i = curTap; i < musicTap.length; i++) {
            let tap = musicTap[i];
            if (nowTime > tap.time - aboutTime && nowTime < tap.time + aboutTime) {
                curTap = i;
                changeDiv(tapColor, 20, 26, 85, 0.75);
                setTimeout(() => {
                    changeDiv(defaultColor, 1000, 25, 80, 0.25);
                }, 200)
                break;
            }
        }
    }

    // 改变颜色
    function changeColor() {
        let r = Math.floor(Math.random() * tapColors.length);
        tapColor = tapColors[r];
    }

    // 窗口的文档显示区的宽和高
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var canvasCtx = canvas.getContext("2d");

    // 由链接在一起的音频模块构建的音频处理图
    var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
    //实例化
    var audioContext = new AudioContext();

    $('#musicFile').change(function () {
        //当选择歌曲时，判断当前audioContext的状态，如果在进行中则关闭音频环境，
        //释放audioContext的所有资源，并重新实例化audioContext
        if (audioContext.state == 'running') {
            audioContext.close();
            audioContext = new AudioContext();
        }
        if (this.files.length == 0) return;
        var file = $('#musicFile')[0].files[0];
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = function (e) {
            var count = 0;
            $('#tip').text('开始解码')
            var timer = setInterval(function () {
                count++;
                $('#tip').text('解码中,已用时' + count + '秒')
            }, 1000)
            // 异步解码音频文件中的 ArrayBuffer
            audioContext.decodeAudioData(e.target.result, function (buffer) {
                clearInterval(timer)
                $('#tip').text('解码成功，用时共计:' + count + '秒')

                timeInit();

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
                startStop.onclick = function () {
                    if (audioContext.state === 'running') {
                        audioContext.suspend().then(function () {
                            $("#startStop").val('播放');
                        });
                    } else if (audioContext.state === 'suspended') {
                        audioContext.resume().then(function () {
                            $("#startStop").val('暂停');
                        });
                    }
                }

                var oW = canvas.width;
                var oH = canvas.height;
                // 定义从黑到白的渐变（从左向右），作为矩形的填充样式：渐变开始点的 x 坐标 , 渐变开始点的 y 坐标 , 渐变结束点的 x 坐标 , 渐变结束点的 y 坐标
                var color1 = canvasCtx.createLinearGradient(oW / 2, oH / 2 - 10, oW / 2, oH / 2 - 150);
                var color2 = canvasCtx.createLinearGradient(oW / 2, oH / 2 + 10, oW / 2, oH / 2 + 150);
                color1.addColorStop(0, tapColor);
                color1.addColorStop(1, defaultColor);
                // color1.addColorStop(0, '#1E90FF');
                // color1.addColorStop(.25, '#FF7F50');
                // color1.addColorStop(.5, '#8A2BE2');
                // color1.addColorStop(.75, '#4169E1');
                // color1.addColorStop(1, '#00FFFF');

                color2.addColorStop(0, '#1E90FF');
                color2.addColorStop(.25, '#FFD700');
                color2.addColorStop(.5, '#8A2BE2');
                color2.addColorStop(.75, '#4169E1');
                color2.addColorStop(1, '#FF0000');
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
                        canvasCtx.fillRect(oW / 2 + (i * 8), oH / 2, 6, -barHeight);
                        canvasCtx.fillRect(oW / 2 - (i * 8), oH / 2, 6, -barHeight);
                        // 绘制向下的线条
                        canvasCtx.fillStyle = color2;
                        canvasCtx.fillRect(oW / 2 + (i * 8), oH / 2, 2, barHeight);
                        canvasCtx.fillRect(oW / 2 - (i * 8), oH / 2, 2, barHeight);
                    }
                };
                draw();
            })
        }
    })
})
