import { CookieDef } from '@critik/simple-webdriver/dist/interface'
import {
  checkIfCritical,
  REDAPI,
  waitForValue,
  replaceMustache,
  falseIfEmpty
} from '../utils'
import { WebDriverMessage, SeleniumNode, SeleniumNodeDef } from './node'

// tslint:disable-next-line: no-empty-interface
export interface NodeSetCookieDef extends SeleniumNodeDef {
  cookieName: string
  cookieValue: string
  cookiePath: string
  cookieDomain: string
  cookieSecure: boolean
  cookieHttpOnly: boolean
  cookieExpiry: string
  cookieSameSite: 'None' | 'Lax' | 'Strict'
  advanced: boolean
}

// tslint:disable-next-line: no-empty-interface
export interface NodeSetCookie extends SeleniumNode {}

export function NodeSetCookieConstructor(this: NodeSetCookie, conf: NodeSetCookieDef) {
  REDAPI.get().nodes.createNode(this, conf)
  this.status({})

  this.on('input', async (message: any, send, done) => {
    // Cheat to allow correct typing in typescript
    const msg: WebDriverMessage = message
    const node = this
    node.status({})
    if (msg.browser == null) {
      const error = new Error(
        "Can't use this node without a working open-browser node first"
      )
      node.status({ fill: 'red', shape: 'ring', text: 'error' })
      done(error)
    } else {
      const cookie: CookieDef = msg.cookie ?? {
        name: replaceMustache(conf.cookieName, msg),
        value: replaceMustache(conf.cookieValue, msg),
        path: conf.advanced ? replaceMustache(conf.cookiePath, msg) : undefined,
        domain: conf.advanced ? replaceMustache(conf.cookieDomain, msg) : undefined,
        secure: conf.advanced ? conf.cookieSecure : undefined,
        httpOnly: conf.advanced ? conf.cookieHttpOnly : undefined,
        expiry: conf.advanced
          ? parseInt(replaceMustache(conf.cookieExpiry, msg), 10) || undefined
          : undefined,
        sameSite: conf.advanced ? conf.cookieSameSite : undefined
      }
      const name = falseIfEmpty(replaceMustache(conf.cookieName, msg)) || msg.cookieName
      const waitFor: number = parseInt(
        falseIfEmpty(replaceMustache(conf.waitFor, msg)) || msg.waitFor,
        10
      )
      setTimeout(async () => {
        try {
          await msg.browser.cookie().create(cookie)
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
          if (e.name == 'WaitForError') {
            msg.payload = e.value
            const error = {
              message: `Can't find cookie with name : ${name}`,
              name: 'WaitForError'
            }
            node.warn(error.message)
            msg.error = error
            node.status({ fill: 'yellow', shape: 'dot', text: 'wrong title' })
            send([null, msg])
            done()
          }
          node.status({ fill: 'red', shape: 'dot', text: 'error' })
          node.error(
            "Can't set the requested cookie. Check msg.error for more information"
          )
          done(e)
        }
      }, waitFor)
    }
  })
}
