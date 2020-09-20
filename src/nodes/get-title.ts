import { Node, NodeDef, nodes } from "node-red"
import { until } from "selenium-webdriver";
import { WD2Manager } from "../wd2-manager";
import { SeleniumMsg, SeleniumNode } from "./node";

export interface NodeGetTitleDef extends NodeDef, SeleniumNode {
    webTitle : string;
}

export interface NodeGetTitle extends Node<any> {
}

export function NodeGetTitleConstructor (this : NodeGetTitle, conf : NodeGetTitleDef) {
    WD2Manager.RED.nodes.createNode(this, conf);
    this.status({});    
    
    this.on("input", async (message : any, send, done) => {
        // Cheat to allow correct typing in typescript
        let msg : SeleniumMsg = message;
        this.status({});    
        if (msg.driver == null) {
            let error = new Error("Open URL must be call before any other action. For node : " + conf.name);
            this.status({ fill : "red", shape : "ring", text : "error"});
            done(error);
        } else { 
            let webTitle = msg.webTitle || conf.webTitle;
            let waitFor = msg.waitFor || conf.waitFor;
            let timeout = msg.timeout || conf.timeout;
            setTimeout (async () => {
                if (webTitle && webTitle != "") {
                    try {
                        await msg.driver.wait(until.titleIs(webTitle), timeout);
                        send([msg, null]);
                        this.status({ fill : "green", shape : "dot", text : "success"});
                        done();
                    } catch (e) {
                        msg.webTitle = await msg.driver.getTitle();
                        let error = { message : "Browser windows title does not have the expected value", expected : webTitle, found : msg.webTitle}
                        this.warn(error.message);
                        msg.error = error;
                        this.status({ fill : "yellow", shape : "dot", text : "wrong title"});
                        send([null, msg]);
                        done();
                    }
                } else {
                    try {
                        msg.webTitle = await msg.driver.getTitle();
                        this.status({ fill : "green", shape : "dot", text : "success"});
                        if (msg.error) { delete msg.error; }
                        send([msg, null]);
                        done();
                    } catch (e) {
                        msg.webTitle == null;
                        this.status({ fill : "red", shape : "dot", text : "error"});
                        this.error("Can'g get title of the browser window. Check msg.error for more information");
                        done (e);
                    }
                }
            }, waitFor);    
        }
    });
}