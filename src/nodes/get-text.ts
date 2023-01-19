import { Element } from '@critik/simple-webdriver'
import { checkIfCritical, replaceMustache, falseIfEmpty } from '../utils'
import { modeExecute } from '../utils/mode-execute'
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
    modeExecute(conf.mode, msg.elements, async (e: Element) => {
      try {
        msg.payload = await e.getText()
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
            message: `Can't get text of the element : ${err.message}`
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

const NodeGetTextConstructor = GenericNodeConstructor(null, inputAction)

export { NodeGetTextConstructor as NodeGetTextConstructor }
