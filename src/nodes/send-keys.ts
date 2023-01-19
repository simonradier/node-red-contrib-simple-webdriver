import { Element } from '@critik/simple-webdriver'
import { checkIfCritical, replaceMustache, falseIfEmpty } from '../utils'
import { modeExecute } from '../utils/mode-execute'
import { SimpleWebDriverAction, SimpleWebdriverNode, FindElementNodeConf } from './node'
import { GenericNodeConstructor } from './node-constructor'

export interface NodeSendKeysConf extends FindElementNodeConf {
  keys: string
  clearVal: string
}

export interface NodeSendKeys extends SimpleWebdriverNode {}

async function inputAction(
  node: NodeSendKeys,
  conf: NodeSendKeysConf,
  action: SimpleWebDriverAction<NodeSendKeysConf>
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const msg = action.msg
    const clearVal = falseIfEmpty(replaceMustache(conf.clearVal, msg)) || msg.clearVal
    const keys = falseIfEmpty(replaceMustache(conf.keys, msg)) || msg.keys

    modeExecute(conf.mode, msg.elements, async (element: Element) => {
      let step = ''
      try {
        if (clearVal) {
          step = 'clear'
          node.status({ fill: 'blue', shape: 'dot', text: 'clearing' })
          await element.clear()
        }
        step = 'send keys'
        await element.sendKeys(keys)
        node.status({ fill: 'green', shape: 'dot', text: 'success' })
        if (msg.error) {
          delete msg.error
        }
        return [msg, null]
      } catch (err) {
        if (checkIfCritical(err)) {
          reject(err)
        } else {
          msg.error = {
            message: "Can't send keys on the the element : " + err.message
          }
          node.status({ fill: 'yellow', shape: 'dot', text: step + 'error' })
          return [null, msg]
        }
      }
    }).subscribe({
      next(val) {
        action.send(val)
      },
      complete() {
        action.done()
        resolve()
      }
    })
  })
}

const NodeSendKeysConstructor = GenericNodeConstructor(null, inputAction)

export { NodeSendKeysConstructor as NodeSendKeysConstructor }
