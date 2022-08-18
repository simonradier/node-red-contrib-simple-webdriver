import { Capabilities, WebDriver, Protocol, BrowserType} from "@critik/simple-webdriver";
import { checkIfOnline as checkIfReachable, REDAPI, replaceMustache } from "../utils";
import { WebDriverMessage, SeleniumNode, SeleniumNodeDef } from "./node";

// tslint:disable-next-line: no-empty-interface
export interface NodeOpenBrowserDef extends SeleniumNodeDef {
    serverURL : string;
    name : string;
    browserType : BrowserType;
    webURL : string;
    width : string;
    height : string;
    maximized : boolean;
    headless : boolean;
    args: string[];
}

// tslint:disable-next-line: no-empty-interface
export interface NodeOpenWeb extends SeleniumNode {

}

export function NodeOpenBrowserConstructor (this : NodeOpenWeb, conf : NodeOpenBrowserDef) {
    REDAPI.get().nodes.createNode(this, conf);

    if (!conf.serverURL) {
        this.log("Webdriver server URL is undefined");
        this.status({ fill : "red", shape : "ring", text : "no server defined"});
    } else {
        checkIfReachable(conf.serverURL).then ((result) => {
            if (result) {
                this.log(conf.serverURL + " is reacheable by Node-red");
                this.status({ fill : "green", shape : "ring", text : conf.serverURL + ": reachable"});
            } else {
                this.log(conf.serverURL + " is not reachable by Node-red");
                this.status({ fill : "red", shape : "ring", text : conf.serverURL + ": unreachable"});
            }
        }).catch ((error) => {
            this.log(error);
        });
    }
    this.on("input", async (message : any, send, done) => {
        // Cheat to allow correct typing in typescript
        const msg : WebDriverMessage = message;
        const node = this;
        let driverError = false;
        let driver = new WebDriver(conf.serverURL, Protocol.W3C);
        let capabilities = new Capabilities()
        capabilities.args = conf.args;
        let webURL = replaceMustache(conf.webURL, msg)
        this.status({ fill : "blue", shape : "ring", text : "opening browser"});
        try {
            msg.browser = await driver.start(conf.browserType, capabilities);
            try {
                await msg.browser.navigate().to(webURL);
            } catch (e) {
                node.error("Can't navitage to " + webURL);
                node.status({ fill : "yellow", shape : "dot", text : "navigate error"});
                done(e);    
            }
        } catch (e) {
            msg.browser = null;
            node.error("Can't open an instance of " + conf.browserType);
            node.status({ fill : "red", shape : "ring", text : "launch error"});
            driverError = true;
            done(e);
        }
        try {
            if (msg.browser) {
                if (!driverError) {
                    let window = await msg.browser.getCurrentWindow()
                    if (!conf.maximized)
                        await window.setSize(parseInt(conf.width, 10), parseInt(conf.height, 10));
                    else if (!conf.headless)
                        await window.maximize();
                }
                send(msg);
                this.status({ fill : "green", shape : "dot", text : "success"});
                done();
            }
        } catch (e) {
            node.error("Can't resize the instance of " + conf.browserType);
            node.status({ fill : "yellow", shape : "dot", text : "resize error"});
            driverError = true;
            done(e);
        }
    });
}