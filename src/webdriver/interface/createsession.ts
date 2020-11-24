import { WebDriverResponse } from "./webdriver-response";

export interface Session {
    acceptInsecureCerts: boolean,
    acceptSslCerts: boolean,
    applicationCacheEnabled: boolean,
    browserConnectionEnabled: boolean,
    browserName: string,
    cssSelectorsEnabled: boolean,
    databaseEnabled: boolean,
    handlesAlerts: boolean,
    hasTouchScreen: boolean,
    javascriptEnabled: boolean,
    locationContextEnabled: boolean,
    mobileEmulationEnabled: boolean,
    nativeEvents: boolean,
    networkConnectionEnabled: boolean,
    pageLoadStrategy: string,
    platform: string,
    proxy: {},
    rotatable: boolean,
    setWindowRect: boolean,
    strictFileInteractability: boolean,
    takesHeapSnapshot: boolean,
    takesScreenshot: boolean,
    timeouts: {
      implicit: number,
      pageLoad: number,
      script: number
    },
    unexpectedAlertBehaviour: string,
    version : string,
    webStorageEnabled: boolean,
    "webauthn:virtualAuthenticators" : boolean
}
