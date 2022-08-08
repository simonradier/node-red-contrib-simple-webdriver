import { Socket } from "net";
import { NodeAPI, NodeAPISettingsWithData } from "node-red";

function getValueFromPropertyNameRec(obj : any, listProp : string[])
{
    let res = obj;
    for (const prop of listProp) {
        res = res[prop];
        if (!res)
            break;
    }
    return res;
}

export class WaitForError extends Error {
    value : any
    name : string = "WaitForError"
}

export function replaceMustacheByVar (str :string, msg : any) {
    if (typeof str !== "string")
        return str;
    if (str.match(/^\{\{.*\}\}$/g)) { // if the string is in double brackets like {{ foo }}
        const s = str.substring(2, str.length - 2);
        const v =  s.split(".");
        if (v.length < 2)
            return str;
        switch (v[0]) {
            case 'msg' :
                return getValueFromPropertyNameRec(msg, v.splice(1, v.length));
            break;
            default:
                return str;
            break;
        }

    } else {
        return str;
    }
}

export async function waitForValue<T>(param: any [], func : (...args) => Promise<T>, expectedValue : T, timeout : number) : Promise<T> {
    return new Promise<T> ( async (resolve, reject) => {
        setTimeout(() => {
            let err = new WaitForError()
            err.message = "Cannot resolve expected value : " + value
            err.value = value
            reject (err)
        }, timeout)

        let value : T
        do {
            value = await func(param)
        } while (value == expectedValue)
        resolve(value);
    })
}

export async function checkIfOnline(url_string : string) : Promise<boolean> {
    const url : URL = new URL(url_string)
    const host = url.hostname
    const port = Number.parseInt(url.port)
    return new Promise<boolean> ((resolve, reject) => {
        const socket = new Socket();
        let status : boolean = false;
        // Socket connection established, port is open
        socket.on('connect', () => {
            status = true;
            socket.end();});
        socket.setTimeout(2000);// If no response, assume port is not listening
        socket.on('timeout', () => {
            socket.destroy();
            resolve(status);
        });
        socket.on('error', (exception) => {resolve(status)});
        socket.on('close', (exception) => {resolve(status)});
        socket.connect(port, host);
    });
}

export function checkIfCritical(error : Error) : boolean {
    // Blocking error in case of "WebDriverError : Failed to decode response from marionett"
    if (error.toString().includes("decode response"))
        return true;
    // Blocking error in case of "NoSuchSessionError: Tried to run command without establishing a connection"
    if (error.name.includes("NoSuchSessionError"))
        return true;
    // Blocking error in case of "ReferenceError" like in case of msg.driver is modified
    if (error.name.includes("ReferenceError"))
        return true;
    // Blocking error in case of "TypeError" like in case of msg.driver is modified
    if (error.name.includes("TypeError"))
        return true;
    return false;
}

let p_REDAPI : NodeAPI<NodeAPISettingsWithData> 
export class REDAPI {
    private static instance : NodeAPI<NodeAPISettingsWithData>

    public static get () : NodeAPI<NodeAPISettingsWithData> {
        return REDAPI.instance
    }

    public static set (redAPI : NodeAPI<NodeAPISettingsWithData>) : void {
        REDAPI.instance = redAPI
    }
}
