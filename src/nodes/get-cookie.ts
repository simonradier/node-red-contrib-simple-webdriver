import { CookieDef } from '@critik/simple-webdriver/dist/interface'
import {
  checkIfCritical,
  REDAPI,
  waitForValue,
  replaceMustache,
  falseIfEmpty,
  sleep
} from '../utils'
import {
  SimpleWebDriverMessage,
  SimpleWebdriverNode,
  SimpleWebdriverNodeConf
} from './node'

// tslint:disable-next-line: no-empty-interface
export interface NodeGetCookieConf extends SimpleWebdriverNodeConf {
  cookieName: string
  timeout: string
}

// tslint:disable-next-line: no-empty-interface
export interface NodeGetCookie extends SimpleWebdriverNode {}

export function NodeGetCookieConstructor(this: NodeGetCookie, conf: NodeGetCookieConf) {
  REDAPI.get().nodes.createNode(this, conf)
  this.status({})

  this.on('input', async (message: any, send, done) => {
    // Cheat to allow correct typing in typescript
    const msg: SimpleWebDriverMessage<NodeGetCookieConf> = message
    const node = this
    node.status({})
    if (msg.browser == null) {
      const error = new Error(
        "Can't use this node without a working open-browser node first"
      )
      node.status({ fill: 'red', shape: 'ring', text: 'error' })
      done(error)
    } else {
      const name = falseIfEmpty(replaceMustache(conf.cookieName, msg)) || msg.cookieName
      const timeout: number = parseInt(
        falseIfEmpty(replaceMustache(conf.timeout, msg)) || msg.timeout,
        10
      )
      const waitFor: number = parseInt(
        falseIfEmpty(replaceMustache(conf.waitFor, msg)) || msg.waitFor,
        10
      )
      node.status({
        fill: 'blue',
        shape: 'ring',
        text: 'waiting for ' + (waitFor / 1000).toFixed(1) + ' s'
      })
      await sleep(waitFor)
      try {
        node.status({ fill: 'blue', shape: 'dot', text: 'retreiving cookie' })
        const cookie: CookieDef = await waitForValue(
          timeout,
          (val: CookieDef) => {
            return val?.name == name && 'value' in val
          },
          (name: string) => {
            return msg.browser.cookie().get(name)
          },
          name
        )
        if (msg.error) {
          delete msg.error
        }
        msg.payload = cookie
        send([msg, null])
        node.status({ fill: 'green', shape: 'dot', text: 'success' })
        done()
      } catch (e) {
        if (checkIfCritical(e)) {
          node.status({ fill: 'red', shape: 'dot', text: 'critical error' })
          done(e)
        }
        if (e.name === 'WaitForError') {
          msg.payload = e.value
          const error = {
            message: `Can't find cookie with name : ${name}`,
            name: 'WaitForError'
          }
          node.warn(error.message)
          msg.error = error
          node.status({ fill: 'yellow', shape: 'dot', text: `can't retreive cookie` })
          send([null, msg])
          done()
        } else {
          node.status({ fill: 'red', shape: 'dot', text: 'error' })
          node.error(
            "Can't get title of the browser window. Check msg.error for more information"
          )
          done(e)
        }
      }
    }
  })
}
