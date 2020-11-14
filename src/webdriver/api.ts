import { RequestOptions } from "http";
import { call, HttpResponse } from "../utils/http-client";

class WebDriverRequest {
    public requestOptions : RequestOptions;
    public data : any = null;
    public path : string;
}

class WebDriverHttpError<T> extends Error {
    public httpResponse : HttpResponse<T>;
}

export async function webDriverCall<T>(url : string, request : WebDriverRequest) {
    return new Promise<HttpResponse<T>>(async (resolve, reject) => {
        request.requestOptions.headers = { "Content-Type" : "application/json" }
        console.log(url + request.path);
        console.log(request);
        let resp = await call<T>(url + request.path, request.requestOptions, request.data);
        if (resp.statusCode >= 200 && resp.statusCode <= 299)
            resolve(resp);
        else {
            let error = new WebDriverHttpError<T>("unexpected response from webdriver server");
            error.httpResponse = resp;
            console.log(resp);
            reject(error);
        }
    })

}

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

export function STOPSESSION(sessionId : string) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.path = "/session/" + sessionId;
    result.requestOptions = { method : "DELETE" }
    return result;
}