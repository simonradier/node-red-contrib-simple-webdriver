import { Element } from '@critik/simple-webdriver'
import { checkIfCritical, replaceMustache, falseIfEmpty } from '../utils'
import { modeExecute } from '../utils/mode-execute'
import {
  SimpleWebDriverAction,
  SimpleWebdriverNode,
  FindElementNodeConf,
  Mode
} from './node'
import { GenericNodeConstructor } from './node-constructor'

export interface NodeSetValueDef extends FindElementNodeConf {
  value: string
}

// tslint:disable-next-line: no-empty-interface
export interface NodeSetValue extends SimpleWebdriverNode {}

async function inputAction(
  node: NodeSetValue,
  conf: NodeSetValueDef,
  action: SimpleWebDriverAction<NodeSetValueDef>
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const msg = action.msg
    const value = falseIfEmpty(replaceMustache(conf.value, msg)) || msg.value
    const mode: Mode = <Mode>falseIfEmpty(conf.mode) || msg.mode
    modeExecute(mode, msg.elements, async (element: Element) => {
      try {
        await msg.browser.executeSync(
          "arguments[0].setAttribute('value', '" + value + "')",
          element
        )
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
            message: "Can't set value on the the element : " + err.message
          }
          node.warn(msg.error.message)
          node.status({
            fill: 'yellow',
            shape: 'dot',
            text: 'expected value error'
          })
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

const NodeSetValueConstructor = GenericNodeConstructor(null, inputAction)

export { NodeSetValueConstructor as NodeSetValueConstructor }
