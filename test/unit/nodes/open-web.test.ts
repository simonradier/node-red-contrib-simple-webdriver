import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import helper from 'node-red-node-test-helper';
import wd2 from '../../../src/selenium-wd2'
import { NODE_OPEN_WEB } from './data';
import * as td from '../simple-webdriver/data';
import nock from 'nock';
import { LoggerConfiguration, LogLevel } from '../../../src/webdriver/utils/logger';
import { SimpleWebDriver } from '../../../src/webdriver/webdriver';
chai.use(chaiAsPromised);

helper.init(require.resolve('node-red'));

describe('node : open-web', function (){ 
    for(let browser in td.WD_TESTED_Browser) {
      if (nock.isActive && browser != "Chrome")
        continue;
      describe ('browser : ' + browser, function() {
        before(function () {
          // Deactivate SimpleWebdriver Logs
          LoggerConfiguration.logLevel = LogLevel.None;
        });
        beforeEach(function (done) {
          this.timeout(4000);
          helper.startServer(done);
        });
    
        
        afterEach(function(done) {
            helper.unload();
            if (!nock.isActive())
                SimpleWebDriver.cleanSessions().then(() => {
                  helper.stopServer(done); 
                });
            else
              helper.stopServer(done); 
        });
        
        it('should throw an error if the URL is not correct #1', function (done) { 
            let flow = [{ id: "n1", type: "open-web", name: "test name" }];
            helper.load(wd2, flow, function () {
              var n1 = helper.getNode("n1");
              n1.should.have.property('name', 'test name');
              done();
            });
        });
    
        it('should create a new webdriver session and push it to the msg object ', function (done) {
          let resp = td.WD_START_SESSION_RESPONSE.OK;
          nock(td.WD_SERVER_URL_HTTP[browser]).post("/session").reply(resp.code, resp.body, resp.headers);  
          let resp2 = td.WD_WINDOW_HANDLE_RESPONSE.OK;
          nock(td.WD_SERVER_URL_HTTP[browser]).get(`/session/${td.WD_SESSION_ID}/window`).reply(resp2.code, resp2.body, resp2.headers);  
          let resp3 = td.WD_NAVIGATE_TO_RESPONSE.OK;
          nock(td.WD_SERVER_URL_HTTP[browser]).post(`/session/${td.WD_SESSION_ID}/url`).reply(resp3.code, resp3.body, resp3.headers); 
          nock(td.WD_SERVER_URL_HTTP[browser]).post(`/session/${td.WD_SESSION_ID}/window/rect`).reply(resp3.code, resp3.body, resp3.headers);   
            let flow = [
              NODE_OPEN_WEB[browser]("n1", ["n3"]),
              //@ts-ignore
              { id: "n2", type: "catch", "uncaught": false, "scope" : null, wires : [ ["n3"] ]},
              { id: "n3", type: "helper" }
            ];
            helper.load(wd2, flow, function () {
              let n3 = helper.getNode("n3");
              let n1 = helper.getNode("n1");
              n3.on("input", function (msg : any) {
                expect(msg.error, 'check error').to.be.undefined;
                expect(msg.driver, 'check driver').to.exist;
                if (nock.isActive()){
                  expect(msg.driver.session, 'check session').to.be.equal(td.WD_SESSION_ID);
                }
                expect(msg.payload, 'check payload').to.be.equal("test");
                done();
              });
              n1.receive({ payload: "test" });
            });
        });     
      })
    };
});
