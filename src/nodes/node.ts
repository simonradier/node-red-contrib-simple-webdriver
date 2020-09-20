import { NodeMessageInFlow } from "node-red__registry";
import { WebDriver, WebElement } from "selenium-webdriver";

export * from "./open-web";
export * from "./close-web";
export * from "./find-element";
export * from "./selenium-server";

export interface SeleniumNode {
    selector : string;
    target : string;
    timeout : number;
    waitFor : number;
}

export interface SeleniumMsg extends NodeMessageInFlow {
    driver : WebDriver | null;
    selector? : string;
    target? : string;
    timeout? : number;
    waitFor? : number;
    error? : any;
    element? : WebElement;
    webTitle? : string;
}