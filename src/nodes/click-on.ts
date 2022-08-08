import nodeRed from "node-red";
import { checkIfCritical, REDAPI } from "../utils";
import { WebDriverAction, WebDriverMessage, SeleniumNode, SeleniumNodeDef, waitForElement} from "./node";
import { GenericNodeConstructor } from "./node-constructor";

export interface NodeClickOnDef extends SeleniumNodeDef {
    clickOn? : boolean;
}

export interface NodeClickOn extends SeleniumNode {
    __msg : WebDriverMessage;
}

async function inputPreCondAction (node : NodeClickOn, conf : NodeClickOnDef, action : WebDriverAction) : Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
        let msg = action.msg;
        if (msg.clickEvent && node.__msg) {
            msg = node.__msg; // msg restoration
            try {
                await msg.element.click()
                node.status({ fill : "green", shape : "dot", text : "success"})
                if (msg.error) { delete msg.error; }
                action.send([msg, null]);
                action.done();
            } catch(err) {
                if (checkIfCritical(err)) {
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
        if (msg.clickEvent && !node.__msg) {
            node.status({ fill : "yellow", shape : "ring", text : "ignored"});
            resolve(false);
        }
        resolve(true);
    });
}

async function inputAction (node : NodeClickOn, conf : NodeClickOnDef, action : WebDriverAction) : Promise<void> {
    const msg = action.msg;
    return new Promise<void> (async (resolve, reject) => {
        if (!conf.clickOn) {
            try {
                await msg.element.click()
                node.status({ fill : "green", shape : "dot", text : "success"})
                if (msg.error) { delete msg.error; }
                action.send([msg, null]);
                action.done();
            } catch(err) {
                if (checkIfCritical(err)) {
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

const NodeClickOnConstructor = GenericNodeConstructor(inputPreCondAction, inputAction);

export { NodeClickOnConstructor as NodeClickOnConstructor}

export function NodeClickPrerequisite () {
    REDAPI.get().httpAdmin.post("/onclick/:id", REDAPI.get().auth.needsPermission("inject.write"), (req, res) => {
        const node = REDAPI.get().nodes.getNode(req.params.id);
        if (node != null) {
            try {
                // @ts-ignore
                node.receive({ click : true });
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error(REDAPI.get()._("inject.failed", {
                    error : err.toString()
                }));
            }
        } else {
            res.sendStatus(404);
        }
    });
}