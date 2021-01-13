import { ResponseDef } from "./response";
import { TimeoutsDef } from "./timeouts";

export interface SessionDef {
    sessionId : string;
    capabilities: {
      acceptInsecureCerts: boolean,
      browserName: string,
      browserVersion: string,
      chrome: {
          chromedriverVersion: string,
          userDataDir: string
      },
      networkConnectionEnabled: boolean,
      pageLoadStrategy: string,
      platformName: string,
      proxy: {},
      setWindowRect: true,
      strictFileInteractability: false,
      timeouts: TimeoutsDef,
      unhandledPromptBehavior: string,
      "webauthn:virtualAuthenticators": true
  }
}
