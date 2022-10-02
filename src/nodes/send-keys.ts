import { checkIfCritical, replaceMustache, falseIfEmpty } from '../utils'
import { WebDriverAction, WebDriverMessage, SeleniumNode, SeleniumNodeDef } from './node'
import { GenericNodeConstructor } from './node-constructor'

export interface NodeSendKeysDef extends SeleniumNodeDef {
  keys: string
  clearVal: string
}

export interface NodeSendKeys extends SeleniumNode {
  __msg: WebDriverMessage
}

async function inputAction(
  node: NodeSendKeys,
  conf: NodeSendKeysDef,
  action: WebDriverAction
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const msg = action.msg
    const clearVal = falseIfEmpty(replaceMustache(conf.clearVal, msg)) || msg.clearVal
    const keys = falseIfEmpty(replaceMustache(conf.keys, msg)) || msg.keys
    let step = ''
    try {
      if (clearVal) {
        step = 'clear'
        node.status({ fill: 'blue', shape: 'dot', text: 'clearing' })
        await msg.element.clear()
      }
      step = 'send keys'
      await msg.element.sendKeys(keys)
      node.status({ fill: 'green', shape: 'dot', text: 'success' })
      if (msg.error) {
        delete msg.error
      }
      action.send([msg, null])
      action.done()
    } catch (err) {
      if (checkIfCritical(err)) {
        reject(err)
      } else {
        msg.error = {
          message: "Can't send keys on the the element : " + err.message
        }
        node.status({ fill: 'yellow', shape: 'dot', text: step + 'error' })
        action.send([null, msg])
        action.done()
      }
    }
    resolve()
  })
}

const NodeSendKeysConstructor = GenericNodeConstructor(null, inputAction)

export { NodeSendKeysConstructor as NodeSendKeysConstructor }
