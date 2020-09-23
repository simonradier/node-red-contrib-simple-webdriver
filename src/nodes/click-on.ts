import { Node, NodeDef, nodes } from "node-red"
import { By, until, WebDriver } from "selenium-webdriver";
import { checkIfCritical } from "../utils";
import { WD2Manager } from "../wd2-manager";
import { SeleniumMsg, SeleniumNode, waitForElement } from "./node";

export interface NodeClickOnDef extends NodeDef, SeleniumNode {
    clickOn? : boolean;
}

export interface NodeClickOn extends Node<any> {
    __msg : SeleniumMsg;
}

export function NodeClickOnConstructor (this : NodeClickOn, conf : NodeClickOnDef) {
    WD2Manager.RED.nodes.createNode(this, conf);
    this.status({});    
    
    this.on("input", async (message : any, send, done) => {
        // Cheat to allow correct typing in typescript
        let msg : SeleniumMsg = message;
        let node = this;
        this.status({});    
        if (msg.driver == null && !msg.click) {
            let error = new Error("Open URL must be call before any other action. For node : " + conf.name);
            this.status({ fill : "red", shape : "ring", text : "error"});
            done(error);
        } else {
            if (msg.click && node.__msg) {
                msg = node.__msg; // msg restoration
                try {
                    await msg.element.click()
                    node.status({ fill : "green", shape : "dot", text : "success"})
                    if (msg.error) { delete msg.error; }
                    send([msg, null]);
                    done();
                } catch(err) {
                    if (checkIfCritical(err)) {
                        node.status({ fill : "red", shape : "dot", text : "critical error"});
                        done(err);
                    } else {
                        msg.error = {
                            value : "Can't click on the the element : " + err.message
                        };
                        node.status({ fill : "yellow", shape : "dot", text : "click error"})
                        send([null, msg]);
                        done();
                    }
                }
            } else {
                waitForElement(conf, msg).subscribe ({
                    next (val)  {
                        if (typeof val === "string") {
                            node.status({ fill : "blue", shape : "dot", text : val});
                        } else {
                            msg.element = val;
                        }
                    },
                    error(err) {
                        node.status({ fill : "yellow", shape : "dot", text : "location error"});
                        msg.error = err;
                        send([null, msg]);
                        done();
                    },
                    async complete () {
                        node.status({ fill : "blue", shape : "dot", text : "located"});
                        // If we don't wait for the user click button
                        if (!conf.clickOn) {
                            try {
                                await msg.element.click()
                                node.status({ fill : "green", shape : "dot", text : "success"})
                                if (msg.error) { delete msg.error; }
                                send([msg, null]);
                                done();
                            } catch(err) {
                                if (checkIfCritical(err)) {
                                    node.status({ fill : "red", shape : "dot", text : "critical error"});
                                    done(err);
                                } else {
                                    msg.error = {
                                        value : "Can't click on the the element : " + err.message
                                    };
                                    node.status({ fill : "yellow", shape : "dot", text : "click error"})
                                    send([null, msg]);
                                    done();
                                }
                            }
                        } else { // If we have to wait for the user click and we save the msg
                            node.status({ fill : "blue", shape : "dot", text : "waiting for user click"});
                            node.__msg = msg;
                        }
                    }
                });
            }
        }
    });

	WD2Manager.RED.httpAdmin.post("/onclick/:id", WD2Manager.RED.auth.needsPermission("inject.write"), function(req, res) {
		var node = WD2Manager.RED.nodes.getNode(req.params.id);
		if (node != null) {
			try {
                //@ts-ignore
				node.receive({ click : true });
				res.sendStatus(200);
			} catch(err) {
				res.sendStatus(500);
				node.error(WD2Manager.RED._("inject.failed", {
					error : err.toString()
				}));
			}
		} else {
			res.sendStatus(404);
		}
	});
}