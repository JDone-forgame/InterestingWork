import { createDecipheriv, createHash, createHmac } from "crypto"
import { ErrorCode } from "../defines/define"

export async function decryptData(_encryptedData: string, _iv: string, _sessionKey: string): Promise<{ [key: string]: string }> {
    // base64 decode
    var sessionKey = Buffer.from(_sessionKey, 'base64')
    let encryptedData = Buffer.from(_encryptedData, 'base64')
    let iv = Buffer.from(_iv, 'base64')

    try {
        // 解密
        var decipher = createDecipheriv('aes-128-cbc', sessionKey, iv)
        // 设置自动 padding 为 true，删除填充补位
        decipher.setAutoPadding(true)
        var decoded = decipher.update((encryptedData as any), 'binary', 'utf8')
        decoded += decipher.final('utf8')
        return JSON.parse(decoded);
    } catch (err) {
        throw ({ code: ErrorCode.SESSION_KEY_ERROR, errMsg: '出了点小问题，请退出后重新打开' })
    }
}

export function makeSignStr(param: { [x: string]: any }) {
    let aList: string[] = [];
    for (let key in param) {
        if (key == "sign") continue;
        aList.push(`${key}=${param[key]}`)
    }

    aList.sort();
    return aList.join('&')
}


export function makeSign(type: "md5" | "sha1" | "sha256", data: string, key?: string) {
    switch (type) {
        case 'sha1': return makeSha1(data, key);
        case 'sha256': return makeSha256(data, key);
        case 'md5':
        default:
            return makeMd5(data);
    }
}

function makeMd5(data: string) {
    return createHash("md5").update(data).digest("hex")
}

function makeSha1(data: string, key?: string) {
    if (key) {
        return createHmac("sha1", key).update(data).digest("hex")
    }
    else {
        return createHash("sha1").update(data).digest("hex")
    }
}

function makeSha256(data: string, key?: string) {
    if (key) {
        return createHmac("sha256", key).update(data).digest("hex")
    }
    else {
        return createHash("sha256").update(data).digest("hex")
    }
}