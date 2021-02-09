import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import helper from 'node-red-node-test-helper';
import wd2 from '../../../src/selenium-wd2'
import { NODE_OPEN_WEB } from './data';
import { WD_NAVIGATE_TO_RESPONSE, WD_SERVER_URL_HTTP, WD_SESSION_ID, WD_START_SESSION_RESPONSE } from '../simple-webdriver/data';
import nock from 'nock';
import { LoggerConfiguration, LogLevel } from '../../../src/webdriver/utils/logger';
chai.use(chaiAsPromised);

helper.init(require.resolve('node-red'));

describe('node : open-web', function (){ 
    before(function () {
      // Deactivate SimpleWebdriver Logs
      LoggerConfiguration.logLevel = LogLevel.None;
    });
    beforeEach(function (done) {
        helper.startServer(done);
    });

    
    afterEach(function(done) {
        helper.unload();
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
      this.timeout(30000);
      let resp = WD_START_SESSION_RESPONSE.OK;
      nock(WD_SERVER_URL_HTTP).post("/session").reply(resp.code, resp.body, resp.headers);  
      let resp2 = WD_NAVIGATE_TO_RESPONSE.OK;
      nock(WD_SERVER_URL_HTTP).post(`/session/${WD_SESSION_ID}/url`).reply(resp.code, resp.body, resp.headers); 
      nock(WD_SERVER_URL_HTTP).post(`/session/${WD_SESSION_ID}/window/rect`).reply(resp.code, resp.body, resp.headers);   
        let flow = [
          NODE_OPEN_WEB.OK_CHROME("n1", ["n3"]),
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
            expect(msg.driver.session, 'check session').to.be.equal(WD_SESSION_ID);
            expect(msg.payload, 'check pauload').to.be.equal("test");
            done();
          });
          n1.receive({ payload: "test" });
        });
    });

});
