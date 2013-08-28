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

Можно заставить SDK автоматически запросить токен. Полученный токен — это авторизация 
сервера приложений. С ним можно выполнять некоторые операции, не касающиеся 
пользовательских данных. Например, secure.getAppBalance или secure.sendNotification.

Поскольку токен генерируется не сразу, нужно подождать события.
* appServerTokenReady — событие успешно полученного токена
* appServerTokenNotReady — ошибка запроса токена

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

Можно получить токен через код, отправленный с фронт-енда. Про процесс авторизации 
и код написано здесь: http://vk.com/developers.php?oid=-1&p=%D0%90%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F_%D1%81%D0%B0%D0%B9%D1%82%D0%BE%D0%B2
В этом случае SDK возьмет код, обратится с ним к oauth И получит токен,
с которым и будет выполнять запросы. Получение токена тоже занимает время, 
поэтому нужно подождать событий. Это токен позволяет запрашивать данные 
пользователей.

```js
vk.setToken({ code : '0819c207b9933a' });
vk.on('tokenByCodeReady', function() {
    vk.request('getProfiles', {'uids' : '29894'});
    // и так далее...
});
vk.on('tokenByCodeNotReady', function(_error) {
    // обрабатываем ошибку установки токена
});
```

Третий способ — задать токен напрямую. Токен можно получить с фронт-енда или использовать 
ранее полученный токен. Здесь дожидаться событий не нужно — токен задается сразу.

```js
vk.setToken( { token :'f1eebc4311e775b128183993ee16302ac036a67af30424238d1oo14d35dfa61896f172ee630b7034a' });
vk.request('getProfiles', {'uids' : '29894'});
vk.on('done:getProfiles', function(_o) {
    console.log(_o);
});
```

Запросы
-------
Запросы выполняются так:

```js
vk.request('getProfiles', {'uids' : '29894'});
vk.on('done:getProfiles', function(_o) {
    console.log(_o);
});
```

Передаем в request название метода API и параметры. По готовности результата сгенерируется
 событие вида done:methodName. В этом примере запрашивается getProfiles, значит 
событие готовности — done:getProfiles.

Бывает и так, что нужно выполнить несколько однотипных запросов. На каждый запрос 
можно назначить свое имя события (чтобы события не конфликтовали):


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

Мы назначили два события: myEvent1 и myEvent2. С первым придут данные для пользователя 
 29894, со вторым — пользователя 1.

Системные события в SDK
-------
* tokenByCodeReady — получен токен по коду
* tokenByCodeNotReady — ошибка получения токена по коду
* appServerTokenReady — получен токен сервера приложений
* appServerTokenNotReady — ошибка получения токена сервера приложений

Полный список методов
-------
* setToken([params]) — установка токена через код, напрямую или запрос токена с сервера.
* changeMode(string) — установка режима работы SDK (oauth или sig)
* getToken() — получить текущий рабочий токен
* request(methodName, methodParams, [eventName]) — выполнить запрос к методу API, используя параметры (и, возможно, указать кастомное событие)

В SDK доступны все методы из events.EventEmitter (http://nodejs.org/api/events.html)

Поддержка
-------
* 57uff3r@gmail.com
* http://57uff3r.ru
* http://vk.com/s7uff3r
* Дополнительно: база данных городов и стран vk.com http://citieslist.ru/