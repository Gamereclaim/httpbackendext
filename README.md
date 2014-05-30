# Http Backend

[![Build Status](https://travis-ci.org/nchaulet/httpbackend.svg?branch=master)](https://travis-ci.org/nchaulet/httpbackend)

Http backend mock module for protractor

## instalation

```shell
npm install httpbackend
```

include angular mock script
https://github.com/angular/bower-angular-mocks

## Simple Usage

```javascript
var HttpBackend = require('httpbackend');
var backend = new HttpBackend(browser);

describe('Test Http backend methods', function() {
	afterEach(function() {
		backend.reset();
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

## Advanced Usage

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

``

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