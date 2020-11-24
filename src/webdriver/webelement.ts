import { SimpleDriver } from "./webdriver"

export class WebElement {
    
    public constructor (driver : SimpleDriver, elementID : string) {
        this.id =  elementID;
        this.ELEMENT = elementID;
    }

    private ELEMENT : string;
    public id : string;
    private _driver : SimpleDriver;
    
    public click() : Promise<void> {
        throw new Error("Unsupported");
    }

    public getAttribute(name : string) : Promise<void> {
        throw new Error("Unsupported");
    }
    public getText() : Promise<void> {
        throw new Error("Unsupported");
    }

    public clear() : Promise<void> {
        throw new Error("Unsupported");
    }

    public sendKeys(keys : string) : Promise<void> {
        throw new Error("Unsupported");
    }
}