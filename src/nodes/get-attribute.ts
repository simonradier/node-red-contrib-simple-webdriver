import { Element } from '@critik/simple-webdriver'
import { checkIfCritical, replaceMustache, falseIfEmpty } from '../utils'
import { modeExecute } from '../utils/mode-execute'
import {
  FindElementNodeConf,
  Mode,
  SimpleWebDriverAction,
  SimpleWebdriverNode
} from './node'
import { GenericNodeConstructor } from './node-constructor'

// tslint:disable-next-line: no-empty-interface
export interface NodeGetAttributeConf extends FindElementNodeConf {
  expected: string
  attribute: string
  property: string
}

// tslint:disable-next-line: no-empty-interface
export interface NodeGetAttribute extends SimpleWebdriverNode {
  property: string
}

async function inputAction(
  node: NodeGetAttribute,
  conf: NodeGetAttributeConf,
  action: SimpleWebDriverAction<NodeGetAttributeConf>
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const msg = action.msg
    const expected = falseIfEmpty(replaceMustache(conf.expected, msg)) || msg.expected
    const attribute = falseIfEmpty(replaceMustache(conf.attribute, msg)) || msg.attribute
    const property = falseIfEmpty(replaceMustache(conf.property, msg)) || msg.property
    const mode: Mode = <Mode>falseIfEmpty(conf.mode) || msg.mode
    let getMode = 'attibute'
    modeExecute(mode, msg.elements, async (e: Element) => {
      try {
        if (attribute && attribute !== '') msg.payload = await e.getAttribute(attribute)
        else {
          msg.payload = await e.getProperty(property)
          getMode = 'property'
        }
        if (expected && expected !== msg.payload) {
          msg.error = {
            message: `Expected ${getMode} ${
              attribute || property
            } value is not aligned, expected : ${expected}, value : ${msg.payload}`
          }
          node.status({ fill: 'yellow', shape: 'dot', text: `get ${getMode} error` })
          return [null, msg]
        } else {
          node.status({ fill: 'green', shape: 'dot', text: 'success' })
          if (msg.error) {
            delete msg.error
          }
          return [msg, null]
        }
      } catch (err) {
        if (checkIfCritical(err)) {
          reject(err)
        } else {
          msg.error = {
            message: `Can't get ${getMode} of the element : ${err.message}`
          }
          node.warn(msg.error.message)
          node.status({
            fill: 'yellow',
            shape: 'dot',
            text: `get-${getMode} error`
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

const NodeGetAttributeConstructor = GenericNodeConstructor(null, inputAction)

export { NodeGetAttributeConstructor as NodeGetAttributeConstructor }
