import {
  SimpleWebDriverMessage,
  SimpleWebdriverNode,
  SimpleWebdriverNodeConf
} from './node'
import * as fs from 'fs'
import { checkIfCritical, REDAPI, replaceMustache, falseIfEmpty, sleep } from '../utils'

// tslint:disable-next-line: no-empty-interface
export interface NodeScreenshotConf extends SimpleWebdriverNodeConf {
  filePath: string
}

// tslint:disable-next-line: no-empty-interface
export interface NodeScreenshot extends SimpleWebdriverNode {}

export function NodeScreenshotConstructor(
  this: NodeScreenshot,
  conf: NodeScreenshotConf
) {
  REDAPI.get().nodes.createNode(this, conf)
  this.status({})

  this.on('input', async (message: any, send, done) => {
    // Cheat to allow correct typing in typescript
    const msg: SimpleWebDriverMessage<NodeScreenshotConf> = message
    const node = this
    node.status({})
    if (msg.browser == null) {
      const error = new Error(
        'Open URL must be call before any other action. For node : ' + conf.name
      )
      node.status({ fill: 'red', shape: 'ring', text: 'error' })
      done(error)
    } else {
      const waitFor: number = parseInt(
        falseIfEmpty(replaceMustache(conf.waitFor, msg)) || msg.waitFor,
        10
      )
      const filePath: string =
        falseIfEmpty(replaceMustache(conf.filePath, msg)) || msg.filePath
      await sleep(waitFor)
      try {
        const sc = await msg.browser.screenshot()
        if (filePath) await fs.promises.writeFile(filePath, sc, 'base64')
        msg.payload = sc
        send([msg, null])
        node.status({ fill: 'green', shape: 'dot', text: 'success' })
        done()
      } catch (e) {
        if (checkIfCritical(e)) {
          node.status({ fill: 'red', shape: 'dot', text: 'critical error' })
          done(e)
        } else {
          const error = { message: "Can't take a screenshot" }
          node.warn(error.message)
          msg.error = error
          node.status({
            fill: 'yellow',
            shape: 'dot',
            text: 'screenshot error'
          })
          send([null, msg])
          done()
        }
      }
    }
  })
}
