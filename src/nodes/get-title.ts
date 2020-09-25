import { until } from "selenium-webdriver";
import { WD2Manager } from "../wd2-manager";
import { SeleniumMsg, SeleniumNode, SeleniumNodeDef } from "./node";

// tslint:disable-next-line: no-empty-interface
export interface NodeGetTitleDef extends SeleniumNodeDef {
    webTitle : string;
}

// tslint:disable-next-line: no-empty-interface
export interface NodeGetTitle extends SeleniumNode {
}

export function NodeGetTitleConstructor (this : NodeGetTitle, conf : NodeGetTitleDef) {
    WD2Manager.RED.nodes.createNode(this, conf);
    this.status({});

    this.on("input", async (message : any, send, done) => {
        // Cheat to allow correct typing in typescript
        const msg : SeleniumMsg = message;
        const node = this;
        node.status({});
        if (msg.driver == null) {
            const error = new Error("Open URL must be call before any other action. For node : " + conf.name);
            node.status({ fill : "red", shape : "ring", text : "error"});
            done(error);
        } else {
            const webTitle = msg.webTitle ?? conf.webTitle;
            const waitFor = msg.waitFor ?? conf.waitFor;
            const timeout = msg.timeout ?? conf.timeout;
            setTimeout (async () => {
                if (webTitle && webTitle !== "") {
                    try {
                        await msg.driver.wait(until.titleIs(webTitle), timeout);
                        send([msg, null]);
                        node.status({ fill : "green", shape : "dot", text : "success"});
                        done();
                    } catch (e) {
                        if (WD2Manager.checkIfCritical(e)) {
                            node.status({ fill : "red", shape : "dot", text : "critical error"});
                            done(e);
                        } else {
                            try {
                                msg.webTitle = await msg.driver.getTitle();
                            } catch (sube) {
                                msg.webTitle = "[Unknown]";
                            }
                            const error = { message : "Browser windows title does not have the expected value", expected : webTitle, found : msg.webTitle}
                            node.warn(error.message);
                            msg.error = error;
                            node.status({ fill : "yellow", shape : "dot", text : "wrong title"});
                            send([null, msg]);
                            done();
                        }
                    }
                } else {
                    try {
                        msg.webTitle = await msg.driver.getTitle();
                        node.status({ fill : "green", shape : "dot", text : "success"});
                        if (msg.error) { delete msg.error; }
                        send([msg, null]);
                        done();
                    } catch (e) {
                        msg.webTitle = null;
                        node.status({ fill : "red", shape : "dot", text : "error"});
                        node.error("Can't get title of the browser window. Check msg.error for more information");
                        done (e);
                    }
                }
            }, waitFor);
        }
    });
}