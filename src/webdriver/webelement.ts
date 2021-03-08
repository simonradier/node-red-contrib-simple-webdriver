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

    public getAttribute(attributeName : string) : Promise<string> {
        return this._driver.element(this).getAttribute(attributeName);

    }

    public getProperty(propertyName : string) : Promise<string> {
        return this._driver.element(this).getProperty(propertyName);
    }

    public getTagName() : Promise<string> {
        return this._driver.element(this).getTagName();
    }

    public getCSSValue(cssPropertyName : string) : Promise<string> {
        return this._driver.element(this).getCSSValue(cssPropertyName);
    }

    public getValue() : Promise<string> {
        return this._driver.element(this).getValue();

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

    public isSelected() : Promise<boolean> {
        return this._driver.element(this).isSelected();
    }

    public isEnabled() : Promise<boolean> {
        return this._driver.element(this).isEnabled();
    }

    public toString() {
        return this["element-6066-11e4-a52e-4f735466cecf"];
    }
}