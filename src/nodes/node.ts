import { NodeMessageInFlow } from "node-red__registry";
import { WebDriver } from "selenium-webdriver";

export * from "./open-web";
export * from "./close-web";
export * from "./selenium-server";

export interface SeleniumNode {
    selector : string;
    target : string;
    timeout : number;
    waitfor : number;
}

export interface SeleniumMsg extends NodeMessageInFlow {
    driver : WebDriver | null;
    selector? : string;
    target? : string;
    timeout? : number;
    waitFor? : number;
    error? : any;
}