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
    maximized : boolean;
    headless : boolean; 
}

export interface NodeOpenWeb extends Node<any> {

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
            this.log("error");
            console.log(error);
        });
    }
    this.on("input", async (message : any, send, done) => {
        // Cheat to allow correct typing in typescript
        let msg : SeleniumMsg = message;
        let node = this;
        let driverError = false;
        msg.driver = WD2Manager.getDriver(conf);
        this.status({ fill : "blue", shape : "ring", text : "opening browser"});
        try {
            await msg.driver.get(conf.webURL);
        } catch (e) {
            msg.driver = null;
            node.error("Can't open an instance of " + conf.browser);
            node.status({ fill : "red", shape : "ring", text : "launch error"});
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
                send(msg);
                console.log((await msg.driver.getSession()).toJSON());
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