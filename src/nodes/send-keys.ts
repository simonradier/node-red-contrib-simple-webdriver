import { Node } from "node-red"
import { WD2Manager } from "../wd2-manager";
import { SeleniumAction, SeleniumMsg, SeleniumNode, SeleniumNodeDef } from "./node";
import { GenericSeleniumConstructor } from "./node-constructor";

export interface NodeSendKeysDef extends SeleniumNodeDef {
    value : string;
    clearVal : string;
}

export interface NodeSendKeys extends SeleniumNode {
    __msg : SeleniumMsg;
}

async function inputAction (node : NodeSendKeys, conf : NodeSendKeysDef, action : SeleniumAction) : Promise<void> {
    return new Promise<void> (async (resolve, reject) => {
        const msg = action.msg;
        const clearVal = msg.clearVal ?? conf.clearVal;
        const value = msg.value ?? conf.value;
        let step = "";
        try {
            if (clearVal){
                step = "clear";
                node.status({ fill : "blue", shape : "dot", text : "clearing"});
                await msg.element.clear();
            }
            step = "send keys";
            await msg.element.sendKeys(value);
            node.status({ fill : "green", shape : "dot", text : "success"})
            if (msg.error) { delete msg.error; }
            action.send([msg, null]);
            action.done();
        } catch(err) {
            if (WD2Manager.checkIfCritical(err)) {
                reject(err);
            } else {
                msg.error = {
                    message : "Can't send keys on the the element : " + err.message
                };
                node.status({ fill : "yellow", shape : "dot", text : step + "error"})
                action.send([null, msg]);
                action.done();
            }
        }
        resolve();
    });
}

const NodeSendKeysConstructor = GenericSeleniumConstructor(null, inputAction);

export { NodeSendKeysConstructor as NodeSendKeysConstructor}