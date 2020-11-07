import { SESSION, webDriverCall } from "./api";

export class SimpleDriver {
    private _session? : string;

    
    public get session() {
        return this._session;
    }
    
    private _serverURL : string;
    public get serverURL() {
        return this._serverURL;
    }

    private _capabilities : any;

    private _browserName : string;


    public constructor (serverURL : string, browserName : string) {
        this._serverURL = serverURL;
        this._browserName = browserName;
    }

    public async get(url : string) : Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            if (this._session || await this._startSession()) {
                resolve();
            } else {
                reject (new Error("Can't open session"));
            }
        });
    }


    protected async _startSession() : Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            let resp = await webDriverCall(this.serverURL, SESSION(this._browserName));
            resolve(true);
            console.log(resp);
        });
    }
}