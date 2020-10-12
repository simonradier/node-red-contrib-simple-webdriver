import { NodeAPI, NodeAPISettingsWithData} from "node-red";
import { NodeNavigateConstructor } from "./nodes/navigate";
import { NodeClickOnConstructor, NodeClickPrerequisite, NodeCloseWebConstructor, NodeFindElementConstructor, NodeGetAttributeConstructor, NodeGetTextConstructor, NodeGetTitleConstructor, NodeGetValueConstructor, NodeOpenWebConstructor, NodeRunScriptConstructor, NodeScreenshotConstructor, NodeSendKeysConstructor, NodeSetAttributeConstructor, NodeSetValueConstructor } from "./nodes/node";
import { WD2Manager } from "./wd2-manager";


export = (RED : NodeAPI<NodeAPISettingsWithData>) => {
    WD2Manager.init(RED);
    RED.nodes.registerType("open-web", NodeOpenWebConstructor);
    RED.nodes.registerType("close-web", NodeCloseWebConstructor);
    NodeClickPrerequisite();
    RED.nodes.registerType("find-element", NodeFindElementConstructor);
    RED.nodes.registerType("click-on", NodeClickOnConstructor);
    RED.nodes.registerType("get-title", NodeGetTitleConstructor);
    RED.nodes.registerType("send-keys", NodeSendKeysConstructor);
    RED.nodes.registerType("get-value", NodeGetValueConstructor);
    RED.nodes.registerType("set-value", NodeSetValueConstructor);
    RED.nodes.registerType("get-attribute", NodeGetAttributeConstructor);
    RED.nodes.registerType("set-attribute", NodeSetAttributeConstructor);
    RED.nodes.registerType("get-text", NodeGetTextConstructor);
    RED.nodes.registerType("run-script", NodeRunScriptConstructor);
    RED.nodes.registerType("navigate", NodeNavigateConstructor);
    RED.nodes.registerType("screenshot", NodeScreenshotConstructor);
}
