import {
  checkIfCritical,
  REDAPI,
  waitForValue,
  replaceMustache,
  falseIfEmpty,
  sleep
} from '../utils'
import { SimpleWebDriverMessage, SimpleWebdriverNode, FindElementNodeConf } from './node'

// tslint:disable-next-line: no-empty-interface
export interface NodeGetTitleConf extends FindElementNodeConf {
  //inputs
  expected: string
  //outputs
  webTitle: string
}

// tslint:disable-next-line: no-empty-interface
export interface NodeGetTitle extends SimpleWebdriverNode {}

export function NodeGetTitleConstructor(this: NodeGetTitle, conf: NodeGetTitleConf) {
  REDAPI.get().nodes.createNode(this, conf)
  this.status({})

  this.on('input', async (message: any, send, done) => {
    // Cheat to allow correct typing in typescript
    const msg: SimpleWebDriverMessage<NodeGetTitleConf> = message
    const node = this
    node.status({})
    if (msg.browser == null) {
      const error = new Error(
        "Can't use this node without a working open-browser node first"
      )
      node.status({ fill: 'red', shape: 'ring', text: 'error' })
      done(error)
    } else {
      const expected = falseIfEmpty(replaceMustache(conf.expected, msg)) || msg.expected
      const waitFor: number = parseInt(
        falseIfEmpty(replaceMustache(conf.waitFor, msg)) || msg.waitFor,
        10
      )
      const timeout: number = parseInt(
        falseIfEmpty(replaceMustache(conf.timeout, msg)) || msg.timeout,
        10
      )
      await sleep(waitFor)
      try {
        const title: string =
          expected && expected !== ''
            ? await waitForValue(
                timeout,
                expected,
                () => {
                  return msg.browser.getTitle()
                },
                null
              )
            : await msg.browser.getTitle()
        if (msg.error) {
          delete msg.error
        }
        msg.payload = title
        send([msg, null])
        node.status({ fill: 'green', shape: 'dot', text: 'success' })
        done()
      } catch (e) {
        if (checkIfCritical(e)) {
          node.status({ fill: 'red', shape: 'dot', text: 'critical error' })
          done(e)
        }
        if (e.name == 'WaitForError') {
          msg.payload = e.value
          const error = {
            message: 'Browser windows title does not have the expected value',
            expected,
            found: msg.webTitle
          }
          node.warn(error.message)
          msg.error = error
          node.status({ fill: 'yellow', shape: 'dot', text: 'wrong title' })
          send([null, msg])
          done()
        }
        node.status({ fill: 'red', shape: 'dot', text: 'error' })
        node.error(
          "Can't get title of the browser window. Check msg.error for more information"
        )
        done(e)
      }
    }
  })
}
