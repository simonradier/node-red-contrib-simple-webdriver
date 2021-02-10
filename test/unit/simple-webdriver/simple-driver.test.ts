import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import { Browser, Protocol, SimpleWebDriver, Using } from "../../../src/webdriver/webdriver";
import { LoggerConfiguration, LogLevel } from "../../../src/webdriver/utils/logger";
import nock from "nock";
import { WD_START_SESSION_RESPONSE, WD_SERVER_URL_HTTP, WD_SERVER_URL_HTTPS, WD_SESSION_ID, WD_STOP_SESSION_RESPONSE, WD_EXECUTE_SYNC_RESPONSE, WD_FIND_ELEMENT_RESPONSE, WD_WINDOW_HANDLE_RESPONSE } from './data';

chai.use(chaiAsPromised);

describe('SimpleDriver', function (){ 
    before(function () {
        // Deactivate SimpleWebdriver Logs
        LoggerConfiguration.logLevel = LogLevel.None;
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
            let driver : SimpleWebDriver = new SimpleWebDriver("http://localhost");
            expect(driver).to.be.not.null;
        });
        it('should create a new simple webdriver with https protocol', function (){ 
            let driver : SimpleWebDriver = new SimpleWebDriver("https://localhost");
            expect(driver).to.be.not.null;
        });
        it('should create a new simple webdriver with specific port', function (){ 
            let driver : SimpleWebDriver = new SimpleWebDriver("http://localhost:9515");
            expect(driver).to.be.not.null;
        });
        for (let browser in Browser) {
            it('should create a new simple webdriver with ' + browser, function (){ 
                //@ts-ignore
                let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP, Browser[browser]);
                expect(driver).to.be.not.null;
            });
        }
    });
    describe('start', function (){
        beforeEach(function () {
            nock.cleanAll();
        });
        it('should throw an exception if the server is not listening', async function () { 
            let driver : SimpleWebDriver = new SimpleWebDriver("http://127.0.0.1:50000");
            await expect(driver.start()).to.be.rejectedWith(/ECONNREFUSED/);
        });
        it('should throw an exception if the server connection is timeouting', async function () { 
            let driver : SimpleWebDriver = new SimpleWebDriver("http://fake-server.local");
            await expect(driver.start()).to.be.rejectedWith(/ENOTFOUND|EAI_AGAIN/);
        });
        it('should throw an exception if the server is not a webdriver server 1/6', async function () { 
            let resp = WD_START_SESSION_RESPONSE.KO_HTML;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.rejectedWith(/Incorrect HTTP header/);
        });

        it('should throw an exception if the server is not a webdriver server 2/6', async function () { 
            let resp = WD_START_SESSION_RESPONSE.KO_EMPTY;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.rejectedWith(/empty or null/);
        });

        it('should throw an exception if the server is not a webdriver server 3/6', async function () { 
            let resp = WD_START_SESSION_RESPONSE.KO_VALUE_NULL;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers)
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.rejectedWith(/empty or null/);
        });

        it('should throw an exception if the server is not a webdriver server 4/6', async function () { 
            let resp = WD_START_SESSION_RESPONSE.KO_VALUE_EMPTY;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers)
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.rejectedWith(/Missing.*sessionId/);
        });

        it('should throw an exception if the server is not a webdriver server 5/6', async function () { 
            let resp = WD_START_SESSION_RESPONSE.KO_VALUE_NO_CAPA;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);            
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.rejectedWith(/Missing.*capabilities/);
        });

        it('should throw an exception if the server is not a webdriver server 6/6', async function () { 
            let resp = WD_START_SESSION_RESPONSE.KO_VALUE_NO_TIMEOUTS;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);   
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.rejectedWith(/Missing.*timeouts/);
        });

        it('should start a session if webdriver response is correct (http)', async function () { 
            let resp = WD_START_SESSION_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);  
            let resp2 = WD_WINDOW_HANDLE_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).get(`/session/${WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);  
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await driver.start();
            expect(driver.session).to.be.equal(WD_SESSION_ID);
            expect(driver.timeouts.implicit).to.be.equal(0);
            expect(driver.timeouts.pageLoad).to.be.equal(300000);
            expect(driver.timeouts.script).to.be.equal(30000);
            expect(nock.isDone(), 'all request were executed');
        });

        it('should throw an error if the response is not a JSON object', async function () { 
            let resp = WD_START_SESSION_RESPONSE.KO_NOJSON;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);  
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.rejectedWith(/Unexpected token/);
        });

        it('should throw an error if the server generate an error during response', async function () { 
            nock(WD_SERVER_URL_HTTP).post("/session").replyWithError({
                message: 'something awful happened',
                code: 'AWFUL_ERROR'});
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.rejectedWith(/something awful happened/);
        });
    
        it('should start a session if webdriver response is correct (https)', async function () { 
            let resp = WD_START_SESSION_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTPS).post("/session").reply(resp.code, resp.body, resp.headers);  
            let resp2 = WD_WINDOW_HANDLE_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTPS).get(`/session/${WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);  
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTPS);
            await driver.start();
            expect(driver.session).to.be.equal(WD_SESSION_ID);
            expect(driver.timeouts.implicit).to.be.equal(0);
            expect(driver.timeouts.pageLoad).to.be.equal(300000);
            expect(driver.timeouts.script).to.be.equal(30000);
        });

        it('should throw an error if webdriver can\'t create a session', async function () { 
            let resp = WD_START_SESSION_RESPONSE.KO_500;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);  
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.rejectedWith(/session : can't create/);
        });

        it('should throw an error if start is called a second time before a stop', async function () { 
            let resp = WD_START_SESSION_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);  
            let resp2 = WD_WINDOW_HANDLE_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).get(`/session/${WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);  
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.fulfilled;
            await expect(driver.start()).to.be.rejectedWith(/can't start Webdriver session which is already started/);
        });
    
    });

    describe('stop', function () {
        beforeEach(function () {
            nock.cleanAll();
            let resp = WD_START_SESSION_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);
            let resp2 = WD_WINDOW_HANDLE_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).get(`/session/${WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);  
        });

        it('should stop the webdriver if the session is created', async function () { 
            let resp = WD_STOP_SESSION_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).delete("/session/" + WD_SESSION_ID).reply(resp.code, resp.body, resp.headers);
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.fulfilled;
            await expect(driver.stop()).to.be.fulfilled;
            expect(driver.session).to.be.null;
        });

        it('should throw an error if webdriver session was not started', async function () { 
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.stop()).to.be.rejectedWith(/start must be called first/);
        });

        it('should throw an error if webdriver call return an error', async function () {
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.fulfilled;
            let resp = WD_STOP_SESSION_RESPONSE.KO_ERROR;
            nock(WD_SERVER_URL_HTTP).delete("/session/" + WD_SESSION_ID).reply(resp.code, resp.body, resp.headers);
            await expect(driver.stop()).to.be.rejectedWith(/this is an unknown error/);
        });
    });

    describe('findElement', function () {
        beforeEach(function () {
            nock.cleanAll();
            let resp = WD_START_SESSION_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);
            let resp2 = WD_WINDOW_HANDLE_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).get(`/session/${WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);  
        });

        for (let using in Using) {
            if (using === "className" || using === "id" || using === "name") {
                it('should return a WebElement using the execute_sync API with ' + using + ' search', async function () {
                    let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
                    await expect(driver.start()).to.be.fulfilled;
                    let resp = WD_EXECUTE_SYNC_RESPONSE.OK_ELEMENT;
                    nock(WD_SERVER_URL_HTTP).post(`/session/${WD_SESSION_ID}/execute/sync`).reply(resp.code, resp.body, resp.headers);
                    //@ts-ignore
                    await expect(driver.findElement(Using[using], "test")).to.be.fulfilled;
                });
            } else {
                it('should return a WebElement using the element API with ' + using + ' search', async function () {
                    let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
                    await expect(driver.start()).to.be.fulfilled;
                    let resp = WD_FIND_ELEMENT_RESPONSE.OK;
                    nock(WD_SERVER_URL_HTTP).post(`/session/${WD_SESSION_ID}/element`).reply(resp.code, resp.body, resp.headers);
                    //@ts-ignore
                    await expect(driver.findElement(Using[using], "test")).to.be.fulfilled;
                });
            }
        }

        it('should throw an error if the API return an error', async function () {
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.fulfilled;
            let resp = WD_FIND_ELEMENT_RESPONSE.KO_ERROR;
            nock(WD_SERVER_URL_HTTP).post(`/session/${WD_SESSION_ID}/element`).reply(resp.code, resp.body, resp.headers);
            //@ts-ignore
            await expect(driver.findElement(Using.css, "test")).to.be.rejectedWith(/element : this is an unknown error/);
        });


        it('should throw an LocationError if element can\'t be found', async function () {
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.fulfilled;
            let resp = WD_FIND_ELEMENT_RESPONSE.KO_NOT_FOUND;
            nock(WD_SERVER_URL_HTTP).post(`/session/${WD_SESSION_ID}/element`).reply(resp.code, resp.body, resp.headers);
            await expect(driver.findElement(Using.css, "test")).to.be.rejectedWith(/Cannot locate : test/);
        });

        it('should find an element before the timeout', async function () {
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.fulfilled;
            let resp = WD_FIND_ELEMENT_RESPONSE.KO_NOT_FOUND;
            nock(WD_SERVER_URL_HTTP).post(`/session/${WD_SESSION_ID}/element`).times(50).reply(resp.code, resp.body, resp.headers);
            let resp2 = WD_FIND_ELEMENT_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).post(`/session/${WD_SESSION_ID}/element`).reply(resp2.code, resp2.body, resp2.headers);
            await expect(driver.findElement(Using.css, "test", 500)).to.be.fulfilled;
        });

        it('should thrown an error if element is not found before the timeout', async function () {
            let driver : SimpleWebDriver = new SimpleWebDriver(WD_SERVER_URL_HTTP);
            await expect(driver.start()).to.be.fulfilled;
            let resp = WD_FIND_ELEMENT_RESPONSE.KO_NOT_FOUND;
            nock(WD_SERVER_URL_HTTP).post(`/session/${WD_SESSION_ID}/element`).times(100).reply(resp.code, resp.body, resp.headers);
            let resp2 = WD_FIND_ELEMENT_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).post(`/session/${WD_SESSION_ID}/element`).reply(resp2.code, resp2.body, resp2.headers);
            await expect(driver.findElement(Using.css, "test", 50)).to.be.rejectedWith(/Cannot locate : test/);
        });

    });

    describe.skip('element', function () {
        beforeEach(function () {
            nock.cleanAll();
            let resp = WD_START_SESSION_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);
        });
        describe('click', function () {
        });
    });

    describe('navigate', function () {
        beforeEach(function () {
            nock.cleanAll();
            let resp = WD_START_SESSION_RESPONSE.OK;
            nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);
        });
        describe('to', function () {
        });
    });
});