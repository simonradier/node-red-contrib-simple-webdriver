export class LocationError extends Error {
    constructor(using : string, selector : string, timeout : number) {
        super("Cannot locate : " + selector + ", using " + using + " before end of timeout (" + timeout + ")");
        this.name = "LocationError";
    }
}