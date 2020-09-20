import { Node, NodeDef, nodes } from "node-red"
import { WebDriver } from "selenium-webdriver";
import { WD2Manager } from "../wd2-manager";
import { SeleniumMsg, SeleniumNode } from "./node";

export interface NodeCloseWebDef extends NodeDef, SeleniumNode {
 
}

export interface NodeCloseWeb extends Node<any> {
}

export function NodeCloseWebConstructor (this : NodeCloseWeb, conf : NodeCloseWebDef) {
    WD2Manager.RED.nodes.createNode(this, conf);
    this.status({});    
    
    this.on("input", async (message : any, send, done) => {
        // Cheat to allow correct typing in typescript
        let msg : SeleniumMsg = message;

        if (null === msg.driver) {
            let error = new Error("Can't use this node without a working open-web node first");
            this.status({ fill : "red", shape : "ring", text : "error"});
            done(error);
        } else {
            this.status({ fill : "blue", shape : "ring", text : "waiting"});
            setTimeout(async () => {
                try {
                    this.status({ fill : "blue", shape : "ring", text : "closing"});
                    await msg.driver?.quit();
                    msg.driver = null;
                    this.status({ fill : "green", shape : "dot", text : "closed"});
                    send([msg, null]);
                    done();
                } catch (e) {
                    this.warn("Can't close the browser, check msg.error for more information")
                    msg.error = e;
                    this.status({ fill : "red", shape : "dot", text : "error"});
                    send([null, msg]);
                    done();
                }
            }, conf.waitFor || msg.waitFor || 0);
        }    
    });
}