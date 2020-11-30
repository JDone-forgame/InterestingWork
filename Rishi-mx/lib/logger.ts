import { ConfigMgr, LocalDate } from 'mx-tool'
import { LoggerMoudle as LM } from "mx-logger"

class Logger extends LM<string> {
    name = "Logger"
    constructor() {
        super()
    }


    private createlog(arrayList: Array<string> = [], outParam: { [key: string]: string | number } = {}): Object {
        // 有几个是必须要有的添加一下
        let needslist: string[] = ['record_time'];
        for (let i = 0; i < needslist.length; i++) {
            if (arrayList.indexOf(needslist[i]) < 0) {
                arrayList.push(needslist[i]);
            }
        }

        // 生成日志的通用接口
        let outLog: { [key: string]: number | string } = {}

        let extList: string[] = [];

        for (let key in arrayList) {
            let sKey = arrayList[key];
            switch (sKey) {
                case 'platId': outLog[sKey] = ConfigMgr.get('id') || ''; break;
                case 'record_time': outLog[sKey] = LocalDate.formateString(); break;
                default:
                    if (outParam.hasOwnProperty(sKey)) {
                        outLog[sKey] = outParam[sKey];
                    }
                    else {
                        extList.push(sKey);
                    }
                    break;
            }
        }

        return outLog;
    }

    /**
     * 角色注册日志
     */
    public roleRegist(gameId: string, uid: string, activeid: string, inviteid: string) {
        let outList = [
            'sUid',
            'sActiveid',
            'sInviteid'
        ];
        let outParam = {
            'sUid': (uid || "").toString(),
            "sActiveid": (activeid || "").toString(),
            'sInviteid': (inviteid || "").toString()
        }
        this.logEvent(gameId, 'roleRegist', this.createlog(outList, outParam));
    }

    /**
     * 角色登录日志
     */
    public roleLogin(gameId: string, uid: string, activeid: string, inviteid: string) {
        let outList = [
            'sUid',
            'sActiveid',
            'sInviteid'
        ];
        let outParam = {
            'sUid': (uid || "").toString(),
            "sActiveid": (activeid || "").toString(),
            'sInviteid': (inviteid || "").toString()
        }
        
        this.logEvent(gameId, 'roleLogin', this.createlog(outList, outParam));
    }
}

export var LoggerMoudle = new Logger()