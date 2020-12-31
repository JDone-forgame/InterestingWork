
var request = new XMLHttpRequest();

class httpConnect {
    static host = '127.0.0.1'
    static port = '19000'

    static send(url, param) {
        function getJSON(url) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.responseType = 'json';
                xhr.onload = function () {
                    var status = xhr.status;
                    if (status == 200) {
                        resolve(xhr.response);
                    } else {
                        reject(status);
                    }
                };
                xhr.send();
            });
        };
        function startHttpQuery(url, paramStr) {
            if (param != null) {
                //get方法的查询参数设置
                url = url + "?" + paramStr;
            }
            getJSON(url).then(function (data) {
                return data;
            },
                function (status) {
                    return 'Something went wrong.';
                });
        }

        let paramStr = '';
        for (let key in param) {
            paramStr += key
            paramStr += '='
            paramStr += obj[key]
            paramStr += '&'
        }
        paramStr = paramStr.slice(0, str.length - 1)

        return startHttpQuery(url, paramStr);

    }

    static login(name, password) {
        let url = this.host + ':' + this.port+'/game/local/login'
        let param = {
            name: name,
            password: password,
        }
        return this.send(url, param)
    }

}

module.exports = new httpConnect();