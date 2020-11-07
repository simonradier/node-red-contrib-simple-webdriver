import { RequestOptions } from "http";
import { call } from "../utils/http-client";

class WebDriverRequest {
    public requestOptions : RequestOptions;
    public data? : any;
    public path : string;
}

export async function webDriverCall<T>(url : string, request : WebDriverRequest) {
    request.requestOptions.headers = { "Content-Type" : "application/json" }
    return call(url + request.path, request.requestOptions, request.data);
}

export function SESSION(browser : string) : WebDriverRequest {
    let result = new WebDriverRequest();
    result.data = { desiredCapabilities : {
        browserName : browser
    } };
    result.path = "/session";
    result.requestOptions = { method : "POST" }
    return result;
}