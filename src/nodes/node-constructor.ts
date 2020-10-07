import { Node } from "node-red"
import { WD2Manager } from "../wd2-manager";
import { SeleniumAction, SeleniumMsg, SeleniumNodeDef, waitForElement } from "./node";

export function GenericSeleniumConstructor<TNode extends Node<any>, TNodeDef extends SeleniumNodeDef> (
        inputPreCondAction : (node : TNode, conf : TNodeDef, action : SeleniumAction) => Promise<boolean>,
        inputAction : (node : TNode, conf : TNodeDef, action : SeleniumAction) => Promise<void>,
        nodeCreation : () => void = null) {
    return function (this : TNode, conf : TNodeDef) : void {
        WD2Manager.RED.nodes.createNode(this, conf);
        const node = this;
        node.status({});
        this.on("input", async (message : any, send, done) => {
            // Cheat to allow correct typing in typescript
            const msg : SeleniumMsg = message;
            const action : SeleniumAction = { msg,  send, done};
            node.status({});
            try {
                if (!inputPreCondAction || await inputPreCondAction(node, conf, action)) {
                    if (msg.driver == null) {
                        const error = new Error("Open URL must be call before any other action. For node : " + conf.name);
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
                                if (WD2Manager.checkIfCritical(err)) {
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
                                    delete msg.driver;
                                    done(e);
                                }
                            }
                        });
                    }
                }
            } catch (e) {
                node.status({ fill : "red", shape : "dot", text : "critical error"});
                node.error(e.toString());
                delete msg.driver;
                done(e);
            }
        });
        // Activity to do during Node Creation
        if (nodeCreation)
            nodeCreation();
    }
}
