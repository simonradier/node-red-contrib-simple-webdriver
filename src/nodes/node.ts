import { NodeMessageInFlow } from "node-red__registry";
import { Node, NodeDef, NodeMessage } from "node-red";
import { Observable } from "rxjs";
import { WebDriver, Using, Browser, Element, BrowserType } from "@critik/simple-webdriver";


export * from "./open-browser";
export * from "./close-browser";
export * from "./find-element";
export * from "./get-title";
export * from "./click-on";
export * from "./send-keys";
export * from "./get-value";
export * from "./set-value";
export * from "./get-attribute";
export * from "./get-text";
export * from "./run-script";
export * from "./screenshot";
export * from "./set-attribute";

export interface SeleniumNodeDef extends NodeDef {
    selector : string;
    target : string;
    // Node-red only push string from properties if modified by user
    timeout : string;
    waitFor : string;
}

export interface SeleniumNode extends Node<any> {

}

export interface WebDriverAction {
    done : (err? : Error) => void;
    send : (msg: NodeMessage | NodeMessage[]) => void;
    msg : WebDriverMessage;
}

export interface WebDriverMessage extends NodeMessageInFlow {
    browser : Browser;
    selector? : string;
    // Node-red only push string from properties if modified by user
    target? : string;
    timeout? : string;
    waitFor? : string;
    error? : any;
    element? : Element;
    webTitle? : string;
    click? : boolean;
    clearVal? : boolean;
    keys? : string;
    value? : string;
    expected? : string;
    attribute? : string;
    script? : string;
    url? : string;
    navType? : string;
    filePath? : string;
}

/**
 * Wait for the location of an element based on a target & selector.
 * @param driver A valid WebDriver instance
 * @param conf A configuration of a node
 * @param msg  A node message
 */
export function waitForElement(conf : SeleniumNodeDef, msg : WebDriverMessage) : Observable<string | Element>{
    return new Observable<string | Element> ((subscriber) => {
        const waitFor : number = parseInt(msg.waitFor ?? conf.waitFor,10);
        const timeout : number = parseInt(msg.timeout ?? conf.timeout, 10);
        const target : string = msg.target ?? conf.target;
        const selector : string = msg.selector ?? conf.selector;
        let element : Element;
        subscriber.next("waiting for " + (waitFor / 1000).toFixed(1) + " s");
        setTimeout (async () => {
            try {
                subscriber.next("locating");
                if (selector !== "") {
                    // @ts-ignore
                    element = await msg.browser.findElement(selector, target, timeout);
                } else {
                    if (msg.element) {
                       element = msg.element;
                    }
                }
                subscriber.next(element);
                subscriber.complete();
            } catch (e) {
                let error : any;
                if (e.toString().includes("TimeoutError"))
                    error = new Error("catch timeout after " + timeout + " milliseconds for selector type " + selector +  " for  " + target);
                else
                    error = e;
                error.selector = selector;
                error.target = target;
                subscriber.error(error);
            }
        }, waitFor);
    });
}

