import { WebDriverManager } from "../webdriver-manager";
import { WebDriverAction, SeleniumNode, SeleniumNodeDef } from "./node";
import { GenericSeleniumConstructor } from "./node-constructor";

// tslint:disable-next-line: no-empty-interface
export interface NodeGetTextDef extends SeleniumNodeDef {
    expected : string;
}

// tslint:disable-next-line: no-empty-interface
export interface NodeGetText extends SeleniumNode {

}

async function inputAction (node : NodeGetText, conf : NodeGetTextDef, action : WebDriverAction) : Promise<void> {
    return new Promise<void> (async (resolve, reject) => {
        const msg = action.msg;
        const expected = msg.expected ?? conf.expected;
        const step = "";
        try {
            msg.payload = await msg.element.getText();
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

const NodeGetTextConstructor = GenericSeleniumConstructor(null, inputAction);

export { NodeGetTextConstructor as NodeGetTextConstructor}