import { NodeAPI, NodeAPISettingsWithData } from "node-red";

export class SeleniumManager {
    //private _driver : WebDriver;
    private static _connected : boolean = false;
    private static _connecting : boolean = false;
    private static _RED : NodeAPI<NodeAPISettingsWithData>;

    public static init (RED : NodeAPI<NodeAPISettingsWithData>) {
        //this._driver = new WebDriver();
        SeleniumManager._RED = RED;
    }
}