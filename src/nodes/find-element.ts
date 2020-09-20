import { Node, NodeDef, nodes } from "node-red"
import { By, until, WebDriver } from "selenium-webdriver";
import { WD2Manager } from "../wd2-manager";
import { SeleniumMsg, SeleniumNode } from "./node";

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
        this.status({});    
        if (msg.driver == null) {
            let error = new Error("Open URL must be call before any other action. For node : " + conf.name);
            this.status({ fill : "red", shape : "ring", text : "error"});
            done(error);
        } else {
            let waitFor : number = msg.waitFor || conf.waitFor;
            let timeout : number = msg.timeout || conf.timeout;
            let target : string = msg.target || conf.target;
            let selector : string = msg.selector || conf.selector;
            this.status({ fill : "blue", shape : "dot", text : "waiting for " + (waitFor / 1000).toFixed(1) + " s"});
            setTimeout (async () => {
                this.status({ fill : "blue", shape : "dot", text : "locating"});
                try {
                    if (target != "") {
                        //@ts-ignore
                        msg.element = await msg.driver.wait(until.elementLocated(By[selector](target)), timeout);
                    }
                    this.status({ fill : "green", shape : "dot", text : "success"})
                    if (msg.error) { delete msg.error; }
                    send([msg, null]);
                    done();
                } catch (e) {
                    console.log(e);
                    msg.error = {
                        name : conf.name,
                        selector : selector,
                        target : target,
                        value : "catch timeout after " + timeout + " milliseconds for selector type " + selector +  " for  " + target
                    };
                    this.status({ fill : "yellow", shape : "dot", text : "location error"})
                    send([null, msg]);
                    done();
                }
            }, waitFor);
        }
    });
}