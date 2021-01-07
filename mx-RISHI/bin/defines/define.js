"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gFinallAwardGroup = exports.MX_Role_Rate = exports.versioncmp = exports.LogClass = exports._info_set = exports._info_get = exports.compareVersion = exports.appendSign = exports.makeSign = exports.makeNornalSign = exports.s_lang = exports.ErrorCode = exports.DBDefine = void 0;
const mx_tool_1 = require("mx-tool");
const crypto_1 = require("crypto");
exports.DBDefine = {
    db: mx_tool_1.ConfigMgr.get('db.database') || 'rishi',
    // 记录用户信息
    col_role: 'roles',
};
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["OK"] = 0] = "OK";
    // 参数错误
    ErrorCode[ErrorCode["PARAM_ERROR"] = 1] = "PARAM_ERROR";
    // 解码错误
    ErrorCode[ErrorCode["DECODE_ERROR"] = 2] = "DECODE_ERROR";
    ErrorCode[ErrorCode["SESSION_KEY_ERROR"] = 3] = "SESSION_KEY_ERROR";
    ErrorCode[ErrorCode["TOKEN_ERROR"] = 4] = "TOKEN_ERROR";
    ErrorCode[ErrorCode["DB_ERROR"] = 5] = "DB_ERROR";
    ErrorCode[ErrorCode["ROLE_TOKEN_ERROR"] = 11] = "ROLE_TOKEN_ERROR";
    ErrorCode[ErrorCode["NO_ROLE"] = 12] = "NO_ROLE";
    ErrorCode[ErrorCode["ROLE_GET_ERROR"] = 13] = "ROLE_GET_ERROR";
    ErrorCode[ErrorCode["ROLE_EXIST"] = 14] = "ROLE_EXIST";
    ErrorCode[ErrorCode["ROLE_REGIST_FAILED"] = 15] = "ROLE_REGIST_FAILED";
    ErrorCode[ErrorCode["NO_CACHE"] = 30] = "NO_CACHE";
    ErrorCode[ErrorCode["LOGIN_FAILED"] = 50] = "LOGIN_FAILED";
    ErrorCode[ErrorCode["ITEM_NOT_FOUND"] = 100] = "ITEM_NOT_FOUND";
    ErrorCode[ErrorCode["ITEM_OPTION_FAILED"] = 101] = "ITEM_OPTION_FAILED";
    ErrorCode[ErrorCode["ITEM_NOT_ENOUGH"] = 102] = "ITEM_NOT_ENOUGH";
    ErrorCode[ErrorCode["ITEM_USE_FAILED"] = 103] = "ITEM_USE_FAILED";
    ErrorCode[ErrorCode["ITEM_CAN_NOT_USE"] = 104] = "ITEM_CAN_NOT_USE";
    ErrorCode[ErrorCode["RLEVEL_NOT_FOUND"] = 200] = "RLEVEL_NOT_FOUND";
    ErrorCode[ErrorCode["RLEVEL_ERROR"] = 201] = "RLEVEL_ERROR";
    ErrorCode[ErrorCode["RLEVEL_NOT_ENOUGH"] = 202] = "RLEVEL_NOT_ENOUGH";
    ErrorCode[ErrorCode["ATKMETHOD_LEARN_FAIED"] = 300] = "ATKMETHOD_LEARN_FAIED";
    ErrorCode[ErrorCode["ELEMENTS_NOT_ENOUGH"] = 400] = "ELEMENTS_NOT_ENOUGH";
    ErrorCode[ErrorCode["ENERGY_NOT_ENOUGH"] = 500] = "ENERGY_NOT_ENOUGH";
    ErrorCode[ErrorCode["GET_LUCKCHANCE_FAILED"] = 600] = "GET_LUCKCHANCE_FAILED";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
let map = {};
map[1] = "您在${Month}月${Date}日发起的《${activeName}》活动，获奖者名单及收货信息如下，请在活动结束后7个工作日内邮寄出实物奖励。如您因未及时发放奖励或发送虚假奖励，头号赢家有权封停您的账号。造成重大影响者，将依法交予公安机关处理。";
map[2] = "中奖名单";
function s_lang(code, params = {}) {
    let useStr = map[code] || '';
    for (let key in params) {
        let reg = new RegExp("\\$\\{" + key + "\\}", "g");
        useStr = useStr.replace(reg, params[key]);
    }
    return useStr;
}
exports.s_lang = s_lang;
function makeNornalSign(params, appKey) {
    if (!params || !appKey) {
        return '';
    }
    let queryString = "";
    const keys = Object.keys(params).sort();
    for (var i in keys) {
        if (keys[i] == 'sign')
            continue;
        queryString += keys[i];
        queryString += "=";
        queryString += params[keys[i]];
        queryString += "&";
    }
    const stringSignTemp = queryString + "key" + "=" + appKey; //key为平台给厂商的密钥key
    const sign = crypto_1.createHash("md5").update(stringSignTemp).digest('hex');
    return sign;
}
exports.makeNornalSign = makeNornalSign;
function makeSign(params, appKey) {
    if (!params || !appKey) {
        return '';
    }
    let queryString = [];
    const keys = Object.keys(params).sort();
    for (var i in keys) {
        let key = keys[i];
        if (key == 'sign')
            continue;
        let value = params[keys[i]];
        if (typeof value == 'object') {
            queryString.push(`${key}=${JSON.stringify(value)}`);
        }
        else if (value != undefined) {
            queryString.push(`${key}=${value}`);
        }
    }
    const stringSignTemp = queryString.join('&') + appKey; //key为平台给厂商的密钥key
    const sign = crypto_1.createHash("md5").update(stringSignTemp).digest('hex');
    return sign;
}
exports.makeSign = makeSign;
function appendSign(params, appKey) {
    let sign = makeNornalSign(params, appKey);
    params.sign = sign;
    return params;
}
exports.appendSign = appendSign;
function compareVersion(_v1, _v2) {
    let v1 = _v1.split('.');
    let v2 = _v2.split('.');
    const len = Math.max(v1.length, v2.length);
    while (v1.length < len) {
        v1.push('0');
    }
    while (v2.length < len) {
        v2.push('0');
    }
    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i]);
        const num2 = parseInt(v2[i]);
        if (num1 > num2) {
            return 1;
        }
        else if (num1 < num2) {
            return -1;
        }
    }
    return 0;
}
exports.compareVersion = compareVersion;
function _info_get(key) {
    let sKey = key.split('.');
    let obj = this;
    for (let i = 0; i < sKey.length; i++) {
        let oneKey = sKey[i];
        if (i == sKey.length - 1) {
            return obj[oneKey];
        }
        else if (!obj.hasOwnProperty(oneKey)) {
            break;
        }
        else {
            obj = obj[oneKey];
        }
    }
    return undefined;
}
exports._info_get = _info_get;
function _info_set(key, value) {
    let sKey = key.split('.');
    let obj = this;
    for (let i = 0; i < sKey.length; i++) {
        let oneKey = sKey[i];
        if (i == sKey.length - 1) {
            if (obj[oneKey] == value)
                return false;
            if (value == undefined || value == null) {
                delete obj[oneKey];
            }
            else {
                obj[oneKey] = value;
            }
        }
        else {
            if (!obj.hasOwnProperty(oneKey)) {
                obj[oneKey] = {};
            }
            obj = obj[oneKey];
        }
    }
    return true;
}
exports._info_set = _info_set;
class LogClass {
    constructor(name) {
        this.name = "";
        this.start = 0;
        this.step = 0;
        this.name = name;
        this.start = mx_tool_1.LocalDate.now();
    }
    show(stepName) {
        if (!LogClass.open)
            return;
        let curr = mx_tool_1.LocalDate.now();
        console.log(this.name, "step", this.step++, stepName || "", "time", curr - this.start);
        this.start = curr;
    }
}
exports.LogClass = LogClass;
LogClass.open = false;
function versioncmp(vA, vB) {
    let asvA = (vA || "").split('.');
    let asvB = (vB || "").split('.');
    for (let i = 0; i < Math.max(asvA.length, asvB.length); i++) {
        let numA = parseInt(asvA[i] || "0");
        if (isNaN(numA))
            numA = 0;
        let numB = parseInt(asvB[i] || "0");
        if (isNaN(numB))
            numB = 0;
        if (numA > numB)
            return true;
        if (numA < numB)
            return false;
    }
    return false;
}
exports.versioncmp = versioncmp;
exports.MX_Role_Rate = 100 * 10000;
exports.gFinallAwardGroup = "finallaward";
//# sourceMappingURL=define.js.map