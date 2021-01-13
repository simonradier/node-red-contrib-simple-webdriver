export class Capabilities {
    public headless : boolean = false;
    public args : string[] = new Array<string>();
    public addArguments (arg : string) {
        this.args.push(arg);
    }
}