import { NAVIGATE_BACK, NAVIGATE_FORWARD, NAVIGATE_REFRESH, NAVIGATE_TO, STARTSESSION, MAXIMIZE, webDriverCall, SETSIZE, STOPSESSION } from "./api";

class Capabilities {
    public headless : boolean = false;
    public args : Array<string> = new Array<string>();
    public addArguments (arg : string) {
        this.args.push(arg);
    }
}

export class SimpleDriver {
    private _session? : string;

    public get session() {
        return this._session;
    }
    
    private _serverURL : string;
    public get serverURL() {
        return this._serverURL;
    }

    public capabilities = new Capabilities();

    private _browserName : string;
    public get browserName() {
        return this._browserName;
    }

    public constructor (serverURL : string, browserName : string) {
        this._serverURL = serverURL;
        this._browserName = browserName;
    }

    /**
     * Launch a new Webdriver Session and navigate to the url page
     * @param url 
     */
    public async get(url : string) : Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            if (this._session || await this._startSession(url)) {
                await this.navigate().to(url);
                resolve();
            } else {
                reject (new Error("Can't open session"));
            }
        });
    }

    public async maximize() : Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            let resp = await webDriverCall<any>(this.serverURL, MAXIMIZE(this.session));
            resolve();
        });     
    }

    public async setSize(width : number, height : number) : Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            let resp = await webDriverCall<any>(this.serverURL, SETSIZE(this.session, width, height));
            resolve();
        });     
    }

    public navigate() {
        return {
            refresh : () => {
                return new Promise<void> (async (resolve, reject) => {
                    let resp = await webDriverCall<any>(this.serverURL, NAVIGATE_REFRESH(this.session));
                    resolve();
                }); 
            },
            to : (url : string) => {
                return new Promise<void> (async (resolve, reject) => {
                    let resp = await webDriverCall<any>(this.serverURL, NAVIGATE_TO(this.session, url));
                    resolve();
                }); 
            },
            back : () => {
                return new Promise<void> (async (resolve, reject) => {
                    let resp = await webDriverCall<any>(this.serverURL, NAVIGATE_BACK(this.session));
                    resolve();
                }); 
            },            
            forward : () => {
                return new Promise<void> (async (resolve, reject) => {
                    let resp = await webDriverCall<any>(this.serverURL, NAVIGATE_FORWARD(this.session));
                    resolve();
                }); 
            },
        }
    }

    protected async _startSession(url : string) : Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            let resp = await webDriverCall<any>(this.serverURL, STARTSESSION(this._browserName, this.capabilities.headless));
            this._session = resp.body.sessionId;
            resolve(true);
        });
    }

    public async quit() : Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            let resp = await webDriverCall<any>(this.serverURL, STOPSESSION(this.session));
            resolve();
        });  
    }
}