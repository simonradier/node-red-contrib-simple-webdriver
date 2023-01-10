import { FindElementNodeConf, GenericNodeConstructor, SimpleWebDriverAction, SimpleWebdriverNode } from './node'


// tslint:disable-next-line: no-empty-interface
export interface NodeFindElement extends SimpleWebdriverNode {}

async function inputAction(
  node: NodeFindElement,
  conf: FindElementNodeConf,
  action: SimpleWebDriverAction<FindElementNodeConf>
): Promise<void> {
  return new Promise<void>(resolve => {
    const msg = action.msg
    node.status({ fill: 'green', shape: 'dot', text: 'success' })
    if (msg.error) {
      delete msg.error
    }
    action.send([msg, null])
    action.done()
    resolve()
  })
}

const NodeFindElementConstructor = GenericNodeConstructor(null, inputAction)

export { NodeFindElementConstructor as NodeFindElementConstructor }
