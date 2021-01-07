import { ErrorDef, ResponseDef } from "./interface/interface";
import { HttpResponse } from "./utils/http-client";

export class LocationError extends Error {
    constructor(using : string, selector : string, timeout : number) {
        super("Cannot locate : " + selector + ", using " + using + " before end of timeout (" + timeout + ")");
        this.name = "LocationError";
    }
}

export class InvalidSessionError extends Error {
    constructor(message : string)  {
        super(message)
        this.name = "InvalidSessionError";
    }
}

class WebDriverResponseError extends Error {
    public httpResponse : HttpResponse<ResponseDef<ErrorDef>>;
    
    constructor(httpResponse : HttpResponse<ResponseDef<ErrorDef>>) {
        let msg = "";
        super(msg);
        this.message = httpResponse.body.value.error + " : " + httpResponse.body.value.message;
        this.name = "WebDriverResponseError";
        this.httpResponse = httpResponse;
    }
}