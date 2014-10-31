nodejs-vksdk
============

Small SDK for vk.com API.

Installation
-------

    npm install vksdk

Usage
-------
```js
var VK = require('vksdk');
```

You can use two ways of performing API requests:

* [sig (with signature and http)](http://vk.com/pages?oid=-17680044&p=Application_Interaction_with_API)
* token (oauth or direct token request)

This SDK provides both ways:

```js
var vk = new VK({
    'appID'     : 2807970,
    'appSecret' : 'L1ZKpgQPalJdumI6vFK',
    'mode'      : 'oauth'
});
```

```js
var vk = new VK({
    'appID'     : 2807970,
    'appSecret' : 'L1ZKpgQPalJdumI6vFK',
    'mode'      : 'sig'
});
```

You also can change request mode 'on-fly':

```js
vk.changeMode('oauth');
```
or

```js
vk.changeMode('sig');
```

### How to setup version of API and language

By default used API version 3.0 and Russian language.

You may setup [latest version](https://vk.com/dev/versions) of vk.com API and change language.

```js
var vk = new VK({
    'appID'     : 2807970,
    'appSecret' : 'L1ZKpgQPalJdumI6vFK',
    'mode'      : 'oauth',
    'version'   : '5.26',
    'language'  : 'en'
});

```


Signature auth
-------
You need just your appID and appSecret.


Token auth
-------
You need token to perform api requests.

SDK can automaticly provide tokens for server-side applications. With server-side token you
can perform only limited set of api methods like secure.getAppBalance or secure.sendNotification.

SDK has two events for server-side token requests:
* appServerTokenReady - token is ready
* appServerTokenNotReady — something was wrong

```js
vk.setToken();
vk.on('appServerTokenReady', function() {
    vk.request('secure.getAppBalance');
    // etc
});
vk.on('appServerTokenNotReady', function(_error) {
    // error handler
});
```

Second way — get token for client API requests with [special code from your fron-end](http://vk.com/developers.php?oid=-1&p=%D0%90%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F_%D1%81%D0%B0%D0%B9%D1%82%D0%BE%D0%B2).

```js
vk.setToken({ code : '0819c207b9933a' });
vk.on('tokenByCodeReady', function() {
    vk.request('getProfiles', {'uids' : '29894'});
    // etc...
});
vk.on('tokenByCodeNotReady', function(_error) {
    // error handler
});
```

Third way — get token directly from your application in customers browser.
```js
vk.setToken( { token :'f1eebc4311e775b128183993ee16302ac036a67af30424238d1oo14d35dfa61896f172ee630b7034a' });
vk.request('getProfiles', {'uids' : '29894'});
vk.on('done:getProfiles', function(_o) {
    console.log(_o);
});
```

Fourth way -  get token using customers vk.com login and password.
```js
vk.acquireToken('vk_com_login@mail.com', 'password');
vk.on('appServerTokenReady', function() {
    vk.request('acquireTokenReady');
    // etc
});
vk.on('acquireTokenNotReady', function(_error) {
    // error handler
});
```


Requests
-------

```js
vk.request('getProfiles', {'uids' : '29894'});
vk.on('done:getProfiles', function(_o) {
    console.log(_o);
});
```

There are two ways to get response: event and callback function.

Event
-------
When request result will be ready, SDK will fire event with request result.
Event name will be like  done:methodName. So if you request getProfiles() SDK will fire
done:getProfiles event();

But you can set your custom event name:

```js
vk.request('getProfiles', {'uids' : '29894'}, 'myEvent1');
vk.on('myEvent1', function(_o) {
    console.log(_o);
});

vk.request('getProfiles', {'uids' : '1'}, 'myEvent2');
vk.on('myEvent2', function(_o) {
    console.log(_o);
});
```

Callback
-------
When request result will be ready, SDK will call callback function with request result.
For this, you need to specify callback with 3rd parameter of request.

Example:

```js
vk.request('getProfiles', {'uids' : '29894'}, function(_o) {
    console.log(_o);
});

```

System events in SDK
-------
You can't change the names of this events.

* tokenByCodeReady
* tokenByCodeNotReady
* appServerTokenReady
* appServerTokenNotReady
* acquireTokenReady
* acquireTokenNotReady

Methods
-------
* acquireToken(login, password) - request token by login and password
* setToken([params]) — request token using code from client-side
* changeMode(string) — set up request mode (oauth or sig)
* getToken() — get current token
* request(methodName, methodParams, [response], responseType) — request API method

SDK provides all methods from [events.EventEmitter](http://nodejs.org/api/events.html)

Support
-------
* 57uff3r@gmail.com
* skype: andrey.korchak
* http://57uff3r.ru
* http://vk.com/s7uff3r


See  also vk.com [cities and counties DB](http://citieslist.ru/)
