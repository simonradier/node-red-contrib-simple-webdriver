import { RequestOptions } from "http";


export interface ResponseDef<T> {
    value: T;
    status? : number;
    sessionId? : string;
}