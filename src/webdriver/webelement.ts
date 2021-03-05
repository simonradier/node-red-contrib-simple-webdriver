import { SimpleWebDriver } from "./webdriver"

export class WebElement {

    public get ELEMENT () {
        return this["element-6066-11e4-a52e-4f735466cecf"];
    }

    public constructor (driver : SimpleWebDriver, elementID : string) {
        this["element-6066-11e4-a52e-4f735466cecf"] = elementID;
        this._driver = driver;
    }

    public readonly "element-6066-11e4-a52e-4f735466cecf" : string
    private _driver : SimpleWebDriver;

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
        return this["element-6066-11e4-a52e-4f735466cecf"];
    }
}