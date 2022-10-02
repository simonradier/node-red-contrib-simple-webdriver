import { Timer } from './timer'

export class WaitForError extends Error {
  value: any
  name: string = 'WaitForError'
}

export async function waitForValue<T>(
  timeout: number,
  expectedValue: ((value: T) => boolean) | T,
  func: (...args) => Promise<T>,
  ...args
): Promise<T> {
  let value: T
  let found = false
  const timer = new Timer(timeout)

  if (expectedValue instanceof Function) {
    do {
      value = await func(...args)
      if (expectedValue(value)) found = true
    } while (!found && !timer.done)
  } else {
    do {
      value = await func(...args)
      if (value == expectedValue) found = true
    } while (!found && !timer.done)
  }
  if (found) return value

  const error = new Error(`Timeout before value is found, last value returned : ${value}`)
  error.name = 'WaitForError'
  throw error
}
