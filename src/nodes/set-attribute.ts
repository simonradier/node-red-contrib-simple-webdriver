import { WebDriverManager } from "../webdriver-manager";
import { WebDriverAction, SeleniumNode, SeleniumNodeDef } from "./node";
import { GenericSeleniumConstructor } from "./node-constructor";

// tslint:disable-next-line: no-empty-interface
export interface NodeSetAttributeDef extends SeleniumNodeDef {
    attribute : string;
    value : string;
}

// tslint:disable-next-line: no-empty-interface
export interface NodeSetAttribute extends SeleniumNode {

}

async function inputAction (node : NodeSetAttribute, conf : NodeSetAttributeDef, action : WebDriverAction) : Promise<void> {
    return new Promise<void> (async (resolve, reject) => {
        const msg = action.msg;
        const attribute = msg.attribute ?? conf.attribute;
        const value = msg.value ?? conf.value;
        const step = "";
        try {
			await msg.browser.executeSync("arguments[0].setAttribute(" + "'" + attribute + "', '" + value + "')", msg.element);
            node.status({ fill : "green", shape : "dot", text : "success"})
            if (msg.error) { delete msg.error; }
            action.send([msg, null]);
            action.done();
        } catch(err) {
            if (WebDriverManager.checkIfCritical(err)) {
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

const NodeSetAttributeConstructor = GenericSeleniumConstructor(null, inputAction);

export { NodeSetAttributeConstructor as NodeSetAttributeConstructor}