import { Socket } from "net";

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

export function replaceMustache(str : string, obj : any) {
    const mustache = str.match(/\{\{(.*)\}\}/g)
}

export function replaceVar (str :string, msg : any) {
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

export async function portCheck(host : string, port : number) : Promise<boolean> {
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