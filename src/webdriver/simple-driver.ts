import { WebElement } from "./webdriver";
import { HttpResponse } from "./utils/http-client";
import { WindowRect, Element, Session } from "./interface/interface"
import * as wdapi from "./wd-api";

class Capabilities {
    public headless : boolean = false;
    public args : Array<string> = new Array<string>();
    public addArguments (arg : string) {
        this.args.push(arg);
    }
}

export enum Using {
    id = "id",
    name = "name",
    className = "className",
    link = "link text",
    partialLink = "partial link text",
    css = "css selector",
    tag = "tag name",
    xpath = "xpath"
}

interface iTimeouts {
    implicit : number;
    pageLoad : number;
    script : number;
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

    private _timeouts : iTimeouts;

    public get timeouts() : iTimeouts {
        return this._timeouts;
    }

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
                try {
                    await this.navigate().to(url);
                    resolve();
                }
                catch (err) {
                    resolve();
                }
            } else {
                reject (new Error("Can't open session"));
            }
        });
    }

    public async getTitle() {
        return new Promise<string> (async (resolve, reject) => {
            let resp = wdapi.call<string>(this.serverURL, wdapi.GETTITLE(this.session)).then( resp => {
                resolve(resp.body.value);
            }).catch(err => {
                reject(err);
            });
        });                  
    }

    public window() {
        return {
            setSize : async (width : number, height : number) => {
                return new Promise<WindowRect> (async (resolve, reject) => {
                    wdapi.call<WindowRect>(this.serverURL, wdapi.SETSIZE(this.session, width, height)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                })
            },
            maximize : async () => {
                return new Promise<WindowRect> (async (resolve, reject) => {
                    wdapi.call<WindowRect>(this.serverURL, wdapi.MAXIMIZE(this.session)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                })       
            },
            minimize : async () => {
                return new Promise<WindowRect> (async (resolve, reject) => {
                    wdapi.call<WindowRect>(this.serverURL, wdapi.MINIMIZE(this.session)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                })                    
            },
            fullscreen : async () => {
                return new Promise<WindowRect> (async (resolve, reject) => {
                    wdapi.call<WindowRect>(this.serverURL, wdapi.FULLSCREEN(this.session)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                })                  
            }
        }
    }

    public navigate() {
        return {
            refresh : () => {
                return new Promise<void> (async (resolve, reject) => {
                    wdapi.call<any>(this.serverURL, wdapi.NAVIGATE_REFRESH(this.session)).then(resp => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                })
            },
            to : (url : string) => {
                return new Promise<void> (async (resolve, reject) => {
                    wdapi.call<any>(this.serverURL, wdapi.NAVIGATE_TO(this.session, url)).then(resp => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                })
            },
            back : () => {
                return new Promise<void> (async (resolve, reject) => {
                    wdapi.call<any>(this.serverURL, wdapi.NAVIGATE_BACK(this.session)).then(resp => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                })
            },            
            forward : () => {
                return new Promise<void> (async (resolve, reject) => {
                    wdapi.call<any>(this.serverURL, wdapi.NAVIGATE_FORWARD(this.session)).then(resp => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                })
            },
        }
    }

    public async findElement(using : Using, value : string, timeout : number = null) : Promise<WebElement> {
        return new Promise<WebElement> (async (resolve, reject) => {
            if (!timeout) {
                timeout = this.timeouts.implicit;
            }
            let timer = true;
            setTimeout(() => timer = false, timeout);
            try {
                let resp
                do {
                    resp = await wdapi.call<Element>(this.serverURL, wdapi.FINDELEMENT(this.session, using, value));
                } while (!resp.body.value.ELEMENT && timer)
                if (resp.body.value.ELEMENT) {
                    let element = new WebElement(this, resp.body.value.ELEMENT)
                    resolve(element);
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    public async executeSync(script : string | Function, ...args: any[]) : Promise<any> {
        return new Promise<any> (async (resolve, reject) => {
            if (typeof script !== "string")
                script = 'return (' + script + ').apply(null, arguments);'
            wdapi.call<any>(this.serverURL, wdapi.EXECUTE_SYNC(this.session, script, args)).then(resp => {
                resolve(resp.body.value);
            }).catch(err => {
                reject(err);
            });
        });
    }


    public async executeAsync(script : string | Function, ...args : any[]) {
        return new Promise<any> (async (resolve, reject) => {
            if (typeof script !== "string")
                script = 'return (' + script + ').apply(null, arguments);'
            wdapi.call<any>(this.serverURL, wdapi.EXECUTE_ASYNC(this.session, script, args)).then(resp => {
                resolve(resp.body.value);
            }).catch(err => {
                reject(err);
            });
        }); 
    }

    public element() {
        return {
            click : (element : WebElement) => {

            }
        }
    }

    public wait (...args : any []) {
        throw new Error("Unsupported");
    }

    public takeScreenshot (...args : any []) : Promise<string> {
        throw new Error("Unsupported");
    }

    protected async _startSession(url : string) : Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            try {
                let resp = await wdapi.call<Session>(this.serverURL, wdapi.STARTSESSION(this._browserName, this.capabilities.headless));
                this._session = resp.body.sessionId;
                this._timeouts = resp.body.value.timeouts;
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    public async quit() : Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            wdapi.call<any>(this.serverURL, wdapi.STOPSESSION(this.session)).then(resp => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        });  
    }
}