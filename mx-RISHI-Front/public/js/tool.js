// ajax 请求
let xmlhttp;

// 发送请求实现
function loadXMLDoc(url, param, cfunc) {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = cfunc;
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(param);
}

// 发送请求
function request(url, param) {
    let local = 'http:10.0.0.180:19000/game'

    loadXMLDoc(local + url, param, function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            return xmlhttp.responseText
            // return data = JSON.parse(xmlhttp.responseText);
        }
    });
}