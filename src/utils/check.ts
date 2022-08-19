import { Socket } from "net";

export async function checkIfOnline(url_string: string): Promise<boolean> {
  const url: URL = new URL(url_string);
  const host = url.hostname;
  const port = Number.parseInt(url.port);
  return new Promise<boolean>((resolve) => {
    const socket = new Socket();
    let status: boolean = false;
    // Socket connection established, port is open
    socket.on("connect", () => {
      status = true;
      socket.end();
    });
    socket.setTimeout(2000); // If no response, assume port is not listening
    socket.on("timeout", () => {
      socket.destroy();
      resolve(status);
    });
    socket.on("error", (_) => {
      resolve(status);
    });
    socket.on("close", (_) => {
      resolve(status);
    });
    socket.connect(port, host);
  });
}

export function checkIfCritical(error: Error): boolean {
  // Blocking error in case of "WebDriverError : Failed to decode response from marionett"
  if (error.toString().includes("decode response")) return true;
  // Blocking error in case of "NoSuchSessionError: Tried to run command without establishing a connection"
  if (error.name.includes("NoSuchSessionError")) return true;
  // Blocking error in case of "ReferenceError" like in case of msg.driver is modified
  if (error.name.includes("ReferenceError")) return true;
  // Blocking error in case of "TypeError" like in case of msg.driver is modified
  if (error.name.includes("TypeError")) return true;
  return false;
}

export function falseIfEmpty(str: string): false | string {
  if (str === "") return false;
  return str;
}
