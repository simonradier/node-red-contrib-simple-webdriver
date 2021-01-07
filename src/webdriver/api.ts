import { RequestOptions } from "http";
import * as httpclient from "./utils/http-client";
import { ResponseDef, RequestDef } from "./interface/interface"
import { ErrorDef } from "./interface/error";
import { WebElement } from "./webelement";
import { Logger } from "./utils/logger";

export class WebDriverRequest implements RequestDef {
    public requestOptions : RequestOptions;
    public data : any = null;
    public path : string;
}

export async function call<T>(url : string, request : RequestDef) {
    return new Promise<httpclient.HttpResponse<ResponseDef<T>>>(async (resolve, reject) => {
        Logger.trace("Calling :" + url + request.path);
        const resp = await httpclient.call<ResponseDef<T>>(url + request.path, request.requestOptions, request.data);
        if (resp.statusCode !== 200 || (resp.body.status && resp.body.status !== 0)) {
            reject(new WebDriverHttpError(resp));
            Logger.debug(request);
            Logger.debug(resp);
        } else {
            resolve(resp);
        }
    })

}

export * from "./api/jsonwire"
export * from "./api/w3c"