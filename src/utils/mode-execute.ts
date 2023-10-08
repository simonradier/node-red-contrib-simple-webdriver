import { Element } from '@critik/simple-webdriver'
import { Observable } from 'rxjs'
import { Mode } from '../nodes/node'

const addLast = (obj: [any, any]) => {
  if (obj[0] != null) obj[0].last = true
  else obj[1].last = true
}

export const modeExecute = (
  mode: Mode,
  elements: Array<Element>,
  func: (e: Element) => Promise<[any, any]>
) => {
  return new Observable<[any | null, any | null]>(subscriber => {
    ;(async () => {
      if (!mode || !elements)
        // For compatibility
        mode = Mode.First
      let skip = false
      switch (mode) {
        case Mode.First:
          subscriber.next(await func(elements ? elements[0] : null))
          break
        case Mode.AllEachMsg:
          for (const [i, e] of elements.entries()) {
            const result = await func(e)
            if (i == elements.length - 1) addLast(result)
            subscriber.next(result)
          }
          break
        case Mode.AllLastMsg:
          for (const [i, e] of elements.entries()) {
            if (i == elements.length - 1) {
              const result = await func(e)
              addLast(result)
              subscriber.next(result)
            } else await func(e)
          }
          break
        case Mode.AllErrorStopEachMsg:
          for (const [i, e] of elements.entries()) {
            let result: [any, any]
            if (!skip) {
              result = await func(e)
              if (result[0] === null) skip = true
              if (skip || i == elements.length - 1) addLast(result)
              subscriber.next(result)
            }
          }
          break
        case Mode.AllErrorStopLastMsg:
          for (const [i, e] of elements.entries()) {
            let result: [any, any]
            if (!skip) {
              result = await func(e)
              if (result[0] == null) skip = true
              // If skip = true mean it will be the last action done.
              if (skip || i == elements.length - 1) {
                addLast(result)
                subscriber.next(result)
              }
            }
          }
          break
      }
      subscriber.complete()
    })()
  })
}
