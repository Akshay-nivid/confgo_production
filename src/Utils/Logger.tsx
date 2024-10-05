
/*
*@sarath
logger
There are 4 types of log
DEBUGG
INFO
WARN
ERROR
Will trigger this based on the level setup in the local storage
*/
enum LogTypes { DEBUG = 1, INFO = 2, WARN = 3, ERROR = 4 };
const LogTypeText: any = { 1: "DEBUG", 2: "INFO", 3: "WARN", 4: "ERROR" };

export class Logger {

    static StartTime: any = new Date().getTime();
    static resetStartTime() {
        this.StartTime = new Date().getTime();
    }
    static errorLevel() {
        //read error from global
        return 4;
    }

    //debug
    static debug(...log: any) {
        if (this.errorLevel() <= LogTypes.DEBUG) {
            this._log(LogTypes.DEBUG, log)
        }
    }

    //info
    static info(...log: any) {
        if (this.errorLevel() <= LogTypes.INFO) {
            this._log(LogTypes.INFO, log)
        }
    }

    //warn
    static warn(...log: any) {
        if (this.errorLevel() <= LogTypes.WARN) {
            this._log(LogTypes.WARN, log)
        }
    }

    //error
    static error(...log: any) {
        if (this.errorLevel() <= LogTypes.ERROR) {
            this._log(LogTypes.ERROR, log)
        }
    }
    // 18/01/2021, 12:31:29 [DEBUG] <1974ms>  (2) [App.tsx]: Application started
    // globally set logger level
    // reset time
    // 2021-01-02 09:08:11 [ERROR] [Auth] <1ms> Message here. {{ args }}
    static _log(type: any, params: any) {
        try {

            let log: any = new Date().toLocaleString() + " [" + LogTypeText[type] + "] <" + (new Date().getTime() - Logger.StartTime) + "ms> "
            if (Array.isArray(params)) {
                log += "[" + params[0] + "]"
                params.splice(0, 1);
            }
            switch (type) {
                case LogTypes.DEBUG:
                    console.log(log, ...params)
                    break;
                case LogTypes.INFO:
                    console.info(log, ...params)
                    break;
                case LogTypes.WARN:
                    console.warn(log, ...params)
                    break;
                case LogTypes.ERROR:
                    console.error(log, ...params)
                    //call API
                    break;

            }
        }
        catch (e) { }
    }

}
Logger.debug("Logger.tsx", "Initializing the logger")