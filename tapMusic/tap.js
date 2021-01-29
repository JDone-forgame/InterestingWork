let musicTap = [
    {
        "seq": 1,
        "time": 623
    },
    {
        "seq": 2,
        "time": 920
    },
    {
        "seq": 3,
        "time": 1278
    },
    {
        "seq": 4,
        "time": 1679
    },
    {
        "seq": 5,
        "time": 2149
    },
    {
        "seq": 6,
        "time": 2628
    },
    {
        "seq": 7,
        "time": 3085
    },
    {
        "seq": 8,
        "time": 3574
    },
    {
        "seq": 9,
        "time": 4093
    },
    {
        "seq": 10,
        "time": 4639
    },
    {
        "seq": 11,
        "time": 5154
    },
    {
        "seq": 12,
        "time": 5676
    },
    {
        "seq": 13,
        "time": 6149
    },
    {
        "seq": 14,
        "time": 6619
    },
    {
        "seq": 15,
        "time": 7117
    },
    {
        "seq": 16,
        "time": 7646
    },
    {
        "seq": 17,
        "time": 8200
    },
    {
        "seq": 18,
        "time": 8700
    },
    {
        "seq": 19,
        "time": 9150
    },
    {
        "seq": 20,
        "time": 9629
    },
    {
        "seq": 21,
        "time": 10121
    },
    {
        "seq": 22,
        "time": 10592
    },
    {
        "seq": 23,
        "time": 11079
    },
    {
        "seq": 24,
        "time": 11528
    },
    {
        "seq": 25,
        "time": 12062
    },
    {
        "seq": 26,
        "time": 12562
    },
    {
        "seq": 27,
        "time": 13013
    },
    {
        "seq": 28,
        "time": 13442
    },
    {
        "seq": 29,
        "time": 13941
    },
    {
        "seq": 30,
        "time": 14349
    },
    {
        "seq": 31,
        "time": 14807
    },
    {
        "seq": 32,
        "time": 15215
    },
    {
        "seq": 33,
        "time": 15644
    },
    {
        "seq": 34,
        "time": 16150
    },
    {
        "seq": 35,
        "time": 16644
    },
    {
        "seq": 36,
        "time": 17167
    },
    {
        "seq": 37,
        "time": 17659
    },
    {
        "seq": 38,
        "time": 18171
    }
]
let musicTapMap = new Map();

function initMusicTap() {
    for (let curTap of musicTap) {
        musicTapMap.set('tap' + curTap.seq, curTap.time)
    }
}

initMusicTap();

let tapColors = [
    "#FFA500", "#FFFF00", "#FFD700", "#DC143C", "#FF1493", "#9400D3", "#800080", "#8A2BE2", "#0000FF", "#4169E1", "#1E90FF", "#87CEFA", "#00BFFF", "#F0FFFF", "#E1FFFF", "#00FFFF", "#008B8B", "#FF0000", "#800000", "#20B2AA", "#40E0D0", "#7FFFAA", "#00FF7F", "#2E8B57", "#90EE90", "#228B22", "#FFFAFA", "#7FFF00", "#FF4500", "#FF7F50", "#FF6347", "#F08080", "#FF4500", "#FFF8DC"
]
