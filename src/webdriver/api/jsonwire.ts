import { WDAPIDef, RequestDef } from "../interface";
import { CookieDef } from "../interface/cookie";

export class JSONWire implements WDAPIDef {
    SESSION_START(browser: string, headless: boolean): RequestDef {
        throw new Error("Method not implemented.");
    }
    SESSION_STOP(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    NAVIGATE_TO(sessionId: string, url: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    NAVIGATE_CURRENTURL(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    NAVIGATE_REFRESH(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    NAVIGATE_BACK(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    NAVIGATE_FORWARD(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    WINDOW_GETTITLE(sessionId: string, handle: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    WINDOW_GETHANDLE(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    WINDOW_GETHANDLES(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    WINDOW_SETRECT(sessionId: string, handle: string, width: number, height: number): RequestDef {
        throw new Error("Method not implemented.");
    }
    WINDOW_GETRECT(sessionId: string, handle: string, width: number, height: number): RequestDef {
        throw new Error("Method not implemented.");
    }
    WINDOW_MAXIMIZE(sessionId: string, handle: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    WINDOW_MINIMIZE(sessionId: string, handle: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    WINDOW_FULLSCREEN(sessionId: string, handle: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    WINDOW_CLOSE(sessionId: string, handle: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    WINDOW_SWITCH(sessionId: string, handle: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    WINDOW_SCREENSHOT(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    FRAME_SWITCH(sessionId: string, frameId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    FRAME_TOPARENT(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    FINDELEMENT(sessionId: string, using: string, value: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    FINDELEMENTS(sessionId: string, using: string, value: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    GETACTIVEELEMENT(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_FINDELEMENT(sessionId: string, element: string, using: string, value: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_FINDELEMENTS(sessionId: string, element: string, using: string, value: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_GETATTRIBUTE(sessionId: string, element: string, attribute: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_GETPROPERTY(sessionId: string, element: string, property: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_GETCSS(sessionId: string, element: string, cssProperty: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_GETTEXT(sessionId: string, element: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_GETTAGNAME(sessionId: string, element: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_GETRECT(sessionId: string, element: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_SCREENSHOT(sessionId: string, element: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_CLICK(sessionId: string, element: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_CLEAR(sessionId: string, element: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_ISENABLED(sessionId: string, element: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_ISSELECTED(sessionId: string, element: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ELEMENT_SENDKEYS(sessionId: string, element: string, keys: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    EXECUTE_SYNC(sessionId: string, script: string, ...args: any[]): RequestDef {
        throw new Error("Method not implemented.");
    }
    EXECUTE_ASYNC(sessionId: string, script: string, ...args: any[]): RequestDef {
        throw new Error("Method not implemented.");
    }
    COOKIE_GETALL(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    COOKIE_GET(sessionId: string, name: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    COOKIE_ADD(sessionId: string, cookie : CookieDef): RequestDef {
        throw new Error("Method not implemented.");
    }
    COOKIE_DELETE(sessionId: string, name: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    COOKIE_DELETEALL(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ALERT_ACCEPT(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ALERT_DISMISS(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ALERT_GETTEXT(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
    ALERT_SENDTEXT(sessionId: string, text : string): RequestDef {
        throw new Error("Method not implemented.");
    }
}