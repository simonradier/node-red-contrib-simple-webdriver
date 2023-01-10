import { checkIfCritical, replaceMustache, falseIfEmpty } from '../utils'
import { FindElementNodeConf, GenericNodeConstructor, SimpleWebDriverAction, SimpleWebdriverNode } from './node'

// tslint:disable-next-line: no-empty-interface
export interface NodeGetAttributeConf extends FindElementNodeConf {
  expected: string
  attribute: string
  property: string
}

// tslint:disable-next-line: no-empty-interface
export interface NodeGetAttribute extends SimpleWebdriverNode {
  property: string
}

async function inputAction(
  node: NodeGetAttribute,
  conf: NodeGetAttributeConf,
  action: SimpleWebDriverAction<NodeGetAttributeConf>
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const msg = action.msg
    const expected = falseIfEmpty(replaceMustache(conf.expected, msg)) || msg.expected
    const attribute = falseIfEmpty(replaceMustache(conf.attribute, msg)) || msg.attribute
    const property = falseIfEmpty(replaceMustache(conf.property, msg)) || msg.property
    let mode = "attibute"
    try {
      if (attribute && attribute !== '')
        msg.payload = await msg.element.getAttribute(attribute)
      else { 
        msg.payload = await msg.element.getProperty(property)
        mode = "property"
      }
      if (expected && expected !== msg.payload) {
        msg.error = {
          message: `Expected ${mode} ${attribute || property} value is not aligned, expected : ${expected}, value : ${msg.payload}`
        }
        node.status({ fill: 'yellow', shape: 'dot', text: `get ${mode} error` })
        action.send([null, msg])
        action.done()
      } else {
        node.status({ fill: 'green', shape: 'dot', text: 'success' })
        if (msg.error) {
          delete msg.error
        }
        action.send([msg, null])
        action.done()
      }
    } catch (err) {
      if (checkIfCritical(err)) {
        reject(err)
      } else {
        msg.error = {
          message: `Can't get ${mode} of the element : ${err.message}`
        }
        node.warn(msg.error.message)
        node.status({
          fill: 'yellow',
          shape: 'dot',
          text: `get-${mode} error`
        })
        action.send([null, msg])
        action.done()
      }
    }
    resolve()
  })
}

const NodeGetAttributeConstructor = GenericNodeConstructor(null, inputAction)

export { NodeGetAttributeConstructor as NodeGetAttributeConstructor }
