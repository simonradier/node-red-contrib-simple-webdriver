export class WebDriverError extends Error {
    constructor(message : string)  {
        super(message)
        this.name = "WebdriverError";
    }
}