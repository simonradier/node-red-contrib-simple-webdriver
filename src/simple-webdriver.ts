import nodeRed, { NodeAPI, NodeAPISettingsWithData} from "node-red";
import { NodeNavigateConstructor } from "./nodes/navigate";
import { NodeClickOnConstructor, NodeClickPrerequisite, NodeCloseWebConstructor, NodeFindElementConstructor, NodeGetAttributeConstructor, NodeGetTextConstructor, NodeGetTitleConstructor, NodeGetValueConstructor, NodeOpenBrowserConstructor, NodeRunScriptConstructor, NodeScreenshotConstructor, NodeSendKeysConstructor, NodeSetAttributeConstructor, NodeSetValueConstructor } from "./nodes/node";
import { REDAPI } from "./utils";

export = (RED : NodeAPI<NodeAPISettingsWithData>) => {
    REDAPI.set(RED);
    REDAPI.get().nodes.registerType("close browser", NodeCloseWebConstructor);
    REDAPI.get().nodes.registerType("open browser", NodeOpenBrowserConstructor);
    NodeClickPrerequisite();
    REDAPI.get().nodes.registerType("find element", NodeFindElementConstructor);
    REDAPI.get().nodes.registerType("click on", NodeClickOnConstructor);
    REDAPI.get().nodes.registerType("get title", NodeGetTitleConstructor);
    REDAPI.get().nodes.registerType("send keys", NodeSendKeysConstructor);
    REDAPI.get().nodes.registerType("get value", NodeGetValueConstructor);
    REDAPI.get().nodes.registerType("set value", NodeSetValueConstructor);
    REDAPI.get().nodes.registerType("get attribute", NodeGetAttributeConstructor);
    REDAPI.get().nodes.registerType("set attribute", NodeSetAttributeConstructor);
    REDAPI.get().nodes.registerType("get text", NodeGetTextConstructor);
    REDAPI.get().nodes.registerType("run script", NodeRunScriptConstructor);
    REDAPI.get().nodes.registerType("navigate", NodeNavigateConstructor);
    REDAPI.get().nodes.registerType("screenshot", NodeScreenshotConstructor);
}