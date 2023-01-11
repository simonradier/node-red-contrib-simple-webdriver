import { NodeMessageInFlow } from 'node-red__registry'
import { Node, NodeDef, NodeMessage } from 'node-red'
import { Browser, Element } from '@critik/simple-webdriver'

export * from './open-browser'
export * from './close-browser'
export * from './find-element'
export * from './get-title'
export * from './click-on'
export * from './send-keys'
export * from './get-cookie'
export * from './set-cookie'
export * from './get-value'
export * from './set-value'
export * from './get-attribute'
export * from './get-text'
export * from './run-script'
export * from './screenshot'
export * from './set-attribute'
export * from './switch-frame'

export type SimpleWebdriverNodeConf = NodeDef & {
  // inputs
  waitFor : string
}

export interface FindElementNodeConf extends SimpleWebdriverNodeConf {
  // inputs
  selector : string
  target : string
  timeout : string
  multiple : string
  // ouputs
  element : Element
}

export interface SimpleWebdriverNode extends Node<any> {}

export interface SimpleWebDriverAction<T> {
  done: (err?: Error) => void
  send: (msg: NodeMessage | NodeMessage[]) => void
  msg: SimpleWebDriverMessage<T>
}

export type SimpleWebDriverMessage<T extends {}> = { [Property in keyof T]?: T[Property] } & NodeMessageInFlow & {
  browser? : Browser
  error? : any
}

/*{
  browser: Browser
  selector?: string
  // Node-red only push string from properties if modified by user
  target?: string
  timeout?: string
  waitFor?: string
  error?: any
  element?: Element | Array<Element>
  webTitle?: string
  clickEvent?: boolean
  clearVal?: boolean
  keys?: string
  value?: string
  expected?: string
  attribute?: string
  property?: string
  script?: string
  url?: string
  navType?: string
  filePath?: string
  cookieName?: string
  cookie?: CookieDef
  frameNumber: string
  switchMode : 'id' | 'number' | 'parent' | 'top-context'
}*/
