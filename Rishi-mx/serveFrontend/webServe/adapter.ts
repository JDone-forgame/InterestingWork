import { WebRouteModule, Response } from "mx-webserve";
import { RequestEx } from "mx-webserve/src/webHandle";
import { LoggerMoudle } from "../../lib/logger";


interface RequestExE extends RequestEx {
    reqID?: string
}

@WebRouteModule.globalClass()
class _ {
    @WebRouteModule.globalBefore()
    async before(req: RequestExE, res: Response) {
        // 获取角色id
        let uid: any = req.params.gameId;
        if (!uid) {
            let info: any;
            if (typeof req.params.info != 'object') {
                try {
                    info = JSON.parse(req.params.info);
                }
                catch (e) {

                }
            } else {
                info = req.params.info;
            }

            if (info && info["userId"]) {
                uid = info["userId"];
            }
        }
        req.reqID = LoggerMoudle.apiBegin(req.path, req.method, uid, req.params);
    }

    @WebRouteModule.globalAfter()
    after(req: RequestExE, res: Response) {
        if (req.reqID) LoggerMoudle.apiEnd(req.reqID, true, req.responseData);
    }
}