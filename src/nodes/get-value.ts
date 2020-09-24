import { WD2Manager } from "../wd2-manager";
import { SeleniumAction, SeleniumNode, SeleniumNodeDef } from "./node";
import { GenericSeleniumConstructor } from "./node-constructor";

export interface NodeGetValueDef extends SeleniumNodeDef {
    expected : string;
}

export interface NodeGetValue extends SeleniumNode {

}

async function inputAction (node : NodeGetValue, conf : NodeGetValueDef, action : SeleniumAction) : Promise<void> {
    return new Promise<void> (async (resolve, reject) => {
        let msg = action.msg;
        let expected = msg.expected ?? conf.expected;
        let step = "";
        try {
            msg.payload = await msg.element.getAttribute("value");
            if (expected && expected !== msg.payload) {
                msg.error = {
                    message : "Expected value is not aligned, expected : " + expected + ", value : " + msg.payload
                };
                node.status({ fill : "yellow", shape : "dot", text : step + "error"})
                action.send([null, msg]);
                action.done();    
            } else {
                node.status({ fill : "green", shape : "dot", text : "success"})
                if (msg.error) { delete msg.error; }
                action.send([msg, null]);
                action.done();
            }
        } catch(err) {
            if (WD2Manager.checkIfCritical(err)) {
                reject(err);
            } else {
                msg.error = {
                    message : "Can't send keys on the the element : " + err.message
                };
                node.warn(msg.error.message);
                node.status({ fill : "yellow", shape : "dot", text : "expected value error"})
                action.send([null, msg]);
                action.done();
            }
        }
        resolve();                       
    });
}

let NodeGetValueConstructor = GenericSeleniumConstructor(null, inputAction);

export { NodeGetValueConstructor as NodeGetValueConstructor}