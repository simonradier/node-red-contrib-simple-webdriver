import { checkIfCritical, REDAPI, replaceMustache, falseIfEmpty, sleep } from '../utils'
import { SimpleWebDriverMessage, SimpleWebdriverNode, SimpleWebdriverNodeConf } from './node'

// tslint:disable-next-line: no-empty-interface
export interface NodeNavigateConf extends SimpleWebdriverNodeConf {
  url: string
  navType: string
}

// tslint:disable-next-line: no-empty-interface
export interface NodeNavigate extends SimpleWebdriverNode {}

export function NodeNavigateConstructor(this: NodeNavigate, conf: NodeNavigateConf) {
  REDAPI.get().nodes.createNode(this, conf)
  this.status({})

  this.on('input', async (message: any, send, done) => {
    // Cheat to allow correct typing in typescript
    const msg: SimpleWebDriverMessage<NodeNavigateConf> = message
    const node = this
    node.status({})
    if (msg.browser == null) {
      const error = new Error(
        "Can't use this node without a working open-browser node first. For node : " +
          conf.name
      )
      node.status({ fill: 'red', shape: 'ring', text: 'error' })
      done(error)
    } else {
      const type = falseIfEmpty(replaceMustache(conf.navType, msg)) || msg.navType
      const url = falseIfEmpty(replaceMustache(conf.url, msg)) || msg.url
      const waitFor: number = parseInt(
        falseIfEmpty(replaceMustache(conf.waitFor, msg)) || msg.waitFor,
        10
      )
      await sleep(waitFor)
      try {
        node.status({ fill: 'blue', shape: 'ring', text: 'loading' })
        switch (type) {
          case 'forward':
            await msg.browser.navigate().forward()
            break
          case 'back':
            await msg.browser.navigate().back()
            break
          case 'refresh':
            await msg.browser.navigate().refresh()
            break
          default:
            await msg.browser.navigate().to(url)
        }
        send([msg, null])
        node.status({ fill: 'green', shape: 'dot', text: 'success' })
        done()
      } catch (e) {
        if (checkIfCritical(e)) {
          node.status({ fill: 'red', shape: 'dot', text: 'critical error' })
          done(e)
        } else {
          const error = {
            message: "Can't navigate " + type + (type === 'to') ? ' : ' + url : ''
          }
          node.warn(error.message)
          msg.error = error
          node.status({
            fill: 'yellow',
            shape: 'dot',
            text: 'navigate error'
          })
          send([null, msg])
          done()
        }
      }
    }
  })
}
