export class InvalidSessionError extends Error {
    constructor(message : string)  {
        super(message)
        this.name = "InvalidSessionError";
    }
}