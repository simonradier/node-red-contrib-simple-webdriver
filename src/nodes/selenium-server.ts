import { WD2Manager } from "../wd2-manager";
import { SeleniumNode, SeleniumNodeDef } from "./node";

// tslint:disable-next-line: no-empty-interface
export interface NodeSeleniumServerDef extends SeleniumNodeDef {
    server : string;
}

// tslint:disable-next-line: no-empty-interface
export interface NodeSeleniumServer extends SeleniumNode {

}

export function NodeSeleniumServerConstructor (this : NodeSeleniumServer, conf : NodeSeleniumServerDef) {
    WD2Manager.RED.nodes.createNode(this, conf);

    this.on("close", () => {
        // tslint:disable-next-line: no-console
        console.log("close");
    });
}