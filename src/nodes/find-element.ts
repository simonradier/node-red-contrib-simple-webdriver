import { Node, NodeDef, nodes } from "node-red"
import { By, until, WebDriver } from "selenium-webdriver";
import { WD2Manager } from "../wd2-manager";
import { SeleniumMsg, SeleniumNode, waitForElement } from "./node";

export interface NodeFindElementDef extends NodeDef, SeleniumNode {
}

export interface NodeFindElement extends Node<any> {
}

export function NodeFindElementConstructor (this : NodeFindElement, conf : NodeFindElementDef) {
    WD2Manager.RED.nodes.createNode(this, conf);
    this.status({});    
    
    this.on("input", async (message : any, send, done) => {
        // Cheat to allow correct typing in typescript
        let msg : SeleniumMsg = message;
        let node = this;
        this.status({});    
        if (msg.driver == null) {
            let error = new Error("Open URL must be call before any other action. For node : " + conf.name);
            this.status({ fill : "red", shape : "ring", text : "error"});
            done(error);
        } else {
            waitForElement(conf, msg).subscribe ({
                next (val)  {
                    if (typeof val === "string") {
                        node.status({ fill : "blue", shape : "dot", text : val});
                    } else {
                        msg.element = val;
                    }
                },
                error(err) {
                    node.status({ fill : "yellow", shape : "dot", text : "location error"});
                    msg.error = err;
                    node.error(err.message);
                    send([null, msg]);
                    done();
                },
                complete () {
                    node.status({ fill : "green", shape : "dot", text : "success"});
                    if (msg.error) { delete msg.error };
                    send([msg, null]);
                    done();
                }
            });
        }
    });
}