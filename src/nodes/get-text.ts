import { checkIfCritical, replaceMustache, falseIfEmpty } from '../utils'
import { SimpleWebDriverAction, SimpleWebdriverNode, FindElementNodeConf } from './node'
import { GenericNodeConstructor } from './node-constructor'

// tslint:disable-next-line: no-empty-interface
export interface NodeGetTextConf extends FindElementNodeConf {
  expected: string
}

// tslint:disable-next-line: no-empty-interface
export interface NodeGetText extends SimpleWebdriverNode {}

async function inputAction(
  node: NodeGetText,
  conf: NodeGetTextConf,
  action: SimpleWebDriverAction<NodeGetTextConf>
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const msg = action.msg
    const expected = falseIfEmpty(replaceMustache(conf.expected, msg)) || msg.expected
    const step = ''
    try {
      msg.payload = await msg.element.getText()
      if (expected && expected !== msg.payload) {
        msg.error = {
          message:
            'Expected value is not aligned, expected : ' +
            expected +
            ', value : ' +
            msg.payload
        }
        node.status({ fill: 'yellow', shape: 'dot', text: step + 'error' })
        action.send([null, msg])
        action.done()
      } else {
        node.status({ fill: 'green', shape: 'dot', text: 'success' })
        if (msg.error) {
          delete msg.error
        }
        action.send([msg, null])
        action.done()
      }
    } catch (err) {
      if (checkIfCritical(err)) {
        reject(err)
      } else {
        msg.error = {
          message: `Can't get text of the element : ${err.message}`
        }
        node.warn(msg.error.message)
        node.status({
          fill: 'yellow',
          shape: 'dot',
          text: 'expected value error'
        })
        action.send([null, msg])
        action.done()
      }
    }
    resolve()
  })
}

const NodeGetTextConstructor = GenericNodeConstructor(null, inputAction)

export { NodeGetTextConstructor as NodeGetTextConstructor }
