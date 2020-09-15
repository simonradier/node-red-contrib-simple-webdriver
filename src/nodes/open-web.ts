import { Node, NodeDef, NodeMessageInFlow } from "node-red"

export interface NodeOpenWebDef extends NodeDef {
    server : string;
    Name : string;
    Browser : string;
    webURL : string;
    width : number;
    heigth : number;
    webTitle : string;
    timeOut : number;
    maximizeWindow : boolean;
    headless : boolean; 
}

export interface NodeOpenWeb extends Node<any> {

}

export function NodeOpenWebConstructor (this : NodeOpenWeb, conf : NodeOpenWebDef) {
    this.on("input" , (msg) => {
    });
}