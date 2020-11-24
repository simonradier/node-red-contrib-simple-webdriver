import { NodeAPI, NodeAPISettingsWithData } from "node-red";
import { NodeOpenWebDef } from "./nodes/node";
import { portCheck } from "./utils";

export class WD2Manager {
    private static _RED : NodeAPI<NodeAPISettingsWithData>;
    private static _serverURL : string = "";

    public static get RED () {
        return WD2Manager._RED;
    }

    public static init (RED : NodeAPI<NodeAPISettingsWithData>) : void {
        WD2Manager._RED = RED;
    }

    /**
     * Define the configuration of the Selenium Server and return a boolean if the server is reacheable
     * @param serverURL
     * @param browser
     */
    public static async setServerConfig(serverURL : string) : Promise<boolean> {
        WD2Manager._serverURL = serverURL;
        const server = serverURL.match(/\/\/([a-z0-9A-Z.:-]*)/)?.[1];
        if (!server)
            return new Promise((resolve) => resolve(false));
        const host = server.split(":")[0];
        const port = server.split(":")[1] || "80";
        return portCheck(host, parseInt(port, 10));
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