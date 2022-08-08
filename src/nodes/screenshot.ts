import { WebDriverMessage, SeleniumNode, SeleniumNodeDef } from "./node";
import * as fs from "fs";
import { checkIfCritical, REDAPI } from "../utils";

// tslint:disable-next-line: no-empty-interface
export interface NodeScreenshotDef extends SeleniumNodeDef {
    filePath : string;
}

// tslint:disable-next-line: no-empty-interface
export interface NodeScreenshot extends SeleniumNode {
}

export function NodeScreenshotConstructor (this : NodeScreenshot, conf : NodeScreenshotDef) {
    REDAPI.get().nodes.createNode(this, conf);
    this.status({});

    this.on("input", async (message : any, send, done) => {
        // Cheat to allow correct typing in typescript
        const msg : WebDriverMessage = message;
        const node = this;
        node.status({});
        if (msg.browser == null) {
            const error = new Error("Open URL must be call before any other action. For node : " + conf.name);
            node.status({ fill : "red", shape : "ring", text : "error"});
            done(error);
        } else {
            const waitFor : number = parseInt(msg.waitFor ?? conf.waitFor,10);
            const filePath : string = msg.filePath ?? conf.filePath;
            setTimeout (async () => {
                try {
                    const sc = await msg.browser.screenshot();
                    if (filePath)
                        await fs.promises.writeFile(filePath, sc, "base64");
                    msg.payload = sc;
                    send([msg, null]);
                    node.status({ fill : "green", shape : "dot", text : "success"});
                    done();
                } catch (e) {
                    if (checkIfCritical(e)) {
                        node.status({ fill : "red", shape : "dot", text : "critical error"});
                        done(e);
                    } else {
                        const error = { message : "Can't take a screenshot"}
                        node.warn(error.message);
                        msg.error = error;
                        node.status({ fill : "yellow", shape : "dot", text : "screenshot error"});
                        send([null, msg]);
                        done();
                    }
                }
            }, waitFor);
        }
    });
}