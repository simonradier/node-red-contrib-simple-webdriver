import { WD2Manager } from "../wd2-manager";
import { SeleniumMsg, SeleniumNode, SeleniumNodeDef } from "./node";

// tslint:disable-next-line: no-empty-interface
export interface NodeGetTitleDef extends SeleniumNodeDef {
    expected : string;
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
            const expected = msg.expected ?? conf.expected;
            const waitFor : number = parseInt(msg.waitFor ?? conf.waitFor,10);
            const timeout : number = parseInt(msg.timeout ?? conf.timeout, 10);
            setTimeout (async () => {
                if (expected && expected !== "") {
                    try {
                        //await msg.driver.wait(until.titleIs(expected), timeout);
                        await msg.driver.wait(expected, timeout);
                        send([msg, null]);
                        node.status({ fill : "green", shape : "dot", text : "success"});
                        done();
                    } catch (e) {
                        if (WD2Manager.checkIfCritical(e)) {
                            node.status({ fill : "red", shape : "dot", text : "critical error"});
                            done(e);
                        } else {
                            try {
                                msg.payload = await msg.driver.window().current().getTitle();
                            } catch (sube) {
                                msg.payload = "[Unknown]";
                            }
                            const error = { message : "Browser windows title does not have the expected value", expected, found : msg.webTitle}
                            node.warn(error.message);
                            msg.error = error;
                            node.status({ fill : "yellow", shape : "dot", text : "wrong title"});
                            send([null, msg]);
                            done();
                        }
                    }
                } else {
                    try {
                        msg.payload = await msg.driver.window().current().getTitle();
                        node.status({ fill : "green", shape : "dot", text : "success"});
                        if (msg.error) { delete msg.error; }
                        send([msg, null]);
                        done();
                    } catch (e) {
                        node.status({ fill : "red", shape : "dot", text : "error"});
                        node.error("Can't get title of the browser window. Check msg.error for more information");
                        done (e);
                    }
                }
            }, waitFor);
        }
    });
}