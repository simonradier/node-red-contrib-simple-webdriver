import { Element } from '@critik/simple-webdriver'
import { Observable } from 'rxjs'
import { Mode } from '../nodes/node'

export const modeExecute = (
  mode: Mode,
  elements: Array<Element>,
  func: (e: Element) => Promise<[any, any]>
) => {
  return new Observable<[any | null, any | null]>(subscriber => {
    ;(async () => {
      if (!mode)
        // For compatibility
        mode = Mode.First
      let skip = false
      switch (mode) {
        case Mode.First:
          subscriber.next(await func(elements[0]))
          break
        case Mode.AllEachMsg:
          for (const e of elements) {
            subscriber.next(await func(e))
          }
          break
        case Mode.AllLastMsg:
          for (const [i, e] of elements.entries()) {
            if (i == elements.length - 1) subscriber.next(await func(e))
            else await func(e)
          }
          break
        case Mode.AllErrorStopEachMsg:
          for (const e of elements) {
            let result: [any, any]
            if (!skip) {
              result = await func(e)
              subscriber.next(result)
              if (result[0] === null) 
                skip = true
            }
          }
          break
        case Mode.AllErrorStopLastMsg:
          for (const [i, e] of elements.entries()) {
            let result: [any, any]
            if (!skip) {
              result = await func(e)
              if (result[0] == null)
                skip = true
              // If skip = true mean it will be the last action done.
              if (skip || i == elements.length - 1) {
                subscriber.next(result)
              }
            }
          }
        break
        case Mode.AllOnlyError:
          for (const e of elements) {
            const result = await func(e)
            if (result[0] == null) {
              subscriber.next(result)
            }
          }
          break
        case Mode.AllOnlySuccess:
          for (const e of elements) {
            const result = await func(e)
            if (result[0] != null) {
              subscriber.next(result)
            }
          }
          break
      }
      subscriber.complete()
    })()
  })
}
/*
    switch (mode) {
        case Mode.First : 
            return await func(elements[0]);
        break
        case Mode.AllContinueEachMsg :
            elements.map()
    }
}

/* 
modeExecute(conf.mode, msg.elements, async (e : Element) => {

}).subscribe({
    next(val) {
       action.send(val);
    },
    complete() {
        action.done();
        resolve();
    }
})
*/
