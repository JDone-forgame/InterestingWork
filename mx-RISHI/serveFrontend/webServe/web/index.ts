import { LocalDate, Util } from "mx-tool";
import { Response, Request } from "mx-webserve";
import { WebRouteModule } from "mx-webserve";
import { ErrorCode } from "../../../defines/define";
import { AesDecode, AesEncode } from "../../../lib/encode-decode";
import { LoggerMoudle } from "../../../lib/logger";

// 全局请求拦截监控
@WebRouteModule.globalClass()
class _1 {
    @WebRouteModule.globalBefore()
    async before(req: Request, res: Response) {
        // 这里增加一个数据加密的流程数据采用对称加密，加密需要的条件是
        let params = req.params as any;
        if (params.__id__ && params.__data__ && params.__iv__) {
            // 需要通过加密验证流程

            let enpasskey = "1234567890123456";
            let passkey = enpasskey;
            try {
                let info = AesDecode(passkey, params.__data__, params.__iv__);
                req.params = JSON.parse(info);
                req.params.__encode__ = enpasskey;
            }
            catch (e) {
                throw { code: ErrorCode.DECODE_ERROR, errMsg: "token error parse message error" }
            }
        }

        let id = req.params.id || req.params.roleid || req.params.uid;
        (req as any).reqID = LoggerMoudle.apiBegin(req.path, req.method, id, Util.copy(req.params))
    }

    @WebRouteModule.globalAfter()
    after(req: Request, res: Response) {
        if (typeof (req as any).responseData === "object") {
            (req as any).responseData.serverTime = LocalDate.now();
        }
        if ((req as any).reqID) LoggerMoudle.apiEnd((req as any).reqID, true, (req as any).responseData)
        if (req.params.__encode__) {
            let data = (req as any).responseData;
            if (typeof data == "object") {
                data = JSON.stringify(data);
            }
            try {
                // 压缩了还回去
                let info = AesEncode(req.params.__encode__, data);
                (req as any).responseData = {
                    __data__: info.encryptedData,
                    __iv__: info.iv
                }
            }
            catch (e) {
                // 失败的话走明文
            }
        }
    }
}