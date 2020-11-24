import { RequestOptions } from "http";


export interface WebDriverResponse<T> {
    sessionId: string,
    status: number,
    value: T;
}

export class WebDriverRequest {
    public requestOptions : RequestOptions;
    public data : any = null;
    public path : string;
}