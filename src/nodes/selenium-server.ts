import { WD2Manager } from "../wd2-manager";
import { SeleniumNode, SeleniumNodeDef } from "./node";

export interface NodeSeleniumServerDef extends SeleniumNodeDef {
    server : string;
}

export interface NodeSeleniumServer extends SeleniumNode {

}

export function NodeSeleniumServerConstructor (this : NodeSeleniumServer, conf : NodeSeleniumServerDef) {
    WD2Manager.RED.nodes.createNode(this, conf);

    this.on("close", () => {
        console.log("close");
    });
}