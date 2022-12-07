import { checkIfCritical, replaceMustache, falseIfEmpty } from '../utils'
import { WebDriverAction, SeleniumNode, SeleniumNodeDef } from './node'
import { GenericNodeConstructor } from './node-constructor'

// tslint:disable-next-line: no-empty-interface
export interface NodeSwitchFrameDef extends SeleniumNodeDef {
  switchMode : 'id' | 'number' | 'parent' | 'top-context'
  frameNumber: string
}

// tslint:disable-next-line: no-empty-interface
export interface NodeSwitchFrame extends SeleniumNode {
}

async function inputAction(
  node: NodeSwitchFrame,
  conf: NodeSwitchFrameDef,
  action: WebDriverAction
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const msg = action.msg
    const switchMode = falseIfEmpty(replaceMustache(conf.switchMode, msg)) || msg.switchMode
    try {
      switch (switchMode) {
        case 'id':
          await msg.browser.frame().switch(msg.element.toString());
        break
        case 'number' :
          const frameNumber = parseInt(falseIfEmpty(replaceMustache(conf.frameNumber, msg)) || msg.frameNumber, 10)
          await msg.browser.frame().switch(frameNumber);
        break
        case 'top-context' : 
          await msg.browser.frame().switch(null);
        break
        case 'parent' : 
          await msg.browser.frame().parent();
        break
      }
      node.status({ fill: 'green', shape: 'dot', text: 'success' })
      if (msg.error) {
        delete msg.error
      }
      action.send([msg, null])
      action.done()
    } catch (err) {
      if (checkIfCritical(err)) {
        reject(err)
      } else {
        msg.error = {
          message: `Can't switch to the frame '${switchMode}' : ${err.message}`
        }
        node.warn(msg.error.message)
        node.status({
          fill: 'yellow',
          shape: 'dot',
          text: 'expected value error'
        })
        action.send([null, msg])
        action.done()
      }
    }
    resolve()
  })
}

const NodeSwitchFrameConstructor = GenericNodeConstructor(null, inputAction)

export { NodeSwitchFrameConstructor as NodeSwitchFrameConstructor }
