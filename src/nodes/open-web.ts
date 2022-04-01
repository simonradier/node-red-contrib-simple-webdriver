import { WD2Manager } from "../wd2-manager";
import { Browser, Capabilities, WebDriver } from "@critik/simple-webdriver";
import { SeleniumMsg, SeleniumNode, SeleniumNodeDef } from "./node";
import { Protocol } from "@critik/simple-webdriver/dist/webdriver";
import { BrowserType } from "@critik/simple-webdriver/dist/browser";

// tslint:disable-next-line: no-empty-interface
export interface NodeOpenWebDef extends SeleniumNodeDef {
    serverURL : string;
    name : string;
    browser : BrowserType;
    webURL : string;
    width : string;
    height : string;
    maximized : boolean;
    headless : boolean;
}

// tslint:disable-next-line: no-empty-interface
export interface NodeOpenWeb extends SeleniumNode {

}

export function NodeOpenWebConstructor (this : NodeOpenWeb, conf : NodeOpenWebDef) {
    WD2Manager.RED.nodes.createNode(this, conf);

    if (!conf.serverURL) {
        this.log("Selenium server URL is undefined");
        this.status({ fill : "red", shape : "ring", text : "no server defined"});
    } else {
        WD2Manager.setServerConfig(conf.serverURL).then ((result) => {
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
        const msg : SeleniumMsg = message;
        const node = this;
        let driverError = false;
        let driver = new WebDriver(conf.serverURL, Protocol.W3C);
        let capabilities = conf.headless ? Capabilities.headless : Capabilities.default;
        msg.browser = await driver.start(conf.browser ,capabilities);
        this.status({ fill : "blue", shape : "ring", text : "opening browser"});
        try {
            await msg.driver.get(conf.webURL);
        } catch (e) {
            msg.driver = null;
            node.error("Can't open an instance of " + conf.browser);
            node.status({ fill : "red", shape : "ring", text : "launch error"});
            driverError = true;
            done(e);
        }
        try {
            if (msg.driver) {
                if (!driverError)
                    if (!conf.maximized)
                        await msg.driver.window().current().setSize(parseInt(conf.width, 10), parseInt(conf.height, 10));
                    else if (!conf.headless)
                        await msg.driver.window().current().maximize();
                send(msg);
                this.status({ fill : "green", shape : "dot", text : "success"});
                done();
            }
        } catch (e) {
            node.error("Can't resize the instance of " + conf.browser);
            node.status({ fill : "red", shape : "ring", text : "resize error"});
            driverError = true;
            done(e);
        }
    });
}