import { WebDriverAction, SeleniumNode, SeleniumNodeDef } from "./node";
import { GenericNodeConstructor } from "./node-constructor";

// tslint:disable-next-line: no-empty-interface
export interface NodeFindElementDef extends SeleniumNodeDef {}

// tslint:disable-next-line: no-empty-interface
export interface NodeFindElement extends SeleniumNode {}

async function inputAction(
  node: NodeFindElement,
  conf: NodeFindElementDef,
  action: WebDriverAction
): Promise<void> {
  return new Promise<void>((resolve) => {
    const msg = action.msg;
    node.status({ fill: "green", shape: "dot", text: "success" });
    if (msg.error) {
      delete msg.error;
    }
    action.send([msg, null]);
    action.done();
    resolve();
  });
}

const NodeFindElementConstructor = GenericNodeConstructor(null, inputAction);

export { NodeFindElementConstructor as NodeFindElementConstructor };
