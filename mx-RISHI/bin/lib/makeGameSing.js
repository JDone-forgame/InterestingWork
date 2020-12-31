"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGameSing = void 0;
const crypto_1 = require("crypto");
const mx_tool_1 = require("mx-tool");
function makeGameSing(infos) {
    let signInfos = [];
    for (let key in infos) {
        if (key == 'sign')
            continue;
        signInfos.push(key + '=' + infos[key]);
    }
    signInfos.sort(function (a, b) { return a > b ? 1 : -1; });
    return crypto_1.createHash("md5").update(signInfos.join('&') + mx_tool_1.ConfigMgr.get("appKey")).digest("hex");
}
exports.makeGameSing = makeGameSing;
//# sourceMappingURL=makeGameSing.js.map