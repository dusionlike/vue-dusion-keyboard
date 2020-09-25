import _ffi from 'ffi'
import _ref from "ref";
import { HandWrite } from "./index";



interface LibPath { CN_path: string, EN_path: string, dll_Path: string }

export default class LocalHandWrite implements HandWrite {
    private static ffi: typeof _ffi
    private static ref: typeof _ref

    private static path: LibPath

    //这些变量是dll需要用到的内存指针，定义在全局防止被CG
    private zcsids: Buffer

    private subRectCbn: Buffer
    private ms_lpCodes: Buffer
    private ms_lpPssbs: Buffer
    private lp16TestLongsCbz: Buffer
    private static _dll: any

    constructor(basePath: string = 'plug\\handWrite\\') {
        if (!window.require) {
            throw new Error("手写模块已关闭，请在electron环境下运行");
        }
        try {
            LocalHandWrite.ffi = window.require<typeof _ffi>('ffi');
            LocalHandWrite.ref = window.require<typeof _ref>('ref');
        } catch (error) {
            //加载ffi失败，尝试加载fii-napi
            LocalHandWrite.ffi = window.require<typeof _ffi>('ffi-napi');
            LocalHandWrite.ref = window.require<typeof _ref>('ref-napi');
        }
        LocalHandWrite.path = {
            CN_path: basePath + "/hz.mrd",
            EN_path: basePath + "/English.mrd",
            dll_Path: basePath + "/XDLL.dll"
        }
        let ref = LocalHandWrite.ref
        let ffi = LocalHandWrite.ffi
        if (!LocalHandWrite._dll) {
            let p_uchar = ref.refType('uchar')
            LocalHandWrite._dll = ffi.Library(LocalHandWrite.path.dll_Path, {
                'ZZ_CreateLib': ['int', ['string', 'int', 'string']],
                'ZZ_RecgTuxg': ['int', ['int', p_uchar, p_uchar, p_uchar, p_uchar, p_uchar, 'int', p_uchar, p_uchar, 'int', p_uchar, p_uchar]],
                'ZZ_DeleteLib': ['int', []],
            });
        }
        this.zcsids = Buffer.alloc(64);
        this.zcsids.writeInt32LE(5, 0);
        this.zcsids.writeInt32LE(7, 4);

        this.subRectCbn = ref.alloc(ref.types.uchar, 0)
        this.ms_lpCodes = Buffer.alloc(48);
        this.ms_lpPssbs = Buffer.alloc(48);
        this.lp16TestLongsCbz = Buffer.alloc(3072 * 4);
    }
    /**装载字体库 */
    createLib(lib: string) {
        return new Promise<boolean>((success, fail) => {
            try {
                LocalHandWrite._dll.ZZ_DeleteLib()
                LocalHandWrite._dll.ZZ_CreateLib.async("47497DB3-6FA0-4FC5-9EB8-868DA935FB96", 0, LocalHandWrite.path[lib + '_path'], (err: any) => {
                    if (!err) {
                        success(true)
                    } else {
                        fail(err)
                    }
                })
            } catch (error) {
                fail(error)
            }
        })
    }

    GetWords(lpXis: number[], lpYis: number[], lpCis: number[]) {
        return new Promise<string[]>((success, fail) => {
            try {
                let ref = LocalHandWrite.ref
                if (!lpXis || !lpYis || !lpCis) {
                    fail("缺少参数")
                }

                if (!(lpXis.length === lpYis.length && lpXis.length === lpCis.length)) {
                    fail("参数长度不一致")
                }

                let lpXisBuffer = Buffer.alloc(3072 * 2);
                let lpYisBuffer = Buffer.alloc(3072 * 2);
                let lpCisBuffer = Buffer.alloc(3072 * 2);

                this.shortsToPtr(lpXisBuffer, lpXis);
                this.shortsToPtr(lpYisBuffer, lpYis);
                this.shortsToPtr(lpCisBuffer, lpCis);

                let sResult = Buffer.alloc(3072 * 4);

                LocalHandWrite._dll.ZZ_RecgTuxg.async(0, this.zcsids, this.subRectCbn, lpXisBuffer, lpYisBuffer, lpCisBuffer, lpXis.length, this.ms_lpCodes, this.ms_lpPssbs, 12, sResult, this.lp16TestLongsCbz, (err: any) => {
                    // console.log(this.ms_lpCodes);
                    let result = []
                    for (let i = 0; i < this.ms_lpCodes.length; i += 4) {
                        let readint = this.ms_lpCodes.readInt32LE(i)
                        if (readint < 19968) {
                            result.push(this.ms_lpCodes.slice(i, i + 1).toString())
                        } else {
                            result.push(unescape("%u" + readint.toString(16)));
                        }
                    }
                    success(result);
                })

            } catch (error) {
                fail(error)
            }
        })
    }

    private shortsToPtr(buffer: Buffer, shorts: number[]) {
        for (let i = 0; i < shorts.length; i += 2) {
            buffer.writeInt16LE(shorts[i], i);
        }
    }
}