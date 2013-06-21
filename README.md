nodejs-vksdk
============

Простой SDK для выполнения запросов к API социальной сети «ВКонтакте».


Установка
-------
Просто скопируйте файл vksdk.js в свой проект и подключите.

```js
var VK = require('./vksdk.js');
```

Использование
-------
Введите параметры доступа к API: ID приложения и секретный ключ.

```js
var vk = new VK('2306377', 'QYjhHF9YskkskPnKbXhX40RqQ');
```

Выполнение запросов осуществляется так:
```js
vk.request('getProfiles', {'uids' : '29894'});
vk.on('done:getProfiles', function(_o) {
    console.log(_o);
});

vk.request('places.getCountryById', {'cids' : '1,2'});
vk.on('done:places.getCountryById', function(_o) {
    console.log(_o);
});
```

* Первый параметр &mdash; название метода API.
* Второй &mdash; параметры запроса к методу. Если параметров нет &mdash; передайте пустой объект.

При завершении обращения к API библиотека сгенерирует событие вида done:methodName. В коде выше запрашиваются
два метода (getProfiles, places.getCountryById), а по результатам генерируются два события (done:getProfiles,
done:places.getCountryById). Вместе с событием передается ответ API.

Поддержка
-------
* 57uff3r@gmail.com
* http://vk.com/s7uff3r