import { NodeAPI, NodeAPISettingsWithData} from "node-red";
import { WebDriver } from "selenium-webdriver";
import { NodeOpenWebConstructor, NodeSeleniumServerConstructor } from "./nodes/node";
import { SeleniumManager } from "./selenium-manager";


export = (RED : NodeAPI<NodeAPISettingsWithData>) => {
    debugger;
    SeleniumManager.init(RED);
    RED.nodes.registerType("selenium-server", NodeSeleniumServerConstructor);
    RED.nodes.registerType("open-web", NodeOpenWebConstructor);
}
