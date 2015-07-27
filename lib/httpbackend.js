var HttpRequest = require('./httprequest.js'),
    HttpResponse = require('./httpresponse.js'),
    JavascriptBuilder = require('./javascriptbuilder.js'),
    _ = require('lodash');

/**
 * HttpBackend
 */
var HttpBackend = function (browser, options) {
    this.browser = browser;
    this.browserGet = this.browser.get;
    this.options = options;
    this.flow = this.browser.driver.controlFlow;
    if (!this.options || this.options == 'undefined') {
        this.options = {};
    }

    if (!_.isBoolean(this.options.autoSync)) {
        this.options.autoSync = true;
    }

    this.reset();
};

HttpBackend.prototype.reset = function () {
    this.isInitialized = false;
    this.clear();
    this._init();
};

HttpBackend.prototype.clear = function () {
    this.responses = [];
    this.expectations = [];
    this.unSyncResponses = [];
    this.browser.get = this.browserGet;
    if (this.isInitialized) {
        this.browser.removeMockModule('httpBackendMock');
    }
};


HttpBackend.prototype.when = function (method, url) {
    return this._when(method, url);
};

HttpBackend.prototype.expect = function (method, url) {
    return this._expect(method, url);
};

var generateWhenHelpers = function (methods) {
    methods.forEach(function (method) {
        HttpBackend.prototype['when' + method] = function (url) {
            return this._when(method, url);
        };
    })
};

var generateExpectHelpers = function (methods) {
    methods.forEach(function (method) {
        HttpBackend.prototype['expect' + method] = function (url) {
            return this._expect(method, url);
        };
    })
};

generateWhenHelpers([
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'HEAD',
    'PATCH',
    'JSONP'
]);

generateExpectHelpers([
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'HEAD',
    'PATCH',
    'JSONP'
]);//TODO Segudo?

HttpBackend.prototype.init = function () {

    this.isInitialized = true;
    var jsBuilder = new JavascriptBuilder();
    jsBuilder.responses = this.responses;
    jsBuilder.expectations = this.expectations;
    this.unSyncResponses = [];

    return this.browser.addMockModule('httpBackendMock', jsBuilder.toString(true));
};

HttpBackend.prototype.sync = function () {
    var jsBuilder = new JavascriptBuilder();
    jsBuilder.responses = this.unSyncResponses;
    jsBuilder.expectations = this.expectations;
    this.browser.driver.executeScript(jsBuilder.toString());
    this.unSyncResponses = [];
    this.expectations = [];
};

HttpBackend.prototype._init = function () {
    var _this = this;
    this.browser.get = function (destination, opt_timeout) {
        if (!_this.isInitialized) {
            _this.init();
        }

        return _this.browserGet.call(browser, destination, opt_timeout);
    };
};

HttpBackend.prototype._when = function (method, url) {
    var request = new HttpRequest(method, url);
    var response = new HttpResponse(request);

    var responseIndex = _.findIndex(this.responses, function (response) {
        return response.request.uid == request.uid;
    });

    if (responseIndex) {
        this.responses.splice(responseIndex, 1, response);
    }

    if (this.options.autoSync && this.isInitialized) {
        var _this = this;
        response.onResponse = function () {
            _this.sync();
        };
    }

    this.responses.push(response);
    this.unSyncResponses.push(response);

    return response;
};

HttpBackend.prototype.verifyNoOutstandingExpectation = function () {
        console.log('TRYING TO VERIFY ');
    var jsBuilder = new JavascriptBuilder();
    var script = jsBuilder.verifyNoOutstandingExpectation();
    if (script) {
        console.log('VERIFYING! ------------');
        this.browser.driver.executeScript(jsBuilder.verifyNoOutstandingExpectation());
    }
};

HttpBackend.prototype._expect = function (method, url) {
    var expectation = new HttpRequest(method, url);
    this.expectations.push(expectation);
    return expectation;
};

module.exports = HttpBackend;
