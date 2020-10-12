    //关卡（页面）地址
    var levelUrl;

    //左上角菜单点击
    function leftConClick(){
        var lC = document.getElementById("leftCon");
        var lM = document.getElementById("leftMenu");
        var mM = document.getElementById("menuMark");
        lC.style.left="-300px";
        setTimeout(function(){
            mM.style.width="1920px";
            lM.style.left="0px";
        },300);
    }

    //大菜单返回点击
    function backClick(){
        var lC = document.getElementById("leftCon");
        var lM = document.getElementById("leftMenu");
        var mM = document.getElementById("menuMark");
        lM.style.left="-500px";
        setTimeout(function(){
            mM.style.width="0px";
            lC.style.left="0px";
        },300);
    }

    //大菜单退出点击
    function exit(){
        var lM = document.getElementById("leftMenu");  
        lM.style.left="-500px";
        var nP = document.getElementById('nextPage');
        setTimeout(function(){
            nP.style.top="0px";
            nP.style.left="0px";
        },300)
        setTimeout(function(){
            //跳转
            window.location.href='start.html';
        },1050);
    }

    //大菜单首页点击
    function backCenter(){
        var iframe = document.getElementById("iframe");
        if(iframe.style.width==="0%"){
            backClick();
            openAndCloseMsg(1,"<p>已经在首页了！</p>");
            return;
        }
        // iframe.style.display="none";
        iframe.style.width="0%";
        iframe.src="";
        backClick();
    }

    //右方选项菜单点击
    function rightTClick(num){
        if(levelUrl){
            if(levelUrl=="levelPage/level"+num+".html"){
                openAndCloseMsg(1,"<p>请勿重复点击关卡！</p>");
                return;
            }
        }
        var prS = document.getElementById("preShow");
        var start = document.getElementById("start");
        prS.setAttribute('class','preShow'); 
        setTimeout(function(){
            levelUrl = "levelPage/level"+num+".html";
            prS.style.background="url(image/level"+num+"PRE.jpg)";
            prS.style.backgroundSize="100% 100%";
        },400)
        setTimeout(function(){
            start.style.display="block";
            prS.setAttribute('class','abc'); 
        },800)
    }
    
    //开始点击
    function startClick(){
        var iframe = document.getElementById("iframe");
        // iframe.style.display="block";
        iframe.style.width="100%";
        iframe.src=levelUrl;
    }

    //开关msg弹窗
    function openAndCloseMsg(cho,msgT){
        var msg = document.getElementById('msg');
        var msgCA = document.getElementById('msgConAdd');
        msgCA.innerHTML=msgT;
        if(cho===0){
            msg.style.display="none";
        }
        if(cho===1){
            msg.style.display="block";
        }
    }