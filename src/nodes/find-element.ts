import { SeleniumAction, SeleniumNode, SeleniumNodeDef} from "./node";
import { GenericSeleniumConstructor } from "./node-constructor";

export interface NodeFindElementDef extends SeleniumNodeDef {
}

export interface NodeFindElement extends SeleniumNode {
}

async function inputAction (node : NodeFindElement, conf : NodeFindElementDef, action : SeleniumAction) : Promise<void> {
    return new Promise<void> ((resolve, reject) => {
        let msg = action.msg;
        node.status({ fill : "green", shape : "dot", text : "success"});
        if (msg.error) { delete msg.error };
        action.send([msg, null]);
        action.done();
        resolve();
    });
}

let NodeFindElementConstructor = GenericSeleniumConstructor(null, inputAction);

export { NodeFindElementConstructor as NodeFindElementConstructor}
