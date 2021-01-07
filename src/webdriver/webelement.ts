import { SimpleDriver } from "./webdriver"

export class WebElement {
    
    public constructor (driver : SimpleDriver, elementID : string) {
        this.ELEMENT = elementID;
        this["element-6066-11e4-a52e-4f735466cecf"] = elementID;
        this._driver = driver;
    }

    public readonly ELEMENT : string;
    public readonly "element-6066-11e4-a52e-4f735466cecf" : string
    private _driver : SimpleDriver;
    
    public click() : Promise<void> {
        return  this._driver.element(this).click();
    }

    public getAttribute(name : string) : Promise<string> {
        return this._driver.element(this).getAttribute(name);

    }
    public getText() : Promise<string> {
        return  this._driver.element(this).getText();
    }

    public clear() : Promise<void> {
        return  this._driver.element(this).clear();
    }

    public sendKeys(keys : string) : Promise<void> {
        return  this._driver.element(this).sendKeys(keys);
    }

    public toString() {
        return this.ELEMENT;
    }
}