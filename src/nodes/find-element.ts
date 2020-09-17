import { Node, NodeDef, nodes } from "node-red"
import { WebDriver } from "selenium-webdriver";
import { WD2Manager } from "../wd2-manager";
import { SeleniumMsg, SeleniumNode } from "./node";

export interface NodeFindElementDef extends NodeDef, SeleniumNode {
    name : string;
    waitfor : number;
}

export interface NodeFindElement extends Node<any> {
}

export function NodeFindElementConstructor (this : NodeFindElement, conf : NodeFindElementDef) {
    WD2Manager.RED.nodes.createNode(this, conf);
    this.status({});    
    
    this.on("input", async (message : any, send, done) => {
        // Cheat to allow correct typing in typescript
        let msg : SeleniumMsg = message;
    });
}