import { LocalDate } from "mx-tool";

let lastMk = 0;

// 生产一个dump目前每分钟只能有一次
export function makeHeapDump() {
    if (LocalDate.now() - lastMk < 1 * LocalDate.Minute) {
        return Promise.resolve("");
    }
    lastMk = LocalDate.now();
    return new Promise<string>(function (r, j) {
        try {
            let hp = require('heapdump');
            let nm = './heapsnapshot/' + Date.now() + '.heapsnapshot'
            hp.writeSnapshot(nm, function (e: any, name: string) {
                if (e) {
                    j(e)
                }
                else {
                    r(name)
                }
            });
        }
        catch (e) {
            j(Error("need install module : npm i heapdump"))
        }
    })
}