"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eAtkMethod = exports.ePractice = exports.eElementName = exports.eUType = void 0;
// 道具更新方式
var eUType;
(function (eUType) {
    // 累加
    eUType[eUType["add"] = 0] = "add";
    // 覆盖
    eUType[eUType["set"] = 1] = "set";
    // 取最大
    eUType[eUType["max"] = 2] = "max";
    // 取最小
    eUType[eUType["min"] = 3] = "min";
})(eUType = exports.eUType || (exports.eUType = {}));
// 五行信息
var eElementName;
(function (eElementName) {
    eElementName["\u91D1"] = "Metal";
    eElementName["\u6728"] = "Wood";
    eElementName["\u6C34"] = "Water";
    eElementName["\u706B"] = "Fire";
    eElementName["\u571F"] = "Earth";
})(eElementName = exports.eElementName || (exports.eElementName = {}));
// 修行信息
var ePractice;
(function (ePractice) {
    ePractice["\u4FEE\u884C\u901F\u5EA6"] = "handledSpeed";
    ePractice["\u771F\u6C14"] = "reiki";
    ePractice["\u4E0A\u6B21\u4FDD\u5B58\u65F6\u95F4"] = "lastSave";
    ePractice["\u4FEE\u884C\u7B49\u7EA7"] = "rLevel";
})(ePractice = exports.ePractice || (exports.ePractice = {}));
// 功法信息
var eAtkMethod;
(function (eAtkMethod) {
    eAtkMethod["\u529F\u6CD5ID"] = "atkId";
    eAtkMethod["\u529F\u6CD5\u540D\u79F0"] = "atkName";
    eAtkMethod["\u529F\u6CD5\u7B49\u7EA7"] = "atkLevel";
})(eAtkMethod = exports.eAtkMethod || (exports.eAtkMethod = {}));
//# sourceMappingURL=role.js.map