import { NodeAPI, NodeAPISettingsWithData } from "node-red";
import { WebDriver, Protocol } from "@critik/simple-webdriver"
import { portCheck } from "./utils";

export class WebDriverManager {
    private static _RED : NodeAPI<NodeAPISettingsWithData>;
    private static _serverURL : string = "";
    private static _webDriver : WebDriver

    public static get RED () {
        return WebDriverManager._RED;
    }

    public static init (RED : NodeAPI<NodeAPISettingsWithData>) : void {
        WebDriverManager._RED = RED;
    }

    /**
     * Define the configuration of the Webdriver Server and return a boolean if the server is reacheable
     * @param serverURL
     * @param browser
     */
    public static async setServerConfig(serverURL : string) : Promise<boolean> {
        WebDriverManager._serverURL = serverURL;

        const url = new URL(serverURL);
        const host = url.hostname
        const port = Number.parseInt(url.port)
        const check = await portCheck(host, port)
        if (!check)
            return false
        this._webDriver = new WebDriver(serverURL, Protocol.W3C);
        return true
    }

    public static checkIfCritical(error : Error) : boolean {
        // Blocking error in case of "WebDriverError : Failed to decode response from marionett"
        if (error.toString().includes("decode response"))
            return true;
        // Blocking error in case of "NoSuchSessionError: Tried to run command without establishing a connection"
        if (error.name.includes("NoSuchSessionError"))
            return true;
        // Blocking error in case of "ReferenceError" like in case of msg.driver is modified
        if (error.name.includes("ReferenceError"))
            return true;
        // Blocking error in case of "TypeError" like in case of msg.driver is modified
        if (error.name.includes("TypeError"))
            return true;
        return false;
    }

}