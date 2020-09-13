import { NodeInitializer } from "node-red";


class SeleniumServer {
    public Setup () {

    }
}

export default () : NodeInitializer => (RED) => {
    let selServ : SeleniumServer = new SeleniumServer();
	RED.nodes.registerType("selenium-server", selServ.Setup);
}
