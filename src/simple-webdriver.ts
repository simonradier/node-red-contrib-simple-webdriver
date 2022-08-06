import { NodeAPI, NodeAPISettingsWithData} from "node-red";
import { NodeNavigateConstructor } from "./nodes/navigate";
import { NodeClickOnConstructor, NodeClickPrerequisite, NodeCloseWebConstructor, NodeFindElementConstructor, NodeGetAttributeConstructor, NodeGetTextConstructor, NodeGetTitleConstructor, NodeGetValueConstructor, NodeOpenBrowserConstructor, NodeRunScriptConstructor, NodeScreenshotConstructor, NodeSendKeysConstructor, NodeSetAttributeConstructor, NodeSetValueConstructor } from "./nodes/node";
import { WebDriverManager } from "./webdriver-manager";


export = (RED : NodeAPI<NodeAPISettingsWithData>) => {
    WebDriverManager.init(RED);
    

    RED.nodes.registerType("close browser", NodeCloseWebConstructor);
    RED.nodes.registerType("open browser", NodeOpenBrowserConstructor);
    NodeClickPrerequisite();
    RED.nodes.registerType("find element", NodeFindElementConstructor);
    RED.nodes.registerType("click on", NodeClickOnConstructor);
    RED.nodes.registerType("get title", NodeGetTitleConstructor);
    RED.nodes.registerType("send keys", NodeSendKeysConstructor);
    RED.nodes.registerType("get value", NodeGetValueConstructor);
    RED.nodes.registerType("set value", NodeSetValueConstructor);
    RED.nodes.registerType("get attribute", NodeGetAttributeConstructor);
    RED.nodes.registerType("set attribute", NodeSetAttributeConstructor);
    RED.nodes.registerType("get text", NodeGetTextConstructor);
    RED.nodes.registerType("run script", NodeRunScriptConstructor);
    RED.nodes.registerType("navigate", NodeNavigateConstructor);
    RED.nodes.registerType("screenshot", NodeScreenshotConstructor);
}
