import { WD_SERVER_URL_HTTP } from "../simple-webdriver/data";

export let NODE_OPEN_WEB = {
  Chrome: (id: string, next: string[]) => {
    return {
      id: id,
      type: "open browser",
      name: "open chrome",
      browserType: "chrome",
      webURL: "https://www.google.com/",
      width: 1280,
      height: 1024,
      timeout: 3000,
      maximized: false,
      serverURL: WD_SERVER_URL_HTTP.Chrome,
      wires: [["n2"]],
    };
  },
  Gecko: (id: string, next: string[]) => {
    return {
      id: id,
      type: "open browser",
      name: "open chrome",
      browserType: "firefox",
      webURL: "https://www.google.com/",
      width: 1280,
      height: 1024,
      timeout: 3000,
      maximized: false,
      serverURL: WD_SERVER_URL_HTTP.Firefox,
      wires: [["n2"]],
    };
  },
};
