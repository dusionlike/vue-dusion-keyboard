import { HandWrite } from "./index";
export default class LocalHandWrite implements HandWrite {
    private static path;
    private zcsids;
    private subRectCbn;
    private ms_lpCodes;
    private ms_lpPssbs;
    private lp16TestLongsCbz;
    private static _dll;
    constructor(basePath?: string);
    /**装载字体库 */
    createLib(lib: string): Promise<boolean>;
    GetWords(lpXis: number[], lpYis: number[], lpCis: number[]): Promise<string[]>;
    private shortsToPtr;
}
