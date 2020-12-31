"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mx_tool_1 = require("mx-tool");
const mx_webserve_1 = require("mx-webserve");
const define_1 = require("../../../defines/define");
const encode_decode_1 = require("../../../lib/encode-decode");
const logger_1 = require("../../../lib/logger");
// 全局请求拦截监控
let _1 = class _1 {
    async before(req, res) {
        // 这里增加一个数据加密的流程数据采用对称加密，加密需要的条件是
        let params = req.params;
        if (params.__id__ && params.__data__ && params.__iv__) {
            // 需要通过加密验证流程
            let enpasskey = "1234567890123456";
            let passkey = enpasskey;
            try {
                let info = encode_decode_1.AesDecode(passkey, params.__data__, params.__iv__);
                req.params = JSON.parse(info);
                req.params.__encode__ = enpasskey;
            }
            catch (e) {
                throw { code: define_1.ErrorCode.DECODE_ERROR, errMsg: "token error parse message error" };
            }
        }
        let id = req.params.id || req.params.roleid || req.params.uid;
        req.reqID = logger_1.LoggerMoudle.apiBegin(req.path, req.method, id, mx_tool_1.Util.copy(req.params));
    }
    after(req, res) {
        if (typeof req.responseData === "object") {
            req.responseData.serverTime = mx_tool_1.LocalDate.now();
        }
        if (req.reqID)
            logger_1.LoggerMoudle.apiEnd(req.reqID, true, req.responseData);
        if (req.params.__encode__) {
            let data = req.responseData;
            if (typeof data == "object") {
                data = JSON.stringify(data);
            }
            try {
                // 压缩了还回去
                let info = encode_decode_1.AesEncode(req.params.__encode__, data);
                req.responseData = {
                    __data__: info.encryptedData,
                    __iv__: info.iv
                };
            }
            catch (e) {
                // 失败的话走明文
            }
        }
    }
};
__decorate([
    mx_webserve_1.WebRouteModule.globalBefore()
], _1.prototype, "before", null);
__decorate([
    mx_webserve_1.WebRouteModule.globalAfter()
], _1.prototype, "after", null);
_1 = __decorate([
    mx_webserve_1.WebRouteModule.globalClass()
], _1);
//# sourceMappingURL=index.js.map