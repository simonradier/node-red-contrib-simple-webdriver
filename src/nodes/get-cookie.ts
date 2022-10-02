import { CookieDef } from "@critik/simple-webdriver/dist/interface";
import {
  checkIfCritical,
  REDAPI,
  waitForValue,
  replaceMustache,
  falseIfEmpty,
} from "../utils";
import { WebDriverMessage, SeleniumNode, SeleniumNodeDef } from "./node";

// tslint:disable-next-line: no-empty-interface
export interface NodeGetCookieDef extends SeleniumNodeDef {
  cookieName: string;
}

// tslint:disable-next-line: no-empty-interface
export interface NodeGetCookie extends SeleniumNode {}

export function NodeGetCookieConstructor(
  this: NodeGetCookie,
  conf: NodeGetCookieDef
) {
  REDAPI.get().nodes.createNode(this, conf);
  this.status({});

  this.on("input", async (message: any, send, done) => {
    // Cheat to allow correct typing in typescript
    const msg: WebDriverMessage = message;
    const node = this;
    node.status({});
    if (msg.browser == null) {
      const error = new Error(
        "Can't use this node without a working open-browser node first"
      );
      node.status({ fill: "red", shape: "ring", text: "error" });
      done(error);
    } else {
      const name =
        falseIfEmpty(replaceMustache(conf.cookieName, msg)) || msg.cookieName;
      const timeout: number = parseInt(
        falseIfEmpty(replaceMustache(conf.timeout, msg)) || msg.timeout,
        10
      );
      const waitFor: number = parseInt(
        falseIfEmpty(replaceMustache(conf.waitFor, msg)) || msg.waitFor,
        10
      );
      setTimeout(async () => {
        try {
          const cookie: CookieDef = await waitForValue(
            timeout,
            (val: CookieDef) => {
              return val?.name == name && "value" in val;
            },
            (name: string) => {
              return msg.browser.cookie().get(name);
            },
            name
          );
          if (msg.error) {
            delete msg.error;
          }
          msg.payload = cookie;
          send([msg, null]);
          node.status({ fill: "green", shape: "dot", text: "success" });
          done();
        } catch (e) {
          if (checkIfCritical(e)) {
            node.status({ fill: "red", shape: "dot", text: "critical error" });
            done(e);
          }
          if (e.name == "WaitForError") {
            msg.payload = e.value;
            const error = {
              message: `Can't find cookie with name : ${name}`,
              name: "WaitForError",
            };
            node.warn(error.message);
            msg.error = error;
            node.status({ fill: "yellow", shape: "dot", text: "wrong title" });
            send([null, msg]);
            done();
          }
          node.status({ fill: "red", shape: "dot", text: "error" });
          node.error(
            "Can't get title of the browser window. Check msg.error for more information"
          );
          done(e);
        }
      }, waitFor);
    }
  });
}
