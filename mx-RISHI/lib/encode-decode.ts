import { createCipheriv, createDecipheriv } from "crypto";

let AZaz09: string = '';
for (let i = 'A'.charCodeAt(0); i < 'Z'.charCodeAt(0); i++) {
    AZaz09 += String.fromCharCode(i);
}
for (let i = 'a'.charCodeAt(0); i < 'z'.charCodeAt(0); i++) {
    AZaz09 += String.fromCharCode(i);
}
for (let i = '0'.charCodeAt(0); i < '9'.charCodeAt(0); i++) {
    AZaz09 += String.fromCharCode(i);
}
function randWord(len: number = 1) {
    let out = '';
    for (let i = 0; i < len; i++) {
        let num = Math.floor(Math.random() * AZaz09.length)
        out += AZaz09.charAt(num);
    }
    return out;
}

/**
 * 对称加密数据
 * @param key 默认是 aes-128-cbc 模式 autoPadding=true 采用 Pad采用Pkcs7 模式
 * @param data 需要加密的数据 utf-8格式
 */
export function AesEncode(key: { algorithm: string, key: string, autoPadding: boolean } | string, data: string | Buffer) {
    let aes = key;
    if (typeof aes == 'string') {
        aes = { algorithm: 'aes-128-cbc', key: aes, autoPadding: true }
    }

    let algorithms = aes.algorithm.toUpperCase().split('-');
    let algorithmOption = { mode: algorithms[2] as any, len: parseInt(algorithms[1]) / 8, type: algorithms[0] }

    let iv: string | null = randWord(16);
    if (algorithmOption.mode == 'ECB') iv = null;
    let decipher = createCipheriv(aes.algorithm, aes.key, iv);
    decipher.setAutoPadding(aes.autoPadding);
    if (typeof data == 'string') {
        data = Buffer.from(data, 'utf-8');
    }

    let encryptedData = decipher.update(data.toString("binary"), 'binary', 'base64');
    encryptedData += decipher.final('base64');
    return { encryptedData: encryptedData, iv: iv };
}

/**
 * 对称解密数据
 * @param key 默认是 aes-128-cbc 模式 autoPadding=true 采用 Pad采用Pkcs7 模式
 * @param encryptedData base64的密钥
 * @param iv 
 * @param binary 是否导出binary格式 否则导出 utf8
 */
export function AesDecode(key: { algorithm: string, key: string, autoPadding: boolean } | string, encryptedData: string, iv?: string | null, binary?: boolean) {
    let aes = key;
    if (typeof aes == 'string') {
        aes = { algorithm: 'aes-128-cbc', key: aes, autoPadding: true }
    }

    let algorithms = aes.algorithm.toUpperCase().split('-');
    let algorithmOption = { mode: algorithms[2] as any, len: parseInt(algorithms[1]) / 8, type: algorithms[0] }

    if (!iv || algorithmOption.mode == 'ECB') iv = null;
    let decipher = createDecipheriv(aes.algorithm, aes.key, iv);
    decipher.setAutoPadding(aes.autoPadding);
    let decryptData = decipher.update(encryptedData, 'base64', binary ? 'binary' : 'utf8');
    decryptData += decipher.final(binary ? 'binary' : 'utf8');
    return decryptData;
}
