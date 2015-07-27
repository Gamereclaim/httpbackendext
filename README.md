# Http Backend Ext

[![Build Status](https://travis-ci.org/Gamereclaim/httpbackendext.svg?branch=master)](https://travis-ci.org/Gamereclaim/httpbackendext)

Http backend mock module for protractor

## Installation

```shell
npm install httpbackendext
```

include angular mock script
https://github.com/angular/bower-angular-mocks

## Usage

```
javascript
var HttpBackend = require('httpbackend');
var backend = null;

describe('Test Http backend methods', function() {

    beforeEach(function() {
        backend = new HttpBackend(browser);
    });

    afterEach(function() {
        backend.verifyNoOutstandingExpectation();
        backend.clear();
    });

    it('Test when (POST) with function as response', function() {
        backend.when('POST', /result/).respond(function(method, url, data) {
            return [200, 'abuga'];
        });

        browser.get('/');

        element(by.css('#buttonPOST')).click();

        var result = element(by.binding('result'));
        expect(result.getText()).toEqual('abuga');
    });

    it('Test expect function', function() {
        backend.expect('POST', /result/);
        browser.get('/');
        element(by.css('#buttonPOST')).click();
    });

    it('Test expectGET function', function() {
        backend.expectGET(/result/);
        browser.get('/');
        element(by.css('#buttonGET')).click();
    });

    it('Test expectPOST function', function() {
        backend.expectPOST(/result/);
        browser.get('/');
        element(by.css('#buttonPOST')).click();
    });

    it('Test expectPOST and expectGET functions', function() {
        backend.expectPOST(/result/);
        backend.expectGET(/result/);
        browser.get('/');
        element(by.css('#buttonPOST')).click();
        element(by.css('#buttonGET')).click();
    });

    it('Test combined when and expect functions', function() {
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

	it('Test whenGET with string response', function() {
		backend.whenGET(/result/).respond('raoul');

		browser.get('http://127.0.0.1:8080');

		var result = element(by.binding('result'));
		expect(result.getText()).toEqual('raoul');
  	});

  	it('Test whenPOST with function as response', function() {
        backend.whenPOST(/result/).respond(function(method, url, data) {
            return [200, data];
        });

        browser.get('http://127.0.0.1:8080');

        element(by.css('#buttonPOST')).click();

        var result = element(by.binding('result'));
        expect(result.getText()).toEqual('postedData');
    });
});

```


### Workflow

HttpBackend workflow is quite simple:

* On browser.get()` a mock module is injected to your angularjs application
* On `when*`or when you call manually `backend.sync()`, fixtures is synchronised with your angularjs app.

### Increase perfomance

For perfomance issue you can disable auto sync:

```javascript
    var backend = new HttpBackend(brower, {autoSync: false});

    //Then you should manually call sync function
    backend.whenGET(/results/).respond('raoul');
    backend.whenGET(/responses/).respond('raoul');
    backend.sync();

```

### Httpbackend Methods

* `when GET, POST, HEAD, PUT, JSONP` add a fixtures, accept literal object, or a callback
* `expect GET, POST, HEAD, PUT, JSONP` add expectation. verify expectations with backend.verifyNoOutstandingExpectation()
* `sync`, manualy sync fixtures
* `clear`, clear http backend module
* `reset`, reset all fixture

## Development and test

Init project
```shell
bower install
npm install
````

Launch test
```shell
npm test
````

## Licence

MIT
