import { RequestOptions } from "http"

export interface RequestDef {
    requestOptions : RequestOptions;
    data : any;
    path : string;
}