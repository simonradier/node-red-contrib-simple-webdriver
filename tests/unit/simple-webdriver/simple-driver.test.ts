import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import { Browser, Protocol, SimpleWebDriver } from "../../../src/webdriver/webdriver";
import { LoggerConfiguration, LogLevel } from "../../../src/webdriver/utils/logger";
import nock from "nock";

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
                let driver : SimpleWebDriver = new SimpleWebDriver("http://localhost", Browser[browser]);
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
        it('should throw an exception if the server is not a webdriver server 1/4', async function () { 
            nock("http://test-webdriver.nock").post("/session").reply(200, "Hello world", { "Content-Type" : "application/html"})
            let driver : SimpleWebDriver = new SimpleWebDriver("http://test-webdriver.nock");
            await expect(driver.start()).to.be.rejectedWith(/Incorrect HTTP header/);
        });

        it('should throw an exception if the server is not a webdriver server 2/4', async function () { 
            nock("http://test-webdriver.nock").post("/session").reply(200, { "value" : { } }, { "Content-Type" : "application/json"})
            let driver : SimpleWebDriver = new SimpleWebDriver("http://test-webdriver.nock");
            await expect(driver.start()).to.be.rejectedWith(/Missing.*sessionId/);
        });

        it('should throw an exception if the server is not a webdriver server 3/4', async function () { 
            nock("http://test-webdriver.nock").post("/session").reply(200, { "value" : { "sessionId" : "test" } }, { "Content-Type" : "application/json"})
            let driver : SimpleWebDriver = new SimpleWebDriver("http://test-webdriver.nock");
            await expect(driver.start()).to.be.rejectedWith(/Missing.*capabilities/);
        });

        it('should throw an exception if the server is not a webdriver server 4/4', async function () { 
            nock("http://test-webdriver.nock").post("/session").reply(200, { "value" : { "sessionId" : "test", "capabilities" : {} } }, { "Content-Type" : "application/json"})
            let driver : SimpleWebDriver = new SimpleWebDriver("http://test-webdriver.nock");
            await expect(driver.start()).to.be.rejectedWith(/Missing.*timeouts/);
        });

        it('should start a session if webdriver response is correct', async function () { 
            nock("http://test-webdriver.nock").post("/session").reply(200, { 
                "value" : { 
                    "sessionId" : "session-test-value", 
                    "capabilities" : { 
                        "timeouts" : { 
                            "implicit": 0,
                            "pageLoad": 300000,
                            "script": 30000 
                        }
                    } 
                }
            }, 
            { "Content-Type" : "application/json"})
            let driver : SimpleWebDriver = new SimpleWebDriver("http://test-webdriver.nock");
            await driver.start();
            expect(driver.session).to.be.equal("session-test-value");
            expect(driver.timeouts.implicit).to.be.equal(0);
            expect(driver.timeouts.pageLoad).to.be.equal(300000);
            expect(driver.timeouts.script).to.be.equal(30000);
        });
    
    });
});