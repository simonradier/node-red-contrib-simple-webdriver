import { checkIfCritical, replaceMustache, falseIfEmpty } from "../utils";
import { WebDriverAction, SeleniumNode, SeleniumNodeDef } from "./node";
import { GenericNodeConstructor } from "./node-constructor";

// tslint:disable-next-line: no-empty-interface
export interface NodeRunScriptDef extends SeleniumNodeDef {
    script : string;
}

// tslint:disable-next-line: no-empty-interface
export interface NodeRunScript extends SeleniumNode {
}

async function inputAction (node : NodeRunScript, conf : NodeRunScriptDef, action : WebDriverAction) : Promise<void> {
    return new Promise<void> (async (resolve, reject) => {
        const msg = action.msg;
        const script = falseIfEmpty(replaceMustache(conf.script, msg)) || msg.script
        try {
            msg.payload = await msg.browser.executeSync(script, msg.element);
            node.status({ fill : "green", shape : "dot", text : "success"})
            if (msg.error) { delete msg.error; }
            action.send([msg, null]);
            action.done();
        } catch(err) {
            if (checkIfCritical(err)) {
                reject(err);
            } else {
                msg.error = {
                    message : "Can't run script on the the element : " + err.message
                };
                node.warn(msg.error.message);
                node.status({ fill : "yellow", shape : "dot", text : "run script error"})
                action.send([null, msg]);
                action.done();
            }
        }
        resolve();
    });
}

const NodeRunScriptConstructor = GenericNodeConstructor(null, inputAction);

export { NodeRunScriptConstructor as NodeRunScriptConstructor}