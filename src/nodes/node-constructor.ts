import { Node } from "node-red"
import { WebDriverManager } from "../webdriver-manager";
import { WebDriverAction, WebDriverMessage, SeleniumNodeDef, waitForElement } from "./node";

export function GenericSeleniumConstructor<TNode extends Node<any>, TNodeDef extends SeleniumNodeDef> (
        inputPreCondAction : (node : TNode, conf : TNodeDef, action : WebDriverAction) => Promise<boolean>,
        inputAction : (node : TNode, conf : TNodeDef, action : WebDriverAction) => Promise<void>,
        nodeCreation : () => void = null) {
    return function (this : TNode, conf : TNodeDef) : void {
        WebDriverManager.RED.nodes.createNode(this, conf);
        const node = this;
        node.status({});
        this.on("input", async (message : any, send, done) => {
            // Cheat to allow correct typing in typescript
            const msg : WebDriverMessage = message;
            const action : WebDriverAction = { msg,  send, done};
            node.status({});
            try {
                if (!inputPreCondAction || await inputPreCondAction(node, conf, action)) {
                    if (msg.browser == null) {
                        const error = new Error("Can't use this node without a working open-browser node first. For node : " + conf.name);
                        node.status({ fill : "red", shape : "ring", text : "error"});
                        done(error);
                    } else {
                        // If InputPreCond return false, next steps will not be executed
                        waitForElement(conf, msg).subscribe ({
                            next (val)  {
                                if (typeof val === "string") {
                                    node.status({ fill : "blue", shape : "dot", text : val});
                                } else {
                                    msg.element = val;
                                }
                            },
                            error(err) {
                                if (WebDriverManager.checkIfCritical(err)) {
                                    node.status({ fill : "red", shape : "dot", text : "critical error"});
                                    node.error(err.toString());
                                    done(err);
                                } else {
                                    node.status({ fill : "yellow", shape : "dot", text : "location error"});
                                    msg.error = err;
                                    send([null, msg]);
                                    done();
                                }
                            },
                            async complete () {
                                node.status({ fill : "blue", shape : "dot", text : "located"});
                                try {
                                    await inputAction(node, conf, action);
                                } catch (e) {
                                    node.status({ fill : "red", shape : "dot", text : "critical error"});
                                    node.error(e.toString());
                                    delete msg.browser;
                                    done(e);
                                }
                            }
                        });
                    }
                }
            } catch (e) {
                node.status({ fill : "red", shape : "dot", text : "critical error"});
                node.error(e.toString());
                delete msg.browser;
                done(e);
            }
        });
        // Activity to do during Node Creation
        if (nodeCreation)
            nodeCreation();
    }
}
