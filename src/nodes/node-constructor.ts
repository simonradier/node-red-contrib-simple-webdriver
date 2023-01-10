import { Element } from '@critik/simple-webdriver'
import { Node, NodeMessage } from 'node-red'
import { Observable } from 'rxjs'
import { checkIfCritical, falseIfEmpty, REDAPI, replaceMustache } from '../utils'
import {
  FindElementNodeConf,
  SimpleWebDriverAction,
  SimpleWebDriverMessage,
} from './node'

/**
 * Wait for the location of an element based on a target & selector.
 * @param driver A valid WebDriver instance
 * @param conf A configuration of a node
 * @param msg  A node message
 */
export function waitForElement(
  conf: FindElementNodeConf,
  msg: NodeMessage & SimpleWebDriverMessage<FindElementNodeConf>
): Observable<string | Element> {
  return new Observable<string | Element>(subscriber => {
    const waitFor: number = parseInt(
      falseIfEmpty(replaceMustache(conf.waitFor, msg)) || msg.waitFor,
      10
    )
    const timeout: number = parseInt(
      falseIfEmpty(replaceMustache(conf.timeout, msg)) || msg.timeout,
      10
    )
    const target: string = falseIfEmpty(replaceMustache(conf.target, msg)) || msg.target
    const selector: string =
      falseIfEmpty(replaceMustache(conf.selector, msg)) || msg.selector
    let element: Element
    subscriber.next('waiting for ' + (waitFor / 1000).toFixed(1) + ' s')
    setTimeout(async () => {
      try {
        subscriber.next('locating')
        if (selector && selector !== '') {
          // @ts-ignore
          element = await msg.browser.findElement(selector, target, timeout)
        } else {
          if (msg.element) {
            element = msg.element
          }
        }
        subscriber.next(element)
        subscriber.complete()
      } catch (e) {
        let error: any
        if (e.toString().includes('TimeoutError'))
          error = new Error(
            'catch timeout after ' +
              timeout +
              ' milliseconds for selector type ' +
              selector +
              ' for  ' +
              target
          )
        else error = e
        error.selector = selector
        error.target = target
        subscriber.error(error)
      }
    }, waitFor)
  })
}


export function GenericNodeConstructor<
  TNode extends Node<any>,
  TNodeDef extends FindElementNodeConf
>(
  inputPreCondAction: (
    node: TNode,
    conf: TNodeDef,
    action: SimpleWebDriverAction<TNodeDef>
  ) => Promise<boolean>,
  inputAction: (node: TNode, conf: TNodeDef, action: SimpleWebDriverAction<TNodeDef>) => Promise<void>,
  nodeCreation: () => void = null
) {
  return function (this: TNode, conf: TNodeDef): void {
    REDAPI.get().nodes.createNode(this, conf)
    const node = this
    node.status({})
    this.on('input', async (message: any, send, done) => {
      // Cheat to allow correct typing in typescript
      let msg: SimpleWebDriverMessage<TNodeDef> = message
      const action: SimpleWebDriverAction<TNodeDef> = { msg, send, done }
      node.status({})
      try {
        if (!inputPreCondAction || (await inputPreCondAction(node, conf, action))) {
          msg = action.msg
          if (msg.browser == null) {
            const error = new Error(
              "Can't use this node without a working open-browser node first. For node : " +
                conf.name
            )
            node.status({ fill: 'red', shape: 'ring', text: 'error' })
            done(error)
          } else {
            // If InputPreCond return false, next steps will not be executed
            waitForElement(conf, msg).subscribe({
              next(val) {
                if (typeof val === 'string') {
                  node.status({ fill: 'blue', shape: 'dot', text: val })
                } else {
                  msg.element = val
                }
              },
              error(err) {
                if (checkIfCritical(err)) {
                  node.status({
                    fill: 'red',
                    shape: 'dot',
                    text: 'critical error'
                  })
                  node.error(err.toString())
                  done(err)
                } else {
                  node.status({
                    fill: 'yellow',
                    shape: 'dot',
                    text: 'location error'
                  })
                  msg.error = err
                  send([null, msg])
                  done()
                }
              },
              async complete() {
                node.status({ fill: 'blue', shape: 'dot', text: 'located' })
                try {
                  await inputAction(node, conf, action)
                } catch (e) {
                  node.status({
                    fill: 'red',
                    shape: 'dot',
                    text: 'critical error'
                  })
                  node.error(e.toString())
                  delete msg.browser
                  done(e)
                }
              }
            })
          }
        }
      } catch (e) {
        node.status({ fill: 'red', shape: 'dot', text: 'critical error' })
        node.error(e.toString())
        delete msg.browser
        done(e)
      }
    })
    // Activity to do during Node Creation
    if (nodeCreation) nodeCreation()
  }
}
