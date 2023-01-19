import { REDAPI, sleep } from '../utils'
import {
  SimpleWebDriverMessage,
  SimpleWebdriverNode,
  SimpleWebdriverNodeConf
} from './node'

// tslint:disable-next-line: no-empty-interface
interface NodeCloseWebConf extends SimpleWebdriverNodeConf {}

// tslint:disable-next-line: no-empty-interface
export interface NodeCloseWeb extends SimpleWebdriverNode {}

export function NodeCloseWebConstructor(this: NodeCloseWeb, conf: NodeCloseWebConf) {
  REDAPI.get().nodes.createNode(this, conf)
  this.status({})

  this.on('input', async (message: any, send, done) => {
    // Cheat to allow correct typing in typescript
    const msg: SimpleWebDriverMessage<SimpleWebdriverNodeConf> = message

    if (null === msg.browser) {
      const error = new Error(
        "Can't use this node without a working open-browser node first"
      )
      this.status({ fill: 'red', shape: 'ring', text: 'error' })
      done(error)
    } else {
      const waitFor: number = parseInt(msg.waitFor ?? conf.waitFor, 10)
      this.status({
        fill: 'blue',
        shape: 'ring',
        text: 'waiting for ' + (waitFor / 1000).toFixed(1) + ' s'
      })
      await sleep(waitFor)
      try {
        this.status({ fill: 'blue', shape: 'ring', text: 'closing' })
        await msg.browser.close()
        msg.browser = null
        this.status({ fill: 'green', shape: 'dot', text: 'closed' })
        send(msg)
        done()
      } catch (e) {
        this.warn("Can't close the browser, check msg.error for more information")
        msg.browser = null
        msg.error = e
        this.status({ fill: 'red', shape: 'dot', text: 'critical error' })
        done(e)
      }
    }
  })
}
