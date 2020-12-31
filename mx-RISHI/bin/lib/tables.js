"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablesService = exports.SuppotTables = void 0;
/**
 * 公共表格都放在这里加载，特殊的表格可以在业务中自主加载
 */
const fs_1 = require("fs");
const mx_resource_1 = require("mx-resource");
const mx_tool_1 = require("mx-tool");
const path_1 = require("path");
const mx_tool_2 = require("mx-tool");
// 这里列出所有支持的表格
var SuppotTables;
(function (SuppotTables) {
    SuppotTables[SuppotTables["gamelist"] = 0] = "gamelist";
    SuppotTables[SuppotTables["items"] = 1] = "items";
    SuppotTables[SuppotTables["task"] = 2] = "task";
})(SuppotTables = exports.SuppotTables || (exports.SuppotTables = {}));
class TablesService {
    // 获取表格
    static getModule(name) {
        let fileName = this.short2filepath.get(name);
        if (!fileName)
            return undefined;
        let mp = mx_resource_1.ResourceModule.cache[fileName];
        if (!mp)
            return undefined;
        return mp;
    }
    static findRes(type) {
        let maybeList = [];
        maybeList.push(type);
        for (let i = 0; i < maybeList.length; i++) {
            let mp = this.getModule(maybeList[i]);
            if (!mp)
                continue;
            return mp;
        }
        return undefined;
    }
    // 在线的资源调整，这里涉及到资源文件的增减
    static async onlineCheck() {
        let md = this.getModule("_filelist_");
        if (!md) {
            return false;
        }
        await md.onlineCheck();
        await this.loadAllRes();
        return true;
    }
    // 当文件变动的时候，查看是否需要重新调整目录，可能删减了表格模块
    static onFilelistChange() {
        let md = this.getModule("_filelist_");
        if (!md)
            return;
        let list = md.getRes("_files_");
        let waitCheckMaps = new Set;
        this.short2filepath.forEach((v, key) => {
            waitCheckMaps.add(key);
        });
        let hasNew = false;
        for (let i = 0; i < list.length; i++) {
            let name = list[i];
            if (name.indexOf('.json') < 0) {
                continue;
            }
            name = name.slice(0, name.indexOf('.json'));
            if (!this.short2filepath.has(name)) {
                hasNew = true;
                continue;
            }
            else {
                waitCheckMaps.delete(name);
            }
        }
        // 看看最后还有没有剩下的
        if (waitCheckMaps.size > 0) {
            // 淘汰掉多余的
            waitCheckMaps.forEach((v) => {
                if (v == "_filelist_")
                    return;
                let long = this.short2filepath.get(v);
                if (long) {
                    // 卸载掉多余的操作
                    delete mx_resource_1.ResourceModule.cache[long];
                    this.short2filepath.delete(v);
                }
            });
        }
        if (hasNew) {
            // 有新增的掉一下loadall
            return this.loadAllRes();
        }
        return;
    }
    // 装在所有filelist中的文件
    static async loadAllRes() {
        let md = this.getModule("_filelist_");
        if (!md)
            return false;
        let list = md.getRes("_files_");
        if (!list)
            return false;
        let baseRes = process.cwd();
        let url = mx_tool_1.ConfigMgr.get('resource.url');
        let plat = mx_tool_1.ConfigMgr.get('resource.platform');
        for (let i = 0; i < list.length; i++) {
            let name = list[i];
            if (name.indexOf('.json') < 0) {
                continue;
            }
            name = name.slice(0, name.indexOf('.json'));
            let cnf = {
                path: 'res/' + name + '.json'
            };
            if (this.short2filepath.has(name))
                continue;
            let fPath = path_1.join(baseRes, cnf.path);
            if (!fs_1.existsSync(path_1.parse(fPath).dir)) {
                fs_1.mkdirSync(path_1.parse(fPath).dir, { recursive: true });
            }
            let md = mx_resource_1.ResourceModule.watch(fPath, plat, url, true);
            await md.onlineCheck();
            md.on("change", this.onChange.bind(this, name));
            this.short2filepath.set(name, fPath);
        }
        return true;
    }
    static async init(tables) {
        if (tables == undefined) {
            tables = [];
        }
        let baseRes = process.cwd();
        let url = mx_tool_1.ConfigMgr.get('resource.url');
        let plat = mx_tool_1.ConfigMgr.get('resource.platform');
        // 先加载 _filelist_.json 再加载所有的json表格
        let fPath = path_1.join(baseRes, 'res/_filelist_.json');
        if (!fs_1.existsSync(path_1.parse(fPath).dir)) {
            fs_1.mkdirSync(path_1.parse(fPath).dir, { recursive: true });
        }
        let md = mx_resource_1.ResourceModule.watch(fPath, plat, url, true);
        this.short2filepath.set("_filelist_", fPath);
        await md.onlineCheck();
        md.on("change", this.onChange.bind(this, "_filelist_"));
        // 找出所有的json
        await this.loadAllRes();
        return true;
    }
    static onChange(name) {
        if (name == "_filelist_") {
            // 如果资源总表变更了，那么需要重新处理当前的资源内容
            this.onFilelistChange();
            return;
        }
        // 这里的name处理一下，有可能返回的是分页签的内容
        if (name.indexOf("_") > 0) {
            // 实际表格存在分表的情况，这里需要特殊处理一下
            name = name.slice(0, name.indexOf("_"));
        }
        if (this.tableChangeList[name]) {
            try {
                this.tableChangeList[name];
            }
            catch (e) {
            }
        }
    }
    static doChange(name, cb) {
        this.tableChangeList[name] = cb;
    }
    /**
     * 获取表格资源
     * @param type 表格类型
     * @param sID 表格内容id
     */
    static async getTable(type, sID) {
        if (sID == undefined)
            return undefined;
        let mp = this.findRes(type);
        if (!mp)
            return undefined;
        return mp.getRes(sID);
    }
    // 获取整个表格内容
    static async clone(type) {
        let result = {};
        let res = this.findRes(type);
        if (!res)
            return result;
        for (let key in res.resData) {
            result[key.slice(1, key.length)] = res.resData[key];
        }
        return result;
    }
    static async checkTables() {
        // 这里增加一个5s的去重
        await this.onlineCheck();
        await mx_resource_1.ResourceModule.checkResource(3);
        return;
    }
}
// static resMap: Map<string, ResourceModule<any>> = new Map()
TablesService.short2filepath = new Map();
TablesService.tableChangeList = {};
__decorate([
    mx_tool_2.AwaitCall()
], TablesService, "checkTables", null);
exports.TablesService = TablesService;
//# sourceMappingURL=tables.js.map