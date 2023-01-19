import { Timer } from './timer'

export class WaitForError extends Error {
  value: any
  name: string = 'WaitForError'
}

export async function waitForValue<T>(
  timeout: number,
  expectedValue: ((value: T) => boolean) | T,
  func: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<T> {
  let value: T
  let found = false
  const timer = new Timer(timeout)
  let err: any

  if (expectedValue instanceof Function) {
    do {
      try {
        value = await func(...args)
        if (expectedValue(value)) found = true
      } catch (e) {
        err = e
      }
    } while (!found && !timer.done)
  } else {
    do {
      try {
        value = await func(...args)
        if (value == expectedValue) found = true
      } catch (e) {
        err = e
      }
    } while (!found && !timer.done)
  }
  if (found) return value

  const error = {
    message: `Timeout before value is found, last value returned : ${value}`,
    name: 'WaitForError',
    parent: err
  }
  throw error
}
