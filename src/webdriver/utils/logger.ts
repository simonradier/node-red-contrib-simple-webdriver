export enum LogLevel {
    Debug = 0,
    Trace,
    Information,
    Warning,
    Error,
    Critical,
    None
}

let Configuration = { logLevel : LogLevel.Debug };

export class Logger {
    constructor () {

    }

    private static _getDateString() : string {
        return new Date().toISOString();

    }

    public static _getCallerInfo() : string {
        //  at [SCOPE].[CLASS].[METHOD] (/Users/critik/Documents/Projects/domobot/src/utils/logger.ts:15:21)
        let strInfo : string = (<string> (new Error().stack)).split("\n")[3].split("at ")[1];
        let leftStr : string = strInfo.split(" (")[0];
        let rightStr : string =  strInfo.split(" (")[1];
        // If no function name
        let rightSplitInfo : string[] = rightStr ? rightStr.split("/") : leftStr.split("/");
        let className :  string = "";
        let methodname : string = "";
        let fileLineNumber : string = "";
        let getInfo : number = 0;
        if (rightStr) {
            methodname = leftStr;
            fileLineNumber = rightSplitInfo[rightSplitInfo.length - 1].split(/:[0-9]*\)/)[0];
        } else {
            methodname = "anonymous";
            fileLineNumber = rightSplitInfo[rightSplitInfo.length - 1].split(/:[0-9]*\)/)[0];
        }
        return methodname + "|" + fileLineNumber;
    }

    public static trace(msg : string) {
        if (Configuration.logLevel <= LogLevel.Trace)
            console.log("[TRACE]" + "[" +this._getDateString() + "][" + this._getCallerInfo() + "] " + msg);
    }

    public static debug(msg : string) {
        if (Configuration.logLevel <= LogLevel.Debug)
            console.log("[DEBUG]" + "[" +this._getDateString() + "][" + this._getCallerInfo() + "] " + msg);
    }

    public static info (msg : string) {
        if (Configuration.logLevel <= LogLevel.Information)
            console.log("[INFO]" + "[" +this._getDateString() + "][" + this._getCallerInfo() + "] " + msg);
    }

    public static warn (msg : string) {        
        if (Configuration.logLevel <= LogLevel.Warning)
            console.log("[WARNING]" + "[" +this._getDateString() + "][" + this._getCallerInfo() + "] " + msg);
    }

    public static error (msg : string) {
        if (Configuration.logLevel <= LogLevel.Error)
            console.log("[ERROR]" + "[" +this._getDateString() + "][" + this._getCallerInfo() + "] " + msg);
    }

    public static critical (msg : string) {
        if (Configuration.logLevel <= LogLevel.Critical)
            console.log("[CRITICAL]" + "[" +this._getDateString() + "][" + this._getCallerInfo() + "] " + msg);
    }

}