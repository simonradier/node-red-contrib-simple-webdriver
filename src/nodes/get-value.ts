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

// tslint:disable-next-line: no-empty-interface
export interface NodeGetValueConf extends FindElementNodeConf {
  //inputs
  expected: string
}

// tslint:disable-next-line: no-empty-interface
export interface NodeGetValue extends SimpleWebdriverNode {}

async function inputAction(
  node: NodeGetValue,
  conf: NodeGetValueConf,
  action: SimpleWebDriverAction<NodeGetValueConf>
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const msg = action.msg
    const expected = falseIfEmpty(replaceMustache(conf.expected, msg)) || msg.expected
    const mode: Mode = <Mode>falseIfEmpty(conf.mode) || msg.mode
    modeExecute(mode, msg.elements, async (e: Element) => {
      try {
        msg.payload = await e.getAttribute('value')
        if (expected && expected !== msg.payload) {
          msg.error = {
            message:
              'Expected value is not aligned, expected : ' +
              expected +
              ', value : ' +
              msg.payload
          }
          node.status({ fill: 'yellow', shape: 'dot', text: 'expected value error' })
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
            message: `Can't get value on the element : ${err.message}`
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

const NodeGetValueConstructor = GenericNodeConstructor(null, inputAction)

export { NodeGetValueConstructor as NodeGetValueConstructor }
