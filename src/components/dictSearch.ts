interface DictMap {
    [key: string]: string | string[]
}

let dict: DictMap
let dictKeys: string[]

/**设置词库 */
export function setDict(mdict: DictMap) {
    dict = mdict
    dictKeys = Object.keys(mdict)
}

function mFilter<T>(list: T[], fn: (item: T) => boolean) {
    let tmp1 = []
    let tmp2 = []
    for (const item of list) {
        if (fn(item)) {
            tmp1.push(item)
        } else {
            tmp2.push(item)
        }
    }
    return [tmp1, tmp2]
}

/**搜索候选词 */
export function searchWords(pinyin: string) {
    let hs: string[] = []
    let key = ''
    if (pinyin) {
        //先找没有分词的
        let rex = new RegExp(`^${pinyin}\\w*`);
        
        let res = mFilter(dictKeys, (key) => rex.test(key))
        let keys = res[0].sort()

        //去掉分词前面跟输入相同的
        if (!keys.length) {
            res = mFilter(res[1], (key) => key.replace(/'/g, '').indexOf(pinyin) === 0)
            keys = res[0]
        }

        //首拼字母
        if (!keys.length) {
            rex = new RegExp(`^${pinyin.split('').join('\\w*?\'?')}[^']*`);
            res = mFilter(res[1], (key) => rex.test(key))
            keys = res[0].sort()
        }

        for (const item of keys) {
            if (hs.length >= 100) break
            hs.push(...dict[item])
        }

        let zkey = keys[0]
        if (zkey) {
            let offset = 0
            for (let i = 0; i < zkey.length; i++) {
                if (zkey[i] === pinyin[i - offset]) {
                    key += zkey[i]
                } else {
                    if (zkey[i] === "'") {
                        key += zkey[i]
                    }
                    offset++
                }
            }
            key = key.replace(/'$/, '')
        } else {
            key = pinyin
        }

    }

    return { key, hs }
}