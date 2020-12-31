import { RPCHandle } from "mx-rpc";
import { ConfigMgr } from "mx-tool";
import { WebRouteModule } from "mx-webserve";
import { join } from "path";
import { TablesService } from "../../../lib/tables";

export var name = "webServe"

@RPCHandle.class("webServe", module)
class web {
    @RPCHandle.init()
    async init() {
        if (ConfigMgr.get("host") && ConfigMgr.get("swagger")) {
            try {
                WebRouteModule.openSwagger({ basedir: join(__dirname, '..'), ext: ConfigMgr.get("swaggertype") || ".js", routePath: "web", title: "rishi", host: ConfigMgr.get("host") })
            }
            catch (e) {

            }
        }

        let webFiles = join(__dirname, "../web")

        // AutoLoaderModule.watch(webFiles, { isFile: false, tsc: true }).load()
        WebRouteModule.openCross();
        return WebRouteModule.init(ConfigMgr.get("port"), webFiles, function () {
            return ConfigMgr.get("env") || ""
        })
    }

    /**
     * 检查资源更新
     * @route broadcastme reloadTables
     * @group webServe 
     * @returns {void} 0 - 不需要返回内容
     */
    @RPCHandle.route()
    reloadTables() {
        // 提供一个更新表格的接口
        TablesService.checkTables();
    }
}
