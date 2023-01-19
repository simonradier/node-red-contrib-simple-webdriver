import { Element } from '@critik/simple-webdriver'
import { checkIfCritical, REDAPI } from '../utils'
import { modeExecute } from '../utils/mode-execute'
import {
  FindElementNodeConf,
  SimpleWebDriverAction,
  SimpleWebDriverMessage,
  SimpleWebdriverNode
} from './node'
import { GenericNodeConstructor } from './node-constructor'

interface ClickOnNodeConf extends FindElementNodeConf {
  clickOn?: boolean
  clickEvent?: boolean
}

interface NodeClickOn extends SimpleWebdriverNode {
  __msg: SimpleWebDriverMessage<ClickOnNodeConf>
}

async function inputPreCondAction(
  node: NodeClickOn,
  conf: ClickOnNodeConf,
  action: SimpleWebDriverAction<ClickOnNodeConf>
): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    const waitingNode = node.context().get('waiting') || false
    const msg = action.msg
    if (msg.clickEvent) {
      if (waitingNode) {
        const msg = node.__msg
        modeExecute(conf.mode, msg.elements, async (e: Element) => {
          try {
            node.status({ fill: 'blue', shape: 'dot', text: 'in progress' })
            await e.click()
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
                value: "Can't click on the the element : " + err.message
              }
              node.status({ fill: 'yellow', shape: 'dot', text: 'click error' })
              return [null, msg]
            }
          }
        }).subscribe({
          next(val) {
            action.send(val)
          },
          complete() {
            node.context().set('waiting', false)
            action.done()
            resolve(false)
          }
        })
      } else {
        node.status({ fill: 'yellow', shape: 'ring', text: 'ignored' })
        action.done()
        resolve(false)
      }
    } else {
      resolve(true)
    }
  })
}

async function inputAction(
  node: NodeClickOn,
  conf: ClickOnNodeConf,
  action: SimpleWebDriverAction<ClickOnNodeConf>
): Promise<void> {
  const msg = action.msg
  return new Promise<void>(async (resolve, reject) => {
    const waitingNode = node.context().get('waiting') || false
    if (!conf.clickOn || waitingNode) {
      modeExecute(conf.mode, msg.elements, async (e: Element) => {
        try {
          node.status({ fill: 'blue', shape: 'dot', text: 'in progress' })
          await e.click()
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
              value: "Can't click on the the element : " + err.message
            }
            node.status({ fill: 'yellow', shape: 'dot', text: 'click error' })
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
    } else {
      // If we have to wait for the user click and we save the msg
      node.status({
        fill: 'blue',
        shape: 'dot',
        text: 'waiting for user click'
      })
      node.context().set('waiting', true)
      node.__msg = msg
      resolve()
    }
  })
}

const NodeClickOnConstructor = GenericNodeConstructor(inputPreCondAction, inputAction)

export { NodeClickOnConstructor as NodeClickOnConstructor }

export function NodeClickPrerequisite() {
  REDAPI.get().httpAdmin.post(
    '/onclick/:id',
    REDAPI.get().auth.needsPermission('inject.write'),
    (req, res) => {
      const node = REDAPI.get().nodes.getNode(req.params.id)
      if (node != null) {
        try {
          // @ts-ignore
          node.receive({ clickEvent: true })
          res.sendStatus(200)
        } catch (err) {
          res.sendStatus(500)
          node.error(
            REDAPI.get()._('inject.failed', {
              error: err.toString()
            })
          )
        }
      } else {
        res.sendStatus(404)
      }
    }
  )
}
