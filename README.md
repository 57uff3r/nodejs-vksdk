nodejs-vksdk
============
Small SDK for vk.com API.

# Installation
    npm install vksdk

# Example
```js
// Setup
var VK = require('vksdk');
var vk = new VK({
   'appId'     : 2807970,
   'appSecret' : 'L14ZKpgQPalJdumI6vFK',
   'language'  : 'ru'
});

/**
 * Request server methods
 */

// Setup server access token for server API methods
vk.on('serverTokenReady', function(_o) {
    // Here will be server access token
    vk.setToken(_o.access_token);
});

// Turn on requests with access tokens
vk.setSecureRequests(true);

// Request server API method
vk.request('secure.getSMSHistory', {}, function(_dd) {
    console.log(_dd);
});

/**
 * Request client methods
 */
// First you have to pass access_token from client side JS code
vk.setToken(access_token);

// Request 'users.get' method
vk.request('users.get', {'user_id' : 1}, function(_o) {
    console.log(_o);
});
```

# Setup
```js
var VK = require('vksdk');

var vk = new VK({
    'appId'     : [Your application ID here],
    'appSecret' : [Your application secret code here],
});
```

Required config options:
* appSecret — application secret code (check your application settings on vk.com)
* appId — vk.com application id

Available config options:

* **[bool] https** — with this options all links in API answers will be with https protocol. Disabled by default.
* **[string] version** — vk.com api verions. Default: 5.27
* **[string] language** — Language code for api answers (for old deprecated API)
* **[bool] secure** — enable api requests with tokens. Default false.


You can  read and change some config options:
* **getVersion()** — get current API version
* **setVersion(_v)** — set current API version
* **getLanguage()** — get current API language
* **setLanguage(_v)** — set current API language
* **getHttps()** — get https links usage for API answers
* **setHttps(_v)** — set https links usage for API answers
* **getSecureRequests()** — get token's usage for API requests
* **setSecureRequests(_v)** — set token's usage for API requests


# API requests
For vk.com API requests you have to use method *request(_method, _requestParams, _response)*.

* **[string] _method** — name of vk.com API method,
* **[mixed] _requestParams** - object with values of params for api method. This param is not required. You also can pass empty object *{}*
* **[mixed] _response** — special response handler (not required), function or event name.

Request method gets data from API and returns result. There are 3 ways to get data from API

## Callback
```js
vk.setSecureRequests(false);
vk.request('users.get', {'user_id' : 1}, function(_o) {
console.log(_o);
});
```

## Event
After success API call SDK emits the event named 'done:' + _method;
So if you call method *users.get*, you have to wait event *done:users.get*

```js
vk.setSecureRequests(false);
vk.request('users.get', {'user_id' : 1});
vk.on('done:users.get', function(_o) {
    console.log(_o);
});
```

## Custom event
Result of request will be returned with your custom event

```js
vk.setSecureRequests(false);
vk.request('users.get', {'user_id' : 1}, 'myCustomEvent');
vk.on('myCustomEvent', function(_o) {
    console.log(_o);
});
```

# Server access token
For some api methods you need server access token

```js
vk.requestServerToken();

// Waiting for special 'serverTokenReady' event
vk.on('serverTokenReady', function(_o) {
    // Here will be server access token
    console.log(_o);
});
```

You also can get tokeb with callback or custom event

# HTTP errors
SDK emits 'http-error' event in case of http errors.

```js
vk.on('http-error', function(_e) {
    console.log(_e);
});
```

# JSON parsing errors
SDK emits 'parse-error' event in case of non-valid API answer.

```js
vk.on('parse-error', function(_e) {
    console.log(_e);
});
```

SDK provides all methods from [events.EventEmitter](http://nodejs.org/api/events.html)

# Bonus
You also can request some api methods without any tokens, with [app signature](https://vk.com/pages?oid=-17680044&p=Application_Interaction_with_API)

```js
vk.oldRequest('places.getCountryById', {'cids' : '1,2'}, function(_o) {
    console.log(_o);
});
```

But this way is deprecated and doesn't work for all api methods.


# For developers
Your commits and pull requests are welcome. Please run the tests before

    npm test

You have to provide tests for the new features.

# Support
* 57uff3r@gmail.com
* skype: andrey.korchak
* http://57uff3r.ru
* http://vk.com/s7uff3r

# Thanks to
* [Alex0007](https://github.com/Alex0007)

See  also vk.com [cities and counties DB](http://citieslist.ru/)
