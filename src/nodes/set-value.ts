import { checkIfCritical, replaceMustache, falseIfEmpty } from "../utils";
import { WebDriverAction, SeleniumNode, SeleniumNodeDef } from "./node";
import { GenericNodeConstructor } from "./node-constructor";

export interface NodeSetValueDef extends SeleniumNodeDef {
    value : string;
}

// tslint:disable-next-line: no-empty-interface
export interface NodeSetValue extends SeleniumNode {

}

async function inputAction (node : NodeSetValue, conf : NodeSetValueDef, action : WebDriverAction) : Promise<void> {
    return new Promise<void> (async (resolve, reject) => {
        const msg = action.msg;
        const value = falseIfEmpty(replaceMustache(conf.value, msg)) || msg.value 
        try {
			await msg.browser.executeSync("arguments[0].setAttribute('value', '" + value + "')", msg.element);
            node.status({ fill : "green", shape : "dot", text : "success"})
            if (msg.error) { delete msg.error; }
            action.send([msg, null]);
            action.done();
        } catch(err) {
            if (checkIfCritical(err)) {
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

const NodeSetValueConstructor = GenericNodeConstructor(null, inputAction);

export { NodeSetValueConstructor as NodeSetValueConstructor}