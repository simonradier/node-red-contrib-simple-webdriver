/* eslint-disable @typescript-eslint/naming-convention */
export enum WD_TESTED_Browser {
  Chrome = "chrome",
  //Chromium = "chromium",
  //Edge = "msedge",
  Firefox = "firefox",
  //Safari = "safari"
}

export enum WD_TESTED_Driver {
  Chrome = "chromedriver",
  Chromium = "chromedriver",
  Edge = "msedgedriver",
  Firefox = "geckodriver",
  Safari = "safaridriver",
}

export const WD_SERVER_URL_HTTP = {
  Chrome: "http://localhost:9515",
  Firefox: "http://localhost:4444",
  Chromium: "http://localhost:9515",
  Edge: "http://localhost:9415",
  Safari: "http://localhost:9315",
};

export const WD_SERVER_URL_HTTPS = {
  Chrome: "https://localhost:9515",
  Firefox: "https://localhost:4444",
  Chromium: "https://localhost:9515",
  Edge: "https://localhost:9415",
  Safari: "https://localhost:9315",
};

export const WD_WEBSITE_URL_HTTP =
  "https://simonradier.github.io/node-red-contrib-selenium-wd2/test/";

export const WD_WEBSITE_URL_HTTP_1 =
  "https://simonradier.github.io/node-red-contrib-selenium-wd2/test/test1.html";

export const WD_WEBSITE_URL_HTTP_2 =
  "https://simonradier.github.io/node-red-contrib-selenium-wd2/test/test2.html";

export const WD_SESSION_ID = "session-test-id-1337";

export const WD_ELEMENT_ID = "element-test-id-1337";

export const WD_ELEMENT_ID_FAKE = "element-FAKE-id-1337";

export const WD_ATTRIBUTE_NAME = "value";

export const WD_CSS_ATTRIBUTE_NAME = "text-align";

export const WD_PROPERTY_NAME = "value";

export const WD_ELEMENT_SEARCH = {
  id: "id_1234",
  name: "input_1234",
  className: "class_1234",
  link: "This is a link to test1.html",
  partialLink: "test2.html",
  css: "#id_1234",
  tag: "h1",
  xpath: "/html/body/span",
};
