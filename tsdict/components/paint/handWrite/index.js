import WebHandWrite from "./web";
import LocalHandWrite from "./electron";
let hwOption;
export function SET_API_PATH(option) {
    hwOption = option;
}
export function getHandWrite(option) {
    option = option || hwOption || {};
    if (option.handWriteApi) {
        return new WebHandWrite(option.handWriteApi);
    }
    else {
        return new LocalHandWrite(option.dllPath);
    }
}
