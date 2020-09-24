import { WD2Manager } from "../wd2-manager";
import { SeleniumAction, SeleniumNode, SeleniumNodeDef } from "./node";
import { GenericSeleniumConstructor } from "./node-constructor";

export interface NodeSetValueDef extends SeleniumNodeDef {
    value : string;
}

export interface NodeSetValue extends SeleniumNode {

}

async function inputAction (node : NodeSetValue, conf : NodeSetValueDef, action : SeleniumAction) : Promise<void> {
    return new Promise<void> (async (resolve, reject) => {
        let msg = action.msg;
        let value = msg.value ?? conf.value;
        try {
			await msg.driver.executeScript("arguments[0].setAttribute('value', '" + value + "')", msg.element);    
            node.status({ fill : "green", shape : "dot", text : "success"})
            if (msg.error) { delete msg.error; }
            action.send([msg, null]);
            action.done();
        } catch(err) {
            if (WD2Manager.checkIfCritical(err)) {
                reject(err);
            } else {
                msg.error = {
                    message : "Can't set value on the the element : " + err.message
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

let NodeSetValueConstructor = GenericSeleniumConstructor(null, inputAction);

export { NodeSetValueConstructor as NodeSetValueConstructor}