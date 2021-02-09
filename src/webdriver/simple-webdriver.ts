import { WebElement } from "./webdriver";
import { HttpResponse } from "./utils/http-client";
import { WindowRect, ElementDef, SessionDef, TimeoutsDef, WDAPIDef, ResponseDef, CookieDef} from "./interface"
import * as wdapi from "./api";
import { LocationError, WebDriverResponseError } from "./errors";
import { Capabilities } from "./capabilities";
import { RequestDef } from "./interface/request";
import { Logger } from "./utils/logger";
import { WebDriverError } from "./error/webdriver-error";

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

export enum Browser {
    Chrome = "chrome",
    Chromium = "chromium",
    Edge = "edge",
    Firefox = "firefox",
    Safari = "safari",
}

export enum Protocol {
    W3C = "W3C",
    JSONWire = "JSONWire"
}

export class SimpleWebDriver {

    private static _supportedBrowser : string[] = [
        'chrome',
        'chromium',
        'edge',
        "firefox",
        "safari",
    ];

    private _api : WDAPIDef;

    private _session? : string;

    private _w3c : boolean;

    public get session() {
        return this._session;
    }

    private _serverURL : URL;
    public get serverURL() {
        return this._serverURL;
    }

    public capabilities = new Capabilities();

    private _timeouts : TimeoutsDef;

    public get timeouts() : TimeoutsDef {
        return this._timeouts;
    }

    private _browserName : Browser;
    public get browserName() {
        return this._browserName;
    }
    /**
     * Create a SimpleWebDriver object which allows to interact with a webdriver server
     * @param serverURL The URL of the webdriver server
     * @param browser The type of browser (see Browser enum)
     * @param protocol The type of protocol (see Protocol enum)
     */

    public constructor(serverURL : string, browser : Browser = Browser.Chrome, protocol : Protocol = Protocol.W3C) {
        this._serverURL = new URL(serverURL);
        if (this.serverURL.protocol !== 'http:' && this.serverURL.protocol !== 'https:') {
            let err = new TypeError("Invalid Protocol: Webdriver only supports http or https");
            throw (err);
        }
        if (!SimpleWebDriver._supportedBrowser.find(elem => {return (browser === elem)})) {
            let err = new TypeError("Invalid Browser: unsupported browser " + browser);
            throw (err);
        }
        this._browserName = browser;
        this._api = new wdapi[protocol]();
    }

    /**
     * Launch a new Webdriver Session (if needed) and navigate to the url page
     * @param url 
     */
    public async get(url : string) : Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            try { 
                if (this._session || await this.start()) {
                        await this.navigate().to(new URL(url).href);
                }
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Allow to access windows capabilities, if no handle is provided, it will modify the current context
     * @param handle 
     */
    public window(handle : string = null) {
        return {
            /**
             * 
             */
            getTitle : async () => {
                return new Promise<string> (async (resolve, reject) => {
                    let resp = wdapi.call<string>(this.serverURL, this._api.WINDOW_GETTITLE(this.session, handle)).then( resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                });                  
            },
            setSize : async (width : number, height : number) => {
                return new Promise<WindowRect> (async (resolve, reject) => {
                    wdapi.call<WindowRect>(this.serverURL, this._api.WINDOW_SETRECT(this.session, handle, width, height)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                })
            },
            maximize : async () => {
                return new Promise<WindowRect> (async (resolve, reject) => {
                    wdapi.call<WindowRect>(this.serverURL, this._api.WINDOW_MAXIMIZE(this.session, handle)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                })       
            },
            minimize : async () => {
                return new Promise<WindowRect> (async (resolve, reject) => {
                    wdapi.call<WindowRect>(this.serverURL, this._api.WINDOW_MINIMIZE(this.session, handle)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                })                    
            },
            fullscreen : async () => {
                return new Promise<WindowRect> (async (resolve, reject) => {
                    wdapi.call<WindowRect>(this.serverURL, this._api.WINDOW_FULLSCREEN(this.session, handle)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                })                  
            },
            screenshot : async () => {
                return new Promise<string> (async (resolve, reject) => {
                    wdapi.call<string>(this.serverURL, this._api.WINDOW_SCREENSHOT(this.session)).then(resp => {
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
                    wdapi.call<any>(this.serverURL, this._api.NAVIGATE_REFRESH(this.session)).then(resp => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                })
            },
            to : (url : string) => {
                return new Promise<void> (async (resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.NAVIGATE_TO(this.session, url)).then(resp => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                })
            },
            back : () => {
                return new Promise<void> (async (resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.NAVIGATE_BACK(this.session)).then(resp => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                })
            },            
            forward : () => {
                return new Promise<void> (async (resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.NAVIGATE_FORWARD(this.session)).then(resp => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                })
            },
        }
    }

    public element(element : WebElement = null) {
        let elementId = element.toString();
        return {
            click : () => {
                return new Promise<void> (async (resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.ELEMENT_CLICK(this.session, elementId)).then(resp => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                })
            },
            clear : () => {
                return new Promise<void> (async (resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.ELEMENT_CLEAR(this.session, elementId)).then(resp => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                })
            },
            sendKeys : (keys : string) => {
                return new Promise<void> (async (resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.ELEMENT_SENDKEYS(this.session, elementId, keys)).then(resp => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                })
            },
            getValue : () => {
                return new Promise<string> ((resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.ELEMENT_GETATTRIBUTE(this.session, elementId, "value")).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                });
            },
            getText : () => {
                return new Promise<string> (async (resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.ELEMENT_GETTEXT(this.session, elementId)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                })
            },
            getAttribute : (name : string) => {
                return new Promise<string> ((resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.ELEMENT_GETATTRIBUTE(this.session, elementId, name)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                });
            },
            getProperty : (name : string) => {
                return new Promise<string> ((resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.ELEMENT_GETPROPERTY(this.session, elementId, name)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                });
            },
            getTagName : () => {
                return new Promise<string> ((resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.ELEMENT_GETTAGNAME(this.session, elementId)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                });
            },
            isSelected : () => {
                return new Promise<boolean> ((resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.ELEMENT_ISSELECTED(this.session, elementId)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                });
            },
            isEnabled : () => {
                return new Promise<boolean> ((resolve, reject) => {
                    wdapi.call<any>(this.serverURL, this._api.ELEMENT_ISENABLED(this.session, elementId)).then(resp => {
                        resolve(resp.body.value);
                    }).catch(err => {
                        reject(err);
                    });
                });
            }
        }
    }

    public cookies() {
        return {
            getAll : () => {

            },
            get : (name : string) => {

            },
            add : (cookie : CookieDef) => {

            },
            delete : (name : string) => {

            },
            deleteAll : () => {

            }
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
                let resp : HttpResponse<ResponseDef<ElementDef>>;
                let script = "";
                let request : RequestDef;
                let error;
                switch (using) {
                    case Using.id :
                        script = "return document.getElementById(arguments[0]);"
                    case Using.className :
                    case Using.name  :
                        script = (script !== "") ? script : "return document.getElementsBy" + using.charAt(0).toUpperCase() + using.slice(1) + "(arguments[0])[0];"
                        request = this._api.EXECUTE_SYNC(this.session, script, [ value ]);
                    break;
                    default:
                        request = this._api.FINDELEMENT(this.session, using, value);
                    break;
                }
                do {
                    try {
                        resp = await wdapi.call<ElementDef>(this.serverURL, request);
                    } catch (err) {
                        error = err;
                        resp = err.httpResponse;
                        Logger.trace(resp);
                    }
                } while ((resp.body.value === null || resp.statusCode !== 200 ) && timer)
                if (resp.statusCode === 200 && resp.body.value) {
                    const element = new WebElement(this, resp.body.value[Object.keys(resp.body.value)[0]])
                    resolve(element);
                } else {
                    if (resp.statusCode === 404)
                        reject (new LocationError(using, value, timeout));
                    else
                        reject (error);
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
            wdapi.call<any>(this.serverURL, this._api.EXECUTE_SYNC(this.session, script, args)).then(resp => {
                resolve(resp.body.value);
            }).catch(err => {
                reject(err);
            });
        });
    }

    // eslint-disable-next-line
    public async executeAsync(script : string | Function, ...args : any[]) {
        return new Promise<any> (async (resolve, reject) => {
            if (typeof script !== "string")
                script = 'return (' + script + ').apply(null, arguments);'
            wdapi.call<any>(this.serverURL, this._api.EXECUTE_ASYNC(this.session, script, args)).then(resp => {
                resolve(resp.body.value);
            }).catch(err => {
                reject(err);
            });
        }); 
    }

    public wait (...args : any []) {
        throw new Error("Unsupported");
    }

    public async start() : Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            try {
                // If session is already started
                if (this.session)
                    reject(new WebDriverError("can't start Webdriver session which is already started"))
                else {
                    const resp = await wdapi.call<SessionDef>(this.serverURL, this._api.SESSION_START(this._browserName, this.capabilities.headless));
                    let error : WebDriverResponseError;
                    if (!resp.body.value) {
                        error = new WebDriverResponseError(resp);
                        error.message = "Response is empty or null"                        
                    } else {
                        if (!resp.body.value.sessionId) {
                            error = new WebDriverResponseError(resp);
                            error.message = "Missing property sessionId"
                        } else if (!resp.body.value.capabilities) {
                            error = new WebDriverResponseError(resp);
                            error.message = "Missing property capabilities"
                        } else if (!resp.body.value.capabilities.timeouts) {
                            error = new WebDriverResponseError(resp);
                            error.message = "Missing property timeouts"
                        }
                    }
                    if (error) {
                        reject(error);
                    }
                    this._session = resp.body.value.sessionId;
                    this._timeouts = resp.body.value.capabilities.timeouts;
                    resolve(true);
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    public async stop() : Promise<void> {
        return new Promise<void> (async (resolve, reject) => {
            if (!this.session) {
                reject(new WebDriverError("start must be called first"))
            } else {
                wdapi.call<any>(this.serverURL, this._api.SESSION_STOP(this.session)).then(resp => {
                    this._session = null;
                    resolve();
                }).catch(err => {
                    reject(err);
                });
            }
        });
    }
}