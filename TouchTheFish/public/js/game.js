$(function () {
    const FPS = 10;

    setInterval(() => {
        update();
    }, 1000 / FPS >> 0)

    // 左右转
    // 原地转
    // 咬

    // 当前鱼的图
    const noImg = -1;
    let curImgSeq = noImg;

    function update() {
        state1()
    }

    function main() {
        $("#fish").css({
            backgroundImage: "url('../public/img/1.png')"
        })
    }

    function setFish(imgSeq, second, left) {
        $("#fish").css({
            transition: "all " + second + "s",
            left: left + "%",
            backgroundImage: "url('../public/img/" + imgSeq + ".png')",
        })
    }

    function state1() {
        const startImgSeq = 1;
        const endImgSeq = 15;

        let time = 0.1;

        if (curImgSeq == endImgSeq) {
            curImgSeq = startImgSeq;
            time = 0;
        } else if (curImgSeq == noImg) {
            curImgSeq = startImgSeq;
        }

        let left = getLeftByImgSeq(curImgSeq);

        setFish(curImgSeq, time, left);

        curImgSeq++;
    }

    function getLeftByImgSeq(imgSeq) {
        let left = 0;
        switch (imgSeq) {
            case 1:
                left = -5
                break;
            case 2:
                left = 0
                break;
            case 3:
                left = 10
                break;
            case 4:
                left = 20
                break;
            case 5:
                left = 50
                break;
            case 6:
                left = 70
                break;
            case 7:
                left = 80
                break;
            case 8:
                left = 70
                break;
            case 9:
                left = 50
                break;
            case 10:
                left = 55
                break;
            case 11:
                left = 60
                break;
            case 12:
                left = 70
                break;
            case 13:
                left = 80
                break;
            case 14:
                left = 90
                break;
            case 15:
                left = 100
                break;
            case 16:
                left = 70
                break;
            case 17:
                left = 5
                break;
        }
        return left;
    }

    main()
})