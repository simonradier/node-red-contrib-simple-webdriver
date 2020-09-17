import { Node, NodeDef, nodes } from "node-red"
import { until, WebDriver } from "selenium-webdriver";
import { WD2Manager } from "../wd2-manager";
import { SeleniumMsg, SeleniumNode } from "./node";

export interface NodeOpenWebDef extends NodeDef, SeleniumNode {
    serverURL : string;
    name : string;
    browser : string;
    webURL : string;
    width : number;
    heigth : number;
    webTitle : string;
    timeOut : number;
    maximized : boolean;
    headless : boolean; 
}

export interface NodeOpenWeb extends Node<any> {

}

export function NodeOpenWebConstructor (this : NodeOpenWeb, conf : NodeOpenWebDef) {
    WD2Manager.RED.nodes.createNode(this, conf);
    this.status({});      
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
            this.log("error");
            console.log(error);
        });
    }
    this.on("input", async (message : any, send, done) => {
        // Cheat to allow correct typing in typescript
        let msg : SeleniumMsg = message;
        let driverError = false;

        msg.driver = WD2Manager.getDriver(conf);

        this.status({ fill : "blue", shape : "ring", text : "opening browser"});
        try {
            await msg.driver.get(conf.webURL);
        } catch (e) {
            msg.driver = null;
            this.error("Can't open an instance of " + conf.browser);
            this.status({ fill : "red", shape : "ring", text : "launch error"});
            driverError = true;
            msg.driver = null;
            done(e);
        }
        try {
            if (msg.driver) {
                if (!driverError)
                    if (!conf.headless)
                        if (!conf.maximized)
                            await msg.driver.manage().window().setSize(conf.width, conf.heigth);
                        else
                            await msg.driver.manage().window().maximize();
                if (conf.webTitle && conf.webTitle != "") {
                    try {
                        await msg.driver.wait(until.titleIs(conf.webTitle), conf.timeout || 3000);
                        send([msg, null]);
                        this.status({ fill : "green", shape : "dot", text : "success"});
                        done();
                    } catch (e) {
                        let error = { message : "Title has not the correct value", expected : conf.webTitle, found : await msg.driver.getTitle()}
                        this.warn(error.message);
                        msg.error = error;
                        this.status({ fill : "yellow", shape : "dot", text : "wrong title"});
                        send([null, msg]);
                        done();
                    }
                } else {
                    send([msg, null]);
                    this.status({ fill : "green", shape : "dot", text : "success"});
                    done();
                }
            }
        } catch (e) {
            this.error("Can't resize the instance of " + conf.browser);
            this.status({ fill : "red", shape : "ring", text : "resize error"});
            driverError = true;
            done(e);            
        }
    });
}