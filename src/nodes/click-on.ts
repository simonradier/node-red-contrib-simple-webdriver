import { WD2Manager } from "../wd2-manager";
import { SeleniumAction, SeleniumMsg, SeleniumNode, SeleniumNodeDef, waitForElement} from "./node";
import { GenericSeleniumConstructor } from "./node-constructor";

export interface NodeClickOnDef extends SeleniumNodeDef {
    clickOn? : boolean;
}

export interface NodeClickOn extends SeleniumNode {
    __msg : SeleniumMsg;
}

/**
 * Manage mostly the "Waiting for user click"
 * @param node 
 * @param conf 
 * @param action 
 */
async function inputPreCondAction (node : NodeClickOn, conf : NodeClickOnDef, action : SeleniumAction) : Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
        let msg = action.msg;
        if (msg.click && node.__msg) {
            msg = node.__msg; // msg restoration
            try {
                await msg.element.click()
                node.status({ fill : "green", shape : "dot", text : "success"})
                if (msg.error) { delete msg.error; }
                action.send([msg, null]);
                action.done();
            } catch(err) {
                if (WD2Manager.checkIfCritical(err)) {
                    reject(err);
                } else {
                    msg.error = {
                        value : "Can't click on the the element : " + err.message
                    };
                    node.status({ fill : "yellow", shape : "dot", text : "click error"})
                    action.send([null, msg]);
                    action.done();
                }
            }
            resolve(false); // We don't want to execute the full node
        }
        resolve(true);
    });
}   

async function inputAction (node : NodeClickOn, conf : NodeClickOnDef, action : SeleniumAction) : Promise<void> {
    let msg = action.msg;
    return new Promise<void> (async (resolve, reject) => {
        if (!conf.clickOn) {
            try {
                await msg.element.click()
                node.status({ fill : "green", shape : "dot", text : "success"})
                if (msg.error) { delete msg.error; }
                action.send([msg, null]);
                action.done();
            } catch(err) {
                if (WD2Manager.checkIfCritical(err)) {
                    reject(err);
                } else {
                    msg.error = {
                        value : "Can't click on the the element : " + err.message
                    };
                    node.status({ fill : "yellow", shape : "dot", text : "click error"})
                    action.send([null, msg]);
                    action.done();
                }
            }
        } else { // If we have to wait for the user click and we save the msg
            node.status({ fill : "blue", shape : "dot", text : "waiting for user click"});
            node.__msg = msg;
        }
        resolve();
    })
}

let NodeClickOnConstructor = GenericSeleniumConstructor(inputPreCondAction, inputAction);

export { NodeClickOnConstructor as NodeClickOnConstructor}

export function NodeClickPrerequisite () {
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



/*export function NodeClickOnConstructor (this : NodeClickOn, conf : NodeClickOnDef) {
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
                    if (WD2Manager.checkIfCritical(err)) {
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
                                if (WD2Manager.checkIfCritical(err)) {
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


}*/