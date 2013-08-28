nodejs-vksdk
============

Простой SDK для выполнения запросов к API социальной сети «ВКонтакте».


Установка
-------
Просто скопируйте файл vksdk.js в свой проект и подключите.

```js
var VK = require('./vksdk.js');
```

Настройка
-------

Поддерживается два способа авторизации и отправки запросов.

* sig (через подпись, по http) (http://vk.com/developers.php?oid=-1&p=%D0%92%D0%B7%D0%B0%D0%B8%D0%BC%D0%BE%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D0%B5_%D1%81_API_%D0%B1%D0%B5%D0%B7_HTTPS)
* oauth, через https (http://vk.com/developers.php?oid=-1&p=%D0%92%D1%8B%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%BE%D0%B2_%D0%BA_API)

SDK предоставляет оба способа, можно выбрать при инициализации.

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

При необходимости режим выполнения запросов меняется в любой момент:

```js
vk.changeMode('oauth');
```
или

```js
vk.changeMode('sig');
```

Авторизация через sig
-------

Специальная авторизация не требуется, достаточно appID и appSecret


Авторизация через oauth
-------

Для выполнения запросов нужен токен. 


Можно заставить SDK автоматически запросить токен. Полученный токен  - это авторизация 
сервера приложений. С ним можно выполнять некоторые операции, не касающиеся 
пользовательских данных. Например, secure.getAppBalance или secure.sendNotification 

Поскольку токен генирируется не сразу - нужно подождать события.
* appServerTokenReady  - событие успешно полученного токена
* appServerTokenNotReady - ошибка запроса токена

```js
vk.setToken();
vk.on('appServerTokenReady', function() {
    vk.request('secure.getAppBalance');
    // и так далее...
});
vk.on('appServerTokenNotReady', function(_error) {
    // обрабатываем ошибку установки токена
});
```




Поддержка
-------
* 57uff3r@gmail.com
* http://vk.com/s7uff3r
* Дополнительно: база данных городов и стран vk.com http://citieslist.ru/