var HttpBackend = require('../../lib/httpbackend');

var browserGet = browser.get;
var backend = null;

describe('Test Http backend methods', function() {
    beforeEach(function() {
        backend = new HttpBackend(browser);
    });

    afterEach(function() {
        backend.verifyNoOutstandingExpectation();
        backend.clear();
    });

    it('Test whenGET with string url', function() {
        backend.whenGET("/result.json").respond('raoul');

        browser.get('/');

        element(by.css('#buttonGET')).click();

        var result = element(by.binding('result'));
        expect(result.getText()).toEqual('raoul');
    });

    it('Test whenGET with passThrough', function() {
        backend.whenGET("/result.json").passThrough();
        browser.get('/');


        element(by.css('#buttonGET')).click();

        var result = element(by.binding('result'));
        expect(result.getText()).toEqual('resultFromServer');
    });

    it('Test whenGET with string response', function() {
        backend.whenGET(/result/).respond('raoul');

        browser.get('/');


        element(by.css('#buttonGET')).click();

        var result = element(by.binding('result'));
        expect(result.getText()).toEqual('raoul');
    });

    it('Test whenPOST with string response', function() {
        backend.whenPOST(/result/).respond('raoul');

        browser.get('/');

        element(by.css('#buttonPOST')).click();

        var result = element(by.binding('result'));
        expect(result.getText()).toEqual('raoul');
    });

    it('Test whenPOST with function as response', function() {
        backend.whenPOST(/result/).respond(function(method, url, data) {
            return [200, data];
        });

        browser.get('/');

        element(by.css('#buttonPOST')).click();

        var result = element(by.binding('result'));
        expect(result.getText()).toEqual('postedData');
    });

    it('Test when (POST) with function as response', function() { //BB 01
        backend.when('POST', /result/).respond(function(method, url, data) {
            return [200, 'abuga'];
        });

        browser.get('/');

        element(by.css('#buttonPOST')).click();

        var result = element(by.binding('result'));
        expect(result.getText()).toEqual('abuga');
    });

    it('Test expect function', function() { //BB 01
        backend.expect('POST', /result/);
        browser.get('/');
        element(by.css('#buttonPOST')).click();
    });

    it('Test expect function a second time (properly flushed??)', function() { //BB 01
        backend.expect('POST', /result/);
        browser.get('/');
        element(by.css('#buttonPOST')).click();

    });

    it('Test expectGET function', function() { //BB 01
        backend.expectGET(/result/);
        browser.get('/');
        element(by.css('#buttonGET')).click();
    });

    it('Test expectPOST function', function() { //BB 01
        backend.expectPOST(/result/);
        browser.get('/');
        element(by.css('#buttonPOST')).click();
    });

    it('Test expectPOST and expectGET functions', function() { //BB 01
        backend.expectPOST(/result/);
        backend.expectGET(/result/);
        browser.get('/');
        element(by.css('#buttonPOST')).click();
        element(by.css('#buttonGET')).click();
    });

    it('Test combined when and expect functions', function() { //BB 01
        backend.expectPOST(/result/);
        backend.expectGET(/result/);
        backend.whenPOST(/result/).respond('raoulPOST');
        backend.whenGET(/result/).respond('raoulGET');
        browser.get('/');

        element(by.css('#buttonPOST')).click();
        var result = element(by.binding('result'));
        expect(result.getText()).toEqual('raoulPOST');

        element(by.css('#buttonGET')).click();
        result = element(by.binding('result'));
        expect(result.getText()).toEqual('raoulGET');

    });

    it('Test whenPOST with string response', function() {
        backend.whenPOST(/result/).respond('raoulPOST');
        backend.whenGET(/result/).respond('raoulGET');

        browser.get('/');

        element(by.css('#buttonGET')).click();

        var result = element(by.binding('result'));
        expect(result.getText()).toEqual('raoulGET');

        element(by.css('#buttonPOST')).click();
        expect(result.getText()).toEqual('raoulPOST');
    });
});
