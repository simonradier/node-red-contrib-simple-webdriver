import { NodeMessageInFlow } from "node-red__registry";
import { Node, NodeDef, NodeMessage } from "node-red";
import { Observable } from "rxjs";
import { By, until, WebDriver, WebElement } from "selenium-webdriver";


export * from "./open-web";
export * from "./close-web";
export * from "./find-element";
export * from "./selenium-server";
export * from "./get-title";
export * from "./click-on";
export * from "./send-keys";
export * from "./get-value";
export * from "./set-value";
export * from "./get-attribute";
export * from "./get-text";


export interface SeleniumNodeDef extends NodeDef {
    selector : string;
    target : string;
    timeout : number;
    waitFor : number;
}

export interface SeleniumNode extends Node<any> {

}

export interface SeleniumAction {
    done : (err? : Error) => void;
    send : (msg: NodeMessage | NodeMessage[]) => void;
    msg : SeleniumMsg;
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
    click? : boolean;
    clearVal? : boolean;
    value? : string;
    expected? : string;
    attribute? : string;
}

/**
 * Wait for the location of an element based on a target & selector.
 * @param driver A valid WebDriver instance 
 * @param conf A configuration of a node
 * @param msg  A node message
 */
export function waitForElement(conf : SeleniumNodeDef, msg : SeleniumMsg) : Observable<string | WebElement>{
    return new Observable<string | WebElement> ((subscriber) => {
        let waitFor : number = msg.waitFor ?? conf.waitFor;
        let timeout : number = msg.timeout ?? conf.timeout;
        let target : string = msg.target ?? conf.target;
        let selector : string = msg.selector ?? conf.selector;
        let element : WebElement;
        subscriber.next("waiting for " + (waitFor / 1000).toFixed(1) + " s");
        setTimeout (async () => {
            try {
                subscriber.next("locating");
                if (target != "" && selector != "") {
                       //@ts-ignore
                    element = await msg.driver.wait(until.elementLocated(By[selector](target)), timeout);
                } else {
                    if (msg.element) {
                       element = msg.element;
                    } else {

                    }
                }
                subscriber.next(element);
                subscriber.complete();
            } catch (e) {
                let error : any = new Error("catch timeout after " + timeout + " milliseconds for selector type " + selector +  " for  " + target);
                error.selector = selector;
                error.target = target;
                console.log(e);
                subscriber.error(error);
            }
        }, waitFor);
    });
}
