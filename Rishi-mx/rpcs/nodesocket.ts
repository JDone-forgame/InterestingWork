import { RPCRequest } from 'mx-rpc';

export class RequestRPC extends RPCRequest {
    constructor(name: string, host: any) {
        super(name, host)
        //  if(!host){
        //      throw("need init host first");
        //  }
    }

    request<T>(method: "broadcast"|"broadcastme"|"request"|string, route: string, data: any,arryList:string[],balanceKey:string):Promise<any> {
        // 这里需要按照请求参数列表,制作对应的请求
        let queryList:any[] = [];
        for(let i = 0;i < arryList.length;i++){
            queryList.push(data[arryList[i]])
        }

        if(method == "broadcast"){
            this.CallBroadcast(false,route,...queryList);
            return Promise.resolve();
        }
        else if(method == "broadcastme"){
            this.CallBroadcast(true,route,...queryList);
            return Promise.resolve();
        }else{
             return this.Call(data[balanceKey]||"",route,...queryList)
        }
        
    }
}