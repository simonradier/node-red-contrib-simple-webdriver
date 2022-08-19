export class WaitForError extends Error {
  value: any;
  name: string = "WaitForError";
}

export async function waitForValue<T>(
  param: any[],
  func: (...args) => Promise<T>,
  expectedValue: T,
  timeout: number
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    setTimeout(() => {
      const err = new WaitForError();
      err.message = "Cannot resolve expected value : " + value;
      err.value = value;
      reject(err);
    }, timeout);

    let value: T;
    do {
      value = await func(param);
    } while (value == expectedValue);
    resolve(value);
  });
}
