import { Element } from '@critik/simple-webdriver'
import { checkIfCritical, replaceMustache, falseIfEmpty } from '../utils'
import { modeExecute } from '../utils/mode-execute'
import { SimpleWebDriverAction, SimpleWebdriverNode, FindElementNodeConf } from './node'
import { GenericNodeConstructor } from './node-constructor'

// tslint:disable-next-line: no-empty-interface
export interface NodeRunScriptConf extends FindElementNodeConf {
  script: string
}

// tslint:disable-next-line: no-empty-interface
export interface NodeRunScript extends SimpleWebdriverNode {}

async function inputAction(
  node: NodeRunScript,
  conf: NodeRunScriptConf,
  action: SimpleWebDriverAction<NodeRunScriptConf>
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const msg = action.msg
    const script = falseIfEmpty(replaceMustache(conf.script, msg)) || msg.script
    modeExecute(conf.mode, msg.elements, async (e: Element) => {
      try {
        msg.payload = await msg.browser.executeSync(script, e)
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
            message: "Can't run script on the the element : " + err.message
          }
          node.warn(msg.error.message)
          node.status({ fill: 'yellow', shape: 'dot', text: 'run script error' })
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

const NodeRunScriptConstructor = GenericNodeConstructor(null, inputAction)

export { NodeRunScriptConstructor as NodeRunScriptConstructor }
