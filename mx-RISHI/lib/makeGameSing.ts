import { createHash } from "crypto";
import { ConfigMgr as TeConfigMgr } from "mx-tool"
export function makeGameSing(infos: {
    [key: string]: string | number;
}) {
    let signInfos: string[] = [];
    for (let key in infos) {
        if (key == 'sign')
            continue;
        signInfos.push(key + '=' + infos[key]);
    }
    signInfos.sort(function (a, b) { return a > b ? 1 : -1; });
    return createHash("md5").update(signInfos.join('&') + TeConfigMgr.get("appKey")).digest("hex");
}
