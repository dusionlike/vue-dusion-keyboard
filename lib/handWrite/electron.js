var handWrite = undefined
if (window.require) {
    const ffi = window.require('ffi');
    const ref = window.require('ref');
    const p_uchar = ref.refType('uchar');
    const iconv = window.require('iconv-lite')

    var _dll = null;
    const path = {
        CN_path: "plug\\handWrite\\hz.mrd",
        EN_path: "plug\\handWrite\\English.mrd"
    }


    try {
        _dll = ffi.Library('plug\\handWrite\\XDLL.dll', {
            'ZZ_CreateLib': ['int', ['string', 'int', 'string']],
            'ZZ_RecgTuxg': ['int', ['int', p_uchar, p_uchar, p_uchar, p_uchar, p_uchar, 'int', p_uchar, p_uchar, 'int', p_uchar, p_uchar]],
            'ZZ_DeleteLib': ['int', []],
        });

        handWrite = {}

        /**加载文字库 */
        handWrite.createLib = function (lib) {
            return new Promise(function (success, fail) {
                try {
                    var deleteLib = _dll.ZZ_DeleteLib();
                    var create_result = _dll.ZZ_CreateLib("47497DB3-6FA0-4FC5-9EB8-868DA935FB96", 0, path[lib + '_path'])
                    success(create_result)
                } catch (error) {
                    fail(error)
                }
            })
        }

        function shortsToPtr(buffer, shorts) {
            buffer.type = ref.types.uchar;

            for (let i = 0; i < shorts.length; i += 2) {
                buffer.writeInt16LE(shorts[i], i);
            }
        }

        //这些变量是dll需要用到的内存指针，定义在全局防止被CG
        var zcsids = Buffer.alloc(64);
        zcsids.writeInt32LE(5, 0);
        zcsids.writeInt32LE(7, 4);

        var subRectCbn = ref.alloc(ref.types.uchar, 0)

        var ms_lpCodes = Buffer.alloc(48);
        ms_lpCodes.types = ref.types.uchar;

        var ms_lpPssbs = Buffer.alloc(48);
        ms_lpPssbs.types = ref.types.uchar;

        var lp16TestLongsCbz = Buffer.alloc(3072 * 4);
        lp16TestLongsCbz.types = ref.types.uchar;

        /**
         * 获取候选文字
         * 参数：lpXis, lpYis：关键点数组;lpCis:标志位数组，每一笔的最后一个关键点为1，其余为0
         * 返回：候选字数组
         */
        handWrite.GetWords = function (lpXis, lpYis, lpCis) {
            return new Promise(function (success, fail) {
                try {
                    if (!lpXis || !lpYis || !lpCis) {
                        fail("缺少参数")
                    }

                    if (!(lpXis.length === lpYis.length && lpXis.length === lpCis.length)) {
                        fail("参数长度不一致")
                    }

                    var lpXisBuffer = Buffer.alloc(3072 * 2);
                    var lpYisBuffer = Buffer.alloc(3072 * 2);
                    var lpCisBuffer = Buffer.alloc(3072 * 2);

                    shortsToPtr(lpXisBuffer, lpXis);
                    shortsToPtr(lpYisBuffer, lpYis);
                    shortsToPtr(lpCisBuffer, lpCis);

                    var sResult = Buffer.alloc(3072 * 4);
                    sResult.types = ref.types.uchar;

                    _dll.ZZ_RecgTuxg.async(0, zcsids, subRectCbn, lpXisBuffer, lpYisBuffer, lpCisBuffer, lpXis.length, ms_lpCodes, ms_lpPssbs, 12, sResult, lp16TestLongsCbz, err => {
                        // console.log(ms_lpCodes);
                        var result = []
                        for (let i = 0; i < ms_lpCodes.length; i += 4) {
                            let readint = ms_lpCodes.readInt32LE(i)
                            if (readint < 19968) {
                                result.push(iconv.decode(ms_lpCodes.slice(i, i + 1), 'utf8'))
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

    } catch (error) {
        console.error(error);
    }
} else {
    console.error("手写模块已关闭，请在electron环境下运行或添加互联网接口地址\'hand-write-api\'");
}


export default handWrite