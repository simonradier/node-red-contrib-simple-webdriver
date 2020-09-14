import { NodeInitializer, NodeAPI, NodeAPISettingsWithData, NodeConstructor, Node, NodeDef } from "node-red";
import { WebDriver } from "selenium-webdriver";


class SeleniumServer {
    private _driver : WebDriver;
    private _connected : boolean = false;
    private _connecting : boolean = false;
    private _RED : NodeAPI<NodeAPISettingsWithData>;

    public constructor (RED : NodeAPI<NodeAPISettingsWithData>) {
        //this._driver = new WebDriver();
        this._RED = RED;
    }

    public Setup (n : any) : void {
        let node : Node<any> = <Node<any>> n;
    }

    public OpenWeb (n : any) : void {

    }
}

export default () : NodeInitializer => (RED) => {
    let selServ : SeleniumServer = new SeleniumServer(RED);
	RED.nodes.registerType("selenium-server", selServ.Setup);
}
