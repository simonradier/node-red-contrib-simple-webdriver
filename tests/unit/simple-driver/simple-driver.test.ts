import { expect } from 'chai';
import { Browser, SimpleDriver } from "../../../src/webdriver/webdriver"

describe('SimpleDriver', () => { 
    describe('constructor', () => {
        it('should throw an error if the URL is not correct #1', () => { 
            let driver : SimpleDriver; 
            expect(() => { driver = new SimpleDriver("totoFail", Browser.Chrome)}).to.throw(/Invalid URL/);
        });
        it('should throw an error if the URL is not correct #2', () => { 
            let driver : SimpleDriver; 
            expect(() => { driver = new SimpleDriver("ftp:///÷dfsfdqsd", Browser.Chrome)}).to.throw(/Invalid Protocol/);
        });
        it('should throw an error if the browser is not supported', () => { 
            let driver : SimpleDriver; 
            expect(() => { driver = new SimpleDriver("http://localhost", Browser.InternetExplorer)}).to.throw(/Invalid Browser/);
        });
    });
});