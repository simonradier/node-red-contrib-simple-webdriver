import { WD_SERVER_URL_HTTP } from "../simple-webdriver/data";


export let NODE_OPEN_WEB = {
    OK_CHROME : (id : string, next : string[]) => {
        return {
            "id": id,
            "type": "open-web",
            "name": "open chrome",
            "browser": "chrome",
            "webURL": "https://www.google.com/",
            "width": 1280,
            "height": 1024,
            "timeout": 3000,
            "maximized": false,
            "headless": false,
            "serverURL": WD_SERVER_URL_HTTP,
            "wires": [
                ['n2']
            ]
        }
    }
}