import { NodeAPI, NodeAPISettingsWithData} from "node-red";
import { NodeCloseWebConstructor, NodeOpenWebConstructor, NodeSeleniumServerConstructor } from "./nodes/node";
import { WD2Manager } from "./wd2-manager";


export = (RED : NodeAPI<NodeAPISettingsWithData>) => {
    WD2Manager.init(RED);
    RED.nodes.registerType("selenium-server", NodeSeleniumServerConstructor);
    RED.nodes.registerType("open-web", NodeOpenWebConstructor);
    RED.nodes.registerType("close-web", NodeCloseWebConstructor);
}
