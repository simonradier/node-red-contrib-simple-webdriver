import { Node, NodeDef } from "node-red"

export interface NodeSeleniumServerDef extends NodeDef {
    server : string;
}

export interface NodeSeleniumServer extends Node<any> {

}

export function NodeSeleniumServerConstructor (this : NodeSeleniumServer, conf : NodeSeleniumServerDef) {
    this.on("input", (msg) => {
        console.log("input");
    });

    this.on("close", () => {
        console.log("close");
    });
}