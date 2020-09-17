import { Node, NodeDef } from "node-red"
import { WD2Manager } from "../wd2-manager";
import { SeleniumNode } from "./node";

export interface NodeSeleniumServerDef extends NodeDef, SeleniumNode {
    server : string;
}

export interface NodeSeleniumServer extends Node<any> {

}

export function NodeSeleniumServerConstructor (this : NodeSeleniumServer, conf : NodeSeleniumServerDef) {
    WD2Manager.RED.nodes.createNode(this, conf);

    this.on("close", () => {
        console.log("close");
    });
}