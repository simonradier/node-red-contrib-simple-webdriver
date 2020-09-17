import { NodeAPI, NodeAPISettingsWithData, server } from "node-red";
import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import * as firefox from "selenium-webdriver/firefox";
import { NodeOpenWebDef } from "./nodes/node";
import { portCheck } from "./utils";

export class WD2Manager {
    private static _RED : NodeAPI<NodeAPISettingsWithData>;
    private static _serverURL : string = "";
    private static _driverList : Array<WebDriver> = new Array<WebDriver>();

    public static get RED () {
        return WD2Manager._RED;
    }

    public static init (RED : NodeAPI<NodeAPISettingsWithData>) : void {
        //this._driver = new WebDriver();
        WD2Manager._RED = RED;
    }

    /**
     * Define the configuration of the Selenium Server and return a boolean if the server is reacheable
     * @param serverURL 
     * @param browser 
     */
    public static async setServerConfig(serverURL : string) : Promise<boolean> {
        WD2Manager._serverURL = serverURL;
        let server = serverURL.match(/\/\/([a-z0-9A-Z.:-]*)/)?.[1];
        if (!server)
            return new Promise((resolve) => resolve(false));
        let host = server.split(":")[0];
        let port = server.split(":")[1] || "80";
        return portCheck(host, Number.parseInt(port)); 
    }

    public static getDriver(conf : NodeOpenWebDef) : WebDriver {
        let builder = new Builder().forBrowser(conf.browser).usingServer(conf.serverURL);
        if (conf.headless) {
            let width = conf.width;
            let height = conf.heigth;
            switch (conf.browser) {
                case 'firefox' :
                    builder = builder.setFirefoxOptions(
                        new firefox.Options().headless().windowSize({width, height}));
                break;     
                case 'chrome' :
                    builder = builder.setChromeOptions(
                        new chrome.Options().headless().windowSize({width, height}));
                break;    
                default :
                    WD2Manager._RED.log.warn("unsupported headless configuration for" + conf.browser);
                break;      
            }
        }
        let driver = builder.build();
        WD2Manager._driverList.push(driver);

        return driver;
    } 

}