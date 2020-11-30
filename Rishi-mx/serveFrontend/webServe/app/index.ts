import { RPCHandle } from "mx-rpc";
import { ConfigMgr } from "mx-tool";
import { WebRouteModule } from "mx-webserve";
import { join } from "path";

export var name = "webServe"

@RPCHandle.class("webServe", module)
class web {
    @RPCHandle.init()
    init() {
        // 是否开启swagger
        if (ConfigMgr.get("host") && ConfigMgr.get("Swagger")) {
            try {
                WebRouteModule.openSwagger({ basedir: join(__dirname, '..'), ext: ".js", routePath: "web", title: "rishi", host: ConfigMgr.get("host") })
            }
            catch (e) {

            }
        }

        require("../adapter")
        WebRouteModule.openCross();
        return WebRouteModule.init(ConfigMgr.get("web"), join(__dirname, '..', 'web'), function () {
            return ConfigMgr.get("channel") || ""
        })
    }
}
