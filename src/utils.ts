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

export function replaceMustache(str : string, obj : any) {
    let mustache = str.match(/\{\{(.*)\}\}/g)
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