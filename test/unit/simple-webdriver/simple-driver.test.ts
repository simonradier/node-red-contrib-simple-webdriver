import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import { Browser, Protocol, SimpleWebDriver, Using } from "../../../src/webdriver/webdriver";
import { LoggerConfiguration, LogLevel } from "../../../src/webdriver/utils/logger";
import nock from "nock";
import { WD_START_SESSION_RESPONSE, WD_SERVER_URL_HTTP, WD_SERVER_URL_HTTPS, WD_SESSION_ID, WD_STOP_SESSION_RESPONSE, WD_EXECUTE_SYNC_RESPONSE, WD_FIND_ELEMENT_RESPONSE, WD_WINDOW_HANDLE_RESPONSE, WD_NAVIGATE_TO_RESPONSE, WD_WEBSITE_URL_HTTP, WD_WEBSITE_URL_HTTP_1, WD_WEBSITE_URL_HTTP_2, WD_NAVIGATE_REFRESH_RESPONSE, WD_TESTED_Browser, WD_TESTED_Driver, WD_NAVIGATE_BACK_RESPONSE, WD_NAVIGATE_FORWARD_RESPONSE, WD_NAVIGATE_CURRENTURL, WD_ELEMENT_SEARCH } from './data';

chai.use(chaiAsPromised);

describe('SimpleDriver', function (){ 
    before(function () {
        // Deactivate SimpleWebdriver Logs
        LoggerConfiguration.logLevel = LogLevel.Debug;
    });

    for(let browser in WD_TESTED_Browser) {
        describe ('browser : ' + browser, function() {
            afterEach(async function () {
                if (!nock.isActive()) {
                    if (browser === "Safari") // wait 1 sec for Safari to avoid "Could not create a session error"
                        await (new Promise(resolve => setTimeout(resolve, 1000)))
                    await SimpleWebDriver.cleanSessions();
                }
            });
            describe('constructor', function (){
                it('should throw an error if the URL is not correct #1', function (){ 
                    let driver : SimpleWebDriver;
                    expect(function (){ driver = new SimpleWebDriver("totoFail")}).to.throw(/Invalid URL/);
                });
                it('should throw an error if the URL is not correct #2', function (){ 
                    let driver : SimpleWebDriver;
                    expect(function (){ driver = new SimpleWebDriver("ftp:///÷dfsfdqsd")}).to.throw(/Invalid Protocol/);
                });
                it('should create a new simple webdriver with http protocol', function (){ 
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver("http://localhost", Browser[browser]);
                    expect(driver).to.be.not.null;
                });
                it('should create a new simple webdriver with https protocol', function (){ 
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver("https://localhost", Browser[browser]);
                    expect(driver).to.be.not.null;
                });
                it('should create a new simple webdriver with specific port', function (){ 
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver("http://localhost:9515", Browser[browser]);
                    expect(driver).to.be.not.null;
                });
                it('should create a new simple webdriver with ' + browser, function (){ 
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser], Browser[browser]);
                    expect(driver).to.be.not.null;
                });
            });

            describe('start', function (){
                beforeEach(function () {
                    nock.cleanAll();
                });
                it('should throw an exception if the server is not listening', async function () { 
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver("http://127.0.0.1:50000", Browser[browser]);
                    await expect(driver.start()).to.be.rejectedWith(/ECONNREFUSED/);
                });
                it('should throw an exception if the server connection is timeouting', async function () { 
                    this.timeout(10000);
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver("http://fake-server.local", Browser[browser]);
                    await expect(driver.start()).to.be.rejectedWith(/ENOTFOUND|EAI_AGAIN/);
                });
                it('should throw an exception if the server is not a webdriver server 1/6 | Nock Only', async function () { 
                    let resp = WD_START_SESSION_RESPONSE.KO_HTML;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser], Browser[browser]);
                    await expect(driver.start()).to.be.rejectedWith(/Incorrect HTTP header/);
                });

                it('should throw an exception if the server is not a webdriver server 2/6 | Nock Only', async function () { 
                    let resp = WD_START_SESSION_RESPONSE.KO_EMPTY;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser], Browser[browser]);
                    await expect(driver.start()).to.be.rejectedWith(/empty or null/);
                });

                it('should throw an exception if the server is not a webdriver server 3/6 | Nock Only', async function () { 
                    let resp = WD_START_SESSION_RESPONSE.KO_VALUE_NULL;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers)
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser], Browser[browser]);
                    await expect(driver.start()).to.be.rejectedWith(/empty or null/);
                });

                it('should throw an exception if the server is not a webdriver server 4/6 | Nock Only', async function () { 
                    let resp = WD_START_SESSION_RESPONSE.KO_VALUE_EMPTY;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers)
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser], Browser[browser]);
                    await expect(driver.start()).to.be.rejectedWith(/Missing.*sessionId/);
                });

                it('should throw an exception if the server is not a webdriver server 5/6 | Nock Only', async function () { 
                    let resp = WD_START_SESSION_RESPONSE.KO_VALUE_NO_CAPA;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser], Browser[browser]);
                    await expect(driver.start()).to.be.rejectedWith(/Missing.*capabilities/);
                });

                /*it('should throw an exception if the server is not a webdriver server 6/6 | Nock Only', async function () { 
                    let resp = WD_START_SESSION_RESPONSE.KO_VALUE_NO_TIMEOUTS;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    //@ts-ignore
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser], Browser[browser]);
                    await expect(driver.start()).to.be.rejectedWith(/Missing.*timeouts/);
                });*/

                it('should start a session if webdriver response is correct (http)', async function () { 
                    let resp = WD_START_SESSION_RESPONSE.OK;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    let resp2 = WD_WINDOW_HANDLE_RESPONSE.OK;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).get(`/session/${WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser], Browser[browser]);
                    await expect(driver.start()).to.be.fulfilled;
                    if (nock.isActive()) {
                        expect(driver.session).to.be.equal(WD_SESSION_ID);
                        expect(driver.timeouts.implicit).to.not.be.null;
                        expect(driver.timeouts.pageLoad).to.not.be.null;
                        expect(driver.timeouts.script).to.not.be.null;
                        expect(nock.isDone(), 'all request were executed');
                    }
                });

                it('should throw an error if the response is not a JSON object | Nock Only', async function () { 
                    let resp = WD_START_SESSION_RESPONSE.KO_NOJSON;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser], Browser[browser]);
                    await expect(driver.start()).to.be.rejectedWith(/Unexpected token/);
                });

                it('should throw an error if the server generate an error during response | Nock Only', async function () { 
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").replyWithError({
                        message: 'something awful happened',
                        code: 'AWFUL_ERROR'});
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser], Browser[browser]);
                    await expect(driver.start()).to.be.rejectedWith(/something awful happened/);
                });

                it('should start a session if webdriver response is correct (https) | Nock Only', async function () { 
                    let resp = WD_START_SESSION_RESPONSE.OK;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTPS[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    let resp2 = WD_WINDOW_HANDLE_RESPONSE.OK;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTPS[browser]).get(`/session/${WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTPS[browser], Browser[browser]);
                    await expect(driver.start()).to.be.fulfilled;
                    if (nock.isActive()) {
                        expect(driver.session).to.be.equal(WD_SESSION_ID);
                        expect(driver.timeouts.implicit).to.not.be.null;
                        expect(driver.timeouts.pageLoad).to.not.be.null;
                        expect(driver.timeouts.script).to.not.be.null;
                        expect(nock.isDone(), 'all request were executed');
                    }
                });

                it('should throw an error if webdriver can\'t create a session | Nock Only', async function () { 
                    let resp = WD_START_SESSION_RESPONSE.KO_500;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser], Browser[browser]);
                    await expect(driver.start()).to.be.rejectedWith(/session : can't create/);
                });

                it('should throw an error if start is called a second time before a stop', async function () { 
                    let resp = WD_START_SESSION_RESPONSE.OK;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    let resp2 = WD_WINDOW_HANDLE_RESPONSE.OK;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).get(`/session/${WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                    await expect(driver.start()).to.be.fulfilled;
                    await expect(driver.start()).to.be.rejectedWith(/Can't start Webdriver session which is already started/);
                });

            });

            describe('stop', function () {
                beforeEach(function () {
                    nock.cleanAll();
                    let resp = WD_START_SESSION_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    let resp2 = WD_WINDOW_HANDLE_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP[browser]).get(`/session/${WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);
                });

                it('should stop the webdriver if the session is created', async function () { 
                    let resp = WD_STOP_SESSION_RESPONSE.OK;
                    //@ts-ignore
                    nock(WD_SERVER_URL_HTTP[browser]).delete("/session/" + WD_SESSION_ID).reply(resp.code, resp.body, resp.headers);
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                    await expect(driver.start()).to.be.fulfilled;
                    await expect(driver.stop()).to.be.fulfilled;
                    expect(driver.session).to.be.null;
                });

                it('should throw an error if webdriver session was not started', async function () { 
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                    await expect(driver.stop()).to.be.rejectedWith(/start must be called first/);
                });

                it('should throw an error if webdriver call return an error | Nock Only', async function () {
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                    await expect(driver.start()).to.be.fulfilled;
                    let resp = WD_STOP_SESSION_RESPONSE.KO_ERROR;
                    nock(WD_SERVER_URL_HTTP[browser]).delete("/session/" + WD_SESSION_ID).reply(resp.code, resp.body, resp.headers);
                    await expect(driver.stop()).to.be.rejectedWith(/this is an unknown error/);
                });
            });

            describe('navigate', function () {          
                beforeEach(function () {
                    nock.cleanAll();
                    // Required for session Start
                    let resp = WD_START_SESSION_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    // Required for session Start
                    let resp2 = WD_WINDOW_HANDLE_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP[browser]).get(`/session/${WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);
                })

                describe('to', function () {
                    it('should navigate to the website page with no error if result is OK', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        let resp3 = WD_NAVIGATE_TO_RESPONSE.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/url`).reply(resp3.code, resp3.body, resp3.headers);
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                    });

                    it('should navigate to the website page with no error several times', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        let resp = WD_NAVIGATE_TO_RESPONSE.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/url`).thrice().reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP), 'first try').to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP_1), 'second try').to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP_2), 'third try').to.be.fulfilled;
                    });

                    it('should thrown an error if the webdriver server return an error | Nock Only', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        let resp = WD_NAVIGATE_TO_RESPONSE.KO;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/url`).reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.rejectedWith(/navigate/);
                    });
                });

                describe('getCurrentURL', function () {
                    beforeEach(function () {
                        // Required for .navigate
                        let resp3 = WD_NAVIGATE_TO_RESPONSE.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/url`).reply(resp3.code, resp3.body, resp3.headers);
                    });

                    it('should retreive the website URL with no error if result is OK', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                        let resp = WD_NAVIGATE_CURRENTURL.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).get(`/session/${WD_SESSION_ID}/url`).reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().getCurrentURL()).to.become(WD_WEBSITE_URL_HTTP);
                    });

                    it('should navigate to the website page with no error several times', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                        let resp = WD_NAVIGATE_CURRENTURL.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).get(`/session/${WD_SESSION_ID}/url`).thrice().reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().getCurrentURL(), 'first try').to.become(WD_WEBSITE_URL_HTTP);
                        await expect(driver.navigate().getCurrentURL(), 'second try').to.become(WD_WEBSITE_URL_HTTP);
                        await expect(driver.navigate().getCurrentURL(), 'third try').to.become(WD_WEBSITE_URL_HTTP);
                    });

                    it('should thrown an error if the webdriver server return an error | Nock Only', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                        let resp = WD_NAVIGATE_CURRENTURL.KO;
                        nock(WD_SERVER_URL_HTTP[browser]).get(`/session/${WD_SESSION_ID}/url`).twice().reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().getCurrentURL()).to.be.rejectedWith(/geturl/);
                    });
                });

                describe('refresh', function () {
                    beforeEach(function () {
                        // Required for .navigate
                        let resp3 = WD_NAVIGATE_TO_RESPONSE.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/url`).reply(resp3.code, resp3.body, resp3.headers);
                    });
                    it('should refresh to the website page with no error if result is OK', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                        let resp3 = WD_NAVIGATE_REFRESH_RESPONSE.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/refresh`).reply(resp3.code, resp3.body, resp3.headers);
                        await expect(driver.navigate().refresh()).to.be.fulfilled;
                    });

                    it('should refresh to the website page with no error several times', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                        let resp = WD_NAVIGATE_REFRESH_RESPONSE.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/refresh`).thrice().reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().refresh()).to.be.fulfilled;
                        await expect(driver.navigate().refresh()).to.be.fulfilled;
                        await expect(driver.navigate().refresh()).to.be.fulfilled;
                    });

                    it('should thrown an error if the webdriver server return an error | Nock Only', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                        let resp = WD_NAVIGATE_REFRESH_RESPONSE.KO;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/refresh`).reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().refresh()).to.be.rejectedWith(/refresh/);
                    });
                });

                describe('back', function () {
                    beforeEach(function () {
                        // Required for .navigate
                        let resp3 = WD_NAVIGATE_TO_RESPONSE.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/url`).reply(resp3.code, resp3.body, resp3.headers);
                    });
                    it('should refresh go to the previews web page with no error if result is OK', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                        let resp = WD_NAVIGATE_BACK_RESPONSE.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/back`).reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().back()).to.be.fulfilled;
                    });

                    it('should refresh to go back several times', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                        let resp = WD_NAVIGATE_BACK_RESPONSE.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/back`).thrice().reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().back()).to.be.fulfilled;
                        await expect(driver.navigate().back()).to.be.fulfilled;
                        await expect(driver.navigate().back()).to.be.fulfilled;
                    });

                    it('should thrown an error if the webdriver server return an error | Nock Only', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                        let resp = WD_NAVIGATE_BACK_RESPONSE.KO;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/back`).reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().back()).to.be.rejectedWith(/back/);
                    });
                });

                describe('forward', function () {
                    beforeEach(function () {
                        // Required for .navigate
                        let resp3 = WD_NAVIGATE_TO_RESPONSE.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/url`).reply(resp3.code, resp3.body, resp3.headers);
                    });
                    it('should refresh go to the previews web page with no error if result is OK', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                        let resp = WD_NAVIGATE_FORWARD_RESPONSE.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/forward`).reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().forward()).to.be.fulfilled;
                    });

                    it('should refresh to go back several times', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                        let resp = WD_NAVIGATE_FORWARD_RESPONSE.OK;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/forward`).thrice().reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().forward()).to.be.fulfilled;
                        await expect(driver.navigate().forward()).to.be.fulfilled;
                        await expect(driver.navigate().forward()).to.be.fulfilled;
                    });

                    it('should thrown an error if the webdriver server return an error | Nock Only', async function() {
                        let driver : SimpleWebDriver;
                        driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                        await expect(driver.start()).to.be.fulfilled;
                        await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                        let resp = WD_NAVIGATE_FORWARD_RESPONSE.KO;
                        nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/forward`).reply(resp.code, resp.body, resp.headers);
                        await expect(driver.navigate().forward()).to.be.rejectedWith(/forward/);
                    });
                });
            });

            describe('findElement', function () {
                beforeEach(function () {
                    nock.cleanAll();
                    // Required for session Start
                    let resp = WD_START_SESSION_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    // Required for session Start
                    let resp2 = WD_WINDOW_HANDLE_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP[browser]).get(`/session/${WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);
                    // Required for .navigate
                    let resp3 = WD_NAVIGATE_TO_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/url`).reply(resp3.code, resp3.body, resp3.headers);
                });

                for (let using in Using) {
                    if (using === "className" || using === "id" || using === "name") {
                        it('should return a WebElement using the execute_sync API with ' + using + ' search', async function () {
                            let driver : SimpleWebDriver;
                            driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                            await expect(driver.start()).to.be.fulfilled;
                            await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                            let resp = WD_EXECUTE_SYNC_RESPONSE.OK_ELEMENT;
                            nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/execute/sync`).reply(resp.code, resp.body, resp.headers);
                            //@ts-ignore
                            await expect(driver.findElement(Using[using], WD_ELEMENT_SEARCH[using])).to.be.fulfilled;
                        });
                    } else {
                        it('should return a WebElement using the element API with ' + using + ' search', async function () {
                            let driver : SimpleWebDriver;
                            driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                            await expect(driver.start()).to.be.fulfilled;
                            await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                            let resp = WD_FIND_ELEMENT_RESPONSE.OK;
                            nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/element`).reply(resp.code, resp.body, resp.headers);
                            //@ts-ignore
                            await expect(driver.findElement(Using[using], WD_ELEMENT_SEARCH[using])).to.be.fulfilled;
                        });
                    }
                }

                it('should throw an error if the API return an error | Nock Only', async function () {
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                    await expect(driver.start()).to.be.fulfilled;
                    await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                    let resp = WD_FIND_ELEMENT_RESPONSE.KO_ERROR;
                    nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/element`).reply(resp.code, resp.body, resp.headers);
                    //@ts-ignore
                    await expect(driver.findElement(Using.css, "test")).to.be.rejectedWith(/element : this is an unknown error/);
                });


                it('should throw a LocationError if element can\'t be found', async function () {
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                    await expect(driver.start()).to.be.fulfilled;
                    await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                    let resp = WD_FIND_ELEMENT_RESPONSE.KO_NOT_FOUND;
                    nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/element`).reply(resp.code, resp.body, resp.headers);
                    await expect(driver.findElement(Using.css, "test")).to.be.rejectedWith(/Cannot locate : test/);
                });

                it('should find an element before the timeout  | Nock Only', async function () {
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                    await expect(driver.start()).to.be.fulfilled;
                    await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                    let resp = WD_FIND_ELEMENT_RESPONSE.KO_NOT_FOUND;
                    nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/element`).times(50).reply(resp.code, resp.body, resp.headers);
                    let resp2 = WD_FIND_ELEMENT_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/element`).reply(resp2.code, resp2.body, resp2.headers);
                    await expect(driver.findElement(Using.css, ".class_1234", 500)).to.be.fulfilled;
                });

                it('should thrown an error if element is not found before the timeout', async function () {
                    let driver : SimpleWebDriver;
                    driver = new SimpleWebDriver(WD_SERVER_URL_HTTP[browser],Browser[browser]);
                    await expect(driver.start()).to.be.fulfilled;
                    await expect(driver.navigate().to(WD_WEBSITE_URL_HTTP)).to.be.fulfilled;
                    let resp = WD_FIND_ELEMENT_RESPONSE.KO_NOT_FOUND;
                    nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/element`).times(100).reply(resp.code, resp.body, resp.headers);
                    let resp2 = WD_FIND_ELEMENT_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/element`).reply(resp2.code, resp2.body, resp2.headers);
                    await expect(driver.findElement(Using.css, ".class_dont_exist", 50)).to.be.rejectedWith(/Cannot locate :/);
                });

            });

            describe.skip('element', function () {
                beforeEach(function () {
                    nock.cleanAll();
                    // Required for session Start
                    let resp = WD_START_SESSION_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);
                    // Required for session Start
                    let resp2 = WD_WINDOW_HANDLE_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP[browser]).get(`/session/${WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);
                    // Required for .get
                    let resp3 = WD_NAVIGATE_TO_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP[browser]).post(`/session/${WD_SESSION_ID}/url`).reply(resp3.code, resp3.body, resp3.headers);
                });
                describe('click', function () {
                });
            });
        });
    }

});