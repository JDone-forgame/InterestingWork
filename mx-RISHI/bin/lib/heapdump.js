"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeHeapDump = void 0;
const mx_tool_1 = require("mx-tool");
let lastMk = 0;
// 生产一个dump目前每分钟只能有一次
function makeHeapDump() {
    if (mx_tool_1.LocalDate.now() - lastMk < 1 * mx_tool_1.LocalDate.Minute) {
        return Promise.resolve("");
    }
    lastMk = mx_tool_1.LocalDate.now();
    return new Promise(function (r, j) {
        try {
            let hp = require('heapdump');
            let nm = './heapsnapshot/' + Date.now() + '.heapsnapshot';
            hp.writeSnapshot(nm, function (e, name) {
                if (e) {
                    j(e);
                }
                else {
                    r(name);
                }
            });
        }
        catch (e) {
            j(Error("need install module : npm i heapdump"));
        }
    });
}
exports.makeHeapDump = makeHeapDump;
//# sourceMappingURL=heapdump.js.map