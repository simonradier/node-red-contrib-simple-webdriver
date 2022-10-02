import { checkIfCritical, replaceMustache, falseIfEmpty } from '../utils'
import { WebDriverAction, SeleniumNode, SeleniumNodeDef } from './node'
import { GenericNodeConstructor } from './node-constructor'

// tslint:disable-next-line: no-empty-interface
export interface NodeGetValueDef extends SeleniumNodeDef {
  expected: string
}

// tslint:disable-next-line: no-empty-interface
export interface NodeGetValue extends SeleniumNode {}

async function inputAction(
  node: NodeGetValue,
  conf: NodeGetValueDef,
  action: WebDriverAction
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const msg = action.msg
    const expected = falseIfEmpty(replaceMustache(conf.expected, msg)) || msg.expected
    const step = ''
    try {
      msg.payload = await msg.element.getAttribute('value')
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
          message: "Can't send keys on the the element : " + err.message
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

const NodeGetValueConstructor = GenericNodeConstructor(null, inputAction)

export { NodeGetValueConstructor as NodeGetValueConstructor }
