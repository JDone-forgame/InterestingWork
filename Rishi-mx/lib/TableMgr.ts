import { ConfigMgr } from "mx-tool";
import { readFileSync } from "fs";
import { join } from "path";

class PltFileList {
    private _file_list: string[] = [];
    private _tablePath : string = "res/table/";
    static _inst: PltFileList;

    public static get_plt_file(filename: string, plt?: string) {
        if (!this._inst) {
            this._inst = new PltFileList();
        }
        let channelName : string =  ConfigMgr.get('channel');
        return this._inst.get_plt_file(filename, channelName);
    }

    constructor() {
        this.readFileList();
    }

    private readFileList() {
        try {
            var read_data = readFileSync(join(this._tablePath, '_filelist_.json'));
            var js_data = JSON.parse(read_data.toString());
            this._file_list = js_data['_files_'] || [];
        }
        catch (e) {

        }
    }

    private get_plt_file(filename: string, plt : string) : string{
        let pltFile : string = filename + '_' + plt + '.json';
        if (this._file_list.indexOf(pltFile) >= 0) {
            return join(this._tablePath, pltFile);
        }
        return join(this._tablePath, filename + ".json");
    }
}

export class TableMgr {
    name = "TableMgr"
    private static _inst: TableMgr;
    public static get inst(): TableMgr {
        if (!this._inst) {
            this._inst = new TableMgr();
        }
        return this._inst;
    }

    private constructor() {

    }


    /**
     * 加载所有表格
     */
    public async init() {

        return true;
    }

}