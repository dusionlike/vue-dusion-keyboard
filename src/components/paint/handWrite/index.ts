import WebHandWrite from "./web";
import LocalHandWrite from "./electron";
import { globalConfig } from '@/components/globalConfig';

interface HWOption {
    /**接口地址 */
    handWriteApi?: string
    /**dll目录 */
    dllPath?: string
}

export function getHandWrite(option: HWOption = {}): HandWrite {
    option = { ...option, ...globalConfig }
    if (option.handWriteApi) {
        return new WebHandWrite(option.handWriteApi)
    } else {
        return new LocalHandWrite(option.dllPath)
    }
}

export interface HandWrite {
    /**装载字体库 */
    createLib: (lib: string) => Promise<boolean>
    /**
     * 获取候选文字
     * 参数：lpXis, lpYis：关键点数组;lpCis:标志位数组，每一笔的最后一个关键点为1，其余为0
     * 返回：候选字数组
     */
    GetWords: (lpXis: number[], lpYis: number[], lpCis: number[]) => Promise<string[]>
}