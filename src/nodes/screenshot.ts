import {
  FindElementNodeConf,
  Mode,
  SimpleWebDriverAction,
  SimpleWebdriverNode,
} from './node'
import * as fs from 'fs'
import { checkIfCritical, replaceMustache, falseIfEmpty, sleep } from '../utils'
import { GenericNodeConstructor } from './node-constructor'
import { modeExecute } from '../utils/mode-execute'
import { Element } from '@critik/simple-webdriver'

// tslint:disable-next-line: no-empty-interface
export interface NodeScreenshotConf extends FindElementNodeConf {
  filePath: string,
  fullscreen: boolean
}

// tslint:disable-next-line: no-empty-interface
export interface NodeScreenshot extends SimpleWebdriverNode {}

async function inputAction(
  node: NodeScreenshot,
  conf: NodeScreenshotConf,
  action: SimpleWebDriverAction<NodeScreenshotConf>
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const msg = action.msg
    const mode: Mode = <Mode>falseIfEmpty(conf.mode) || msg.mode
    const fullscreen: boolean = conf.fullscreen || msg.fullscreen
    const waitFor: number = parseInt(
      falseIfEmpty(replaceMustache(conf.waitFor, msg)) || msg.waitFor,
      10
    )

    const filePath: string = falseIfEmpty(replaceMustache(conf.filePath, msg)) || msg.filePath
    if (fullscreen) {
      try {
        await sleep(waitFor)
        const sc = await msg.browser.screenshot()
        if (filePath) await fs.promises.writeFile(filePath, sc, 'base64')
        msg.payload = sc
        action.send([msg, null])
        node.status({ fill: 'green', shape: 'dot', text: 'success' })
        action.done()
        resolve()
      } catch (err) {
        if (checkIfCritical(err))
           reject (err)
        else {
          msg.error = {
            message: `Can't take a screenshot of the element : ${err.message}`
          }
          node.warn(msg.error.message)
          node.status({
            fill: 'yellow',
            shape: 'dot',
            text: 'expected value error'
          })
          action.send([null, msg])
          resolve()
        }
      }
    } else {
      const scList: string[] = []
      modeExecute(mode, msg.elements, async (e: Element) => {
        try {
          const sc = await e.screenshot()
          msg.payload = sc
          scList.push(sc)
          node.status({ fill: 'green', shape: 'dot', text: 'success' })
          if (msg.error) {
            delete msg.error
          }
          return [msg, null]
        } catch (err) {
          if (checkIfCritical(err)) {
            reject(err)
          } else {
            msg.error = { message: `Can't take a screenshot of the element : ${err.message}` }
            node.warn(msg.error.message)
            node.status({
              fill: 'yellow',
              shape: 'dot',
              text: 'screenshot error'
            })
            return [null, msg]
          }
        }
      }).subscribe({
        next(val) {
          action.send(val)
        },
        async complete() {
          action.done()
          if (filePath)
            await saveFiles(scList, filePath)
          resolve()
        }
      })
    }
  })
}

const saveFiles = async (scList: string[], filePath: string) => {
  if (scList.length == 1)
    await fs.promises.writeFile(filePath, scList[0], 'base64')
  else { 
    for (const [i, sc] of scList.entries()) {
      await fs.promises.writeFile(`${filePath}-${i}`, sc, 'base64')
    }
  }
}

const NodeScreenshotConstructor = GenericNodeConstructor(null, inputAction)

export { NodeScreenshotConstructor as NodeScreenshotConstructor }
