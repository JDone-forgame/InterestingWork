import { ConfigMgr } from "mx-tool";

export var DBDefine = {
    db: ConfigMgr.get('db.database') || "reshi",
    col_role: 'roles',
    col_task: 'tasks',
    col_achievement: 'achievement',
    col_mail: 'mails',
    col_board: "board",
    col_friend: "friend",
}

export enum ErrorCode {
    /**----------------------------通用---------------------------------------- */
    ok = 0,
    param_error = 1,
    appid_error = 2,
    session_key_error = 3,
    db_error = 4,


    /**----------------------------角色相关------------------------------------- */
    role_no = 10001,
    role_exist = 10004,
    role_token_error = 10005,
    role_no_mail = 10006,
    gm_tool_execute_error = 10012,

    // 登录相关
    login_error = 10011,


    /**----------------------------游戏相关------------------------------------- */
}