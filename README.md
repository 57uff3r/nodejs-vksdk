nodejs-vksdk
============

Unstable code in 'refactoring' brunch, work in progress.

Small SDK for vk.com API.

# Installation

    npm install vksdk

# Usage
```js
var VK = require('vksdk');
```

Setup:
```js
var vk = new VK({
    'appID'     : [Your application ID here],
    'appSecret' : [Your application secret code here],
});
```

Required config options:
* appSecret — application secret code (check your application settings on vk.com)
* appID — vk.com application id

Available config options:

* **[bool] https** — with this options all links in API answers will be with https protocol. Disabled by default.
* **[string] version** — vk.com api verions. Default: 5.27
* **[string] language** — Language code for api answers
* **[bool] secure** — enable api requests with tokens. Othervise appID and appSecret will be used. Default false.


You can  read and change config options after initialization:
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
* **[moxed] _requestParams** - object with values of params for api method. E.g ids, filters etc. This param is not required. You also can pass empty object {}
* **[mixed] _response** — special response handler (if needed): function or event name.



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






# HTTP errors
SDK emits 'http-error' event in case of http errors.

```js
vk.on('http-error', function(_e) {
    console.log(_o);
});

```

SDK provides all methods from [events.EventEmitter](http://nodejs.org/api/events.html)

# Support

* 57uff3r@gmail.com
* skype: andrey.korchak
* http://57uff3r.ru
* http://vk.com/s7uff3r


See  also vk.com [cities and counties DB](http://citieslist.ru/)
