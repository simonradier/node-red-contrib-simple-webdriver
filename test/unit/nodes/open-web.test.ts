import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import helper from 'node-red-node-test-helper';
import swd from '../../../src/simple-webdriver'
import { NODE_OPEN_WEB } from './data';
import { WebDriver } from "@critik/simple-webdriver"
chai.use(chaiAsPromised);

helper.init(require.resolve('node-red'));

describe('node : open-web', function (){ 
    for(let browser of ["Chrome"]) {
      describe ('browser : ' + browser, function() {
        before(function () {
        });

        beforeEach(function (done) {
          helper.startServer(done);
        });
    
        
        afterEach(function(done) {
          helper.unload();
          helper.stopServer(done); 
        });
        
        it('should allow to create a "open browser" node', function (done) { 
            let flow = [{ id: "n1", type: "open browser", name: "test name" }];
            helper.load(swd, flow, function () {
              var n1 = helper.getNode("n1");
              n1.should.have.property('name', 'test name');
              done();
            });
        });
    
        it('should create a new webdriver session and push it to the msg object ', function (done) {
            let flow = [
              NODE_OPEN_WEB[browser]("n1", ["n4"]),
              //@ts-ignore
              { id: "n2", type: "catch", "uncaught": false, "scope" : null, wires : [ ["n3", "n4"] ]},
              { id: "n3", type: "helper"},
              { id: "n4", type: "close browser" }
            ];
            helper.load(swd, flow, function () {
              let n3 = helper.getNode("n3");
              let n1 = helper.getNode("n1");
              n3.on("input", function (msg : any) {
                expect(msg.browser, 'check browser session').to.exist;
                expect(msg.payload, 'check payload').to.be.equal("test");
                done();
              });
              n1.receive({ payload: "test" });
            });
        });     
      })
    };
});
