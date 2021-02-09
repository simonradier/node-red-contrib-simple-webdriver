import { ErrorDef, ResponseDef } from "../interface";
import { HttpResponse } from "../utils/http-client";

export class WebDriverResponseError extends Error {
    public httpResponse : HttpResponse<ResponseDef<ErrorDef>>;

    constructor(httpResponse : HttpResponse<ResponseDef<any>>) {
        const msg = "";
        super(msg);
        if (httpResponse.body.value && httpResponse.body.value.error)
            this.message = httpResponse.body.value.error + " : " + httpResponse.body.value.message;
        this.name = "WebDriverResponseError";
        this.httpResponse = httpResponse;
    }

}