import { Node, NodeDef, nodes } from "node-red"
import { By, until, WebDriver } from "selenium-webdriver";
import { WD2Manager } from "../wd2-manager";
import { SeleniumMsg, SeleniumNode, waitForElement } from "./node";

export interface NodeClickOnDef extends NodeDef, SeleniumNode {
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
        if (msg.driver == null) {
            let error = new Error("Open URL must be call before any other action. For node : " + conf.name);
            this.status({ fill : "red", shape : "ring", text : "error"});
            done(error);
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
                complete () {
                    node.status({ fill : "blue", shape : "dot", text : "located"});
                    if (!msg.clickOn) {
                        msg.element.click().then (() => {
                            node.status({ fill : "green", shape : "dot", text : "success"})
                            if (msg.error) { delete msg.error; }
                            send([msg, null]);
                            done();
                        }).catch( err => {
                            msg.error = {
                                value : "Can't click on the the element : " + err.message
                            };
                            node.status({ fill : "yellow", shape : "dot", text : "click error"})
                            send([null, msg]);
                            done();
                        });
                    } else {
                        node.__msg = msg;
                    }
                }
            });
        }
    });

	WD2Manager.RED.httpAdmin.post("/onclick/:id", WD2Manager.RED.auth.needsPermission("inject.write"), function(req, res) {
		var node = WD2Manager.RED.nodes.getNode(req.params.id);
		if (node != null) {
			try {
                //@ts-ignore
				node.receive({ waitFor : 1 });
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