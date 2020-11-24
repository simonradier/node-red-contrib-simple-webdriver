import { RequestOptions } from "http";
import * as httpclient from "./utils/http-client";
import { WebDriverResponse, WebDriverRequest } from "./interface/interface"
import { WDError } from "./interface/wd-error";



class WebDriverHttpError<T> extends Error {
    public httpResponse : httpclient.HttpResponse<WebDriverResponse<WDError>>;
    
    constructor(httpResponse : httpclient.HttpResponse<WebDriverResponse<WDError>>) {
        let msg = "";
        if (httpResponse.statusCode != 200)
            msg = "CallError : " + httpResponse.body.value.error + " : " + httpResponse.body.value.message;
        else
            msg = "WebDriverError : status = " + httpResponse.body.status + " | " + httpResponse.body.value.message;
        super(msg);
        this.httpResponse = httpResponse;
    }
}

class WebDriverResponseError {
    message : string;    
}

export async function call<T>(url : string, request : WebDriverRequest) {
    return new Promise<httpclient.HttpResponse<WebDriverResponse<T>>>(async (resolve, reject) => {
        request.requestOptions.headers = { "Content-Type" : "application/json" }
        console.log(url + request.path);
        console.log(request);
        let resp = await httpclient.call<WebDriverResponse<T>>(url + request.path, request.requestOptions, request.data);
        if (resp.statusCode != 200 || resp.body.status != 0)
            // @ts-ignore
            reject(new WebDriverHttpError(resp));
        else {
            resolve(resp);
        }
    })

}
//#region  SESSION
export function STARTSESSION(browser : string, headless : boolean = false) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.data = { desiredCapabilities : {
        browserName : browser
    } };
    //result.data.desiredCapabilities[browser + "Options"] = { args : new Array()};
    let browerOptions = "browserOptions";
    switch (browser) {
        case "chrome" : 
            browerOptions = "goog:chromeOptions";
    }
    if (headless)
        result.data.desiredCapabilities[browerOptions].args.push("--headless");
    result.path = "/session";
    result.requestOptions = { method : "POST" }
    return result;
}

export function STOPSESSION(sessionId : string) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId;
    result.requestOptions = { method : "DELETE" }
    return result;
}
//#endregion

//#region N
export function NAVIGATE_TO(sessionId : string, url : string) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId + "/url";
    result.requestOptions = { method : "POST" }
    result.data = { url }
    return result;
}

export function NAVIGATE_REFRESH(sessionId : string) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId + "/refresh";
    result.requestOptions = { method : "POST" }
    return result;
}

export function NAVIGATE_BACK(sessionId : string,) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId + "/back";
    result.requestOptions = { method : "POST" }
    return result;
}

export function NAVIGATE_FORWARD(sessionId : string) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId + "/forward";
    result.requestOptions = { method : "POST" }
    return result;
}

export function GETTITLE(sessionId : string) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId + "/title";
    result.requestOptions = { method : "GET" }
    return result;
}

//#endregion

export function SETSIZE(sessionId : string, width : number, height : number) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId + "/window/rect";
    result.requestOptions = { method : "POST" }
    result.data = { width : width, height : height}
    return result;
}

export function MAXIMIZE(sessionId : string) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId + "/window/maximize";
    result.requestOptions = { method : "POST" }
    return result;
}

export function MINIMIZE(sessionId : string) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId + "/window/minimize";
    result.requestOptions = { method : "POST" }
    return result;
}

export function FULLSCREEN(sessionId : string) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId + "/window/fullscreen";
    result.requestOptions = { method : "POST" }
    return result;
}

export function FINDELEMENT(sessionId : string, using : string, value : string) {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId + "/element";
    result.requestOptions = { method : "POST" }
    result.data = { using, value }
    return result;  
}

export function EXECUTE_SYNC(sessionId : string, script : string, args : any[]) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId + "/execute/sync";
    result.requestOptions = { method : "POST" }
    result.data = { script, args }
    return result;
}

export function EXECUTE_ASYNC(sessionId : string, script : string, args : any[]) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId + "/execute/async";
    result.requestOptions = { method : "POST" }
    result.data = { script, args }
    return result;
}