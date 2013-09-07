/**
 * 
 * SDK работы с API vk.com
 * Поддерживает запросы через https (oauth)
 * и через подпись+http (sig)
 * 
 * @author 57uff3r@gmail.com
 * @see https://github.com/57uff3r/nodejs-vksdk
 * @see http://57uff3r.ru
 */
var     util            = require('util');
        EventEmitter    = require('events').EventEmitter,
        crypto          = require('crypto'),
        http            = require('http'),
        https           = require('https');

/**
 * Создание нового объекта для связи с API
 * @param {object} _options
 *  - mode  - режим авторизации и выполнения запросов, oauth или sig
 *  - appID - 
 * @returns {undefined}
 */
var VK = function(_options) {
    var self = this;

    // appID, appSecret, mode (sig, oauth)
    self.options        = _options;
    
    /**
     * Выполнение запроса 
     * @param {string} _method метод API для вызова
     * @param {mixed} _requestParams object или null (или undef), параметры запроса к API
     * @param {mixed} _eventName string или null (или undef), кастомное имя генерируемого события
     * @returns {undefined}
     */
    self.request = function(_method, _requestParams, _eventName) {
        if (self.options.mode === 'sig')        self._sigRequest(_method, _requestParams, _eventName);
        else if (self.options.mode === 'oauth') self._oauthRequest(_method, _requestParams, _eventName);
        else throw 'nodejs-vk-sdk: you have to specify sdk work mode (sig or oauth) before requests.';
    };
    
    /**
     * Изменить режим работы SDK 
     * @param {string} _mode sig или outh
     * @returns {undefined}
     */
    self.changeMode = function(_mode) {
        self.mode = _mode;
    };
    
    /**
     * Обновления токена доступа для работы через oauth
     * @param {mixed} _param
     *     при пустом значении создается токен для сервера приложений
     *     { code : string }  - создается токен на основе кода
     *     { token : string }  - токен устанавливается напрямую
     * @returns {undefined}
     */
    self.setToken = function(_param) {
        if (typeof(_param) === 'object') {
            if (_param.token) {
                self.token = _param.token;
            } else if (_param.code) {
                self._setUpTokenByCode(_param.code);
            }            
        } else {
            self._setUpAppServerToken();
        }
    };
    
    /**
     * Вернуть текущий работающий токен
     * @returns {@exp;self@pro;token}
     */
    self.getToken = function() {
        return self.token;
    };
    
    /**
     * Установка токена через код
     * @param {string} _code код на получение токена
     * @returns {undefined}
     */
    self._setUpTokenByCode = function(_code) {
        var options = {
            host: 'oauth.vk.com',
            port: 443,
            path: '/access_token?client_id=' + self.options.appID +
                '&client_secret=' + self.options.appSecret + 
                '&code=' + _code
        };
       
        https.get(options, function(res) {
            
            var apiResponse = new String();
            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                apiResponse += chunk;
            });

            res.on('end',  function() {
                var o = JSON.parse(apiResponse);
                if (!o.access_token) { self.emit('tokenByCodeNotReady', o);

                } else { 
                    self.token = o.access_token;
                    self.emit('tokenByCodeReady');
                }
            });

        });         
    };    
    
    /**
     * Установка токена для сервера приложений
     * @returns {undefined}
     */
    self._setUpAppServerToken = function() {
        var options = {
            host: 'api.vk.com',
            port: 443,
            path: '/oauth/access_token?client_id=' + self.options.appID +
                '&client_secret=' + self.options.appSecret + 
                '&grant_type=client_credentials'
        };
        https.get(options, function(res) {
            
            var apiResponse = new String();
            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                apiResponse += chunk;
            });

            res.on('end',  function() {
                var o = JSON.parse(apiResponse);
                if (o.error) { self.emit('appServerTokenNotReady', o);

                } else { 
                    self.token = o.access_token;
                    self.emit('appServerTokenReady');
                }
            });

        });         
    };
    
    /**
     * Выполнение запроса через outh
     * @param {string} _method метод API для вызова
     * @param {mixed} _params object или null (или undef), параметры запроса к API
     * @param {mixed} _eventName string или null (или undef), кастомное имя генерируемого события
     * @returns {undefined}
     */   
    self._oauthRequest = function(_method, _params, _eventName) {
        //console.log(self.token);
        var options = {
            host: 'api.vk.com',
            port: 443,
            path: '/method/' + _method + '?' +
                'access_token=' + self.token
        };
       
        for(key in _params) {
            options.path += ('&' + key + '=' + _params[key]);
        }
        
        https.get(options, function(res) {
            var apiResponse = new String();
            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                apiResponse += chunk;
            });

            res.on('end',  function() {
                var o = JSON.parse(apiResponse);
                if (!_eventName) self.emit('done:' + _method, o);
                else self.emit(_eventName, o);
            });

        });
    };
    
    /**
     * Выполнение запроса через подпись + http
     * @param {string} _method метод API для вызова
     * @param {mixed} _params object или null (или undef), параметры запроса к API
     * @param {mixed} _eventName string или null (или undef), кастомное имя генерируемого события
     * @returns {undefined}
     */    
    self._sigRequest = function(_method, _params, _eventName) {

        var params              = (!!_params ? _params : {});
        params.api_id           = self.options.appID;
        params.v                = '3.0';
        params.method           = _method;
        params.timestamp        = new Date().getTime();
        params.format           = 'json';
        params.random           = Math.floor(Math.random() * 9999);

        params  = this._sortObjectByKey(params);
        var sig = '';
        for(key in params) {
            sig = sig + key + '=' + params[key];
        }
        sig             = sig + self.options.appSecret;
        params.sig      = crypto.createHash('md5').update(sig, 'utf8').digest('hex');


        var requestArray = new Array();
        for(key in params) requestArray.push(key + '=' + (params[key]) );
        var requestString = this._implode('&', requestArray);

        var options = {
            host: 'api.vk.com',
            port: 80,
            path: '/api.php?' + requestString
        };
        http.get(options, function(res) {
            var apiResponse = new String();
            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                apiResponse += chunk;
            });

            res.on('end',  function() {
                var o = JSON.parse(apiResponse);
                if (!_eventName) self.emit('done:' + _method, o);
                else self.emit(_eventName, o);
            });
        });
        
    };

    /**
     * Склейка массива в строку с помощью разделителя
     * @param {string} glue разделитель для склеенной строки
     * @param {array} pieces данные для склейки
     * @returns {@exp;pieces@call;join|@exp;@exp;pieces@call;joinpieces|VK.implode.pieces}
     */
    self._implode  = function implode( glue, pieces ) {
        return ( ( pieces instanceof Array ) ? pieces.join ( glue ) : pieces );
    };

    /**
     * Сортировка свойств объекта по имена
     * @param {object} o Объект для сортировки
     * @returns {object}
     */
    self._sortObjectByKey = function (o) {
        var sorted = {},
        key, a = [];

        for (key in o) {
            if (o.hasOwnProperty(key)) {
                a.push(key);
            }
        }

        a.sort();

        for (key = 0; key < a.length; key++) {
            sorted[a[key]] = o[a[key]];
        }
        return sorted;
    };

};

util.inherits(VK, EventEmitter);
module.exports = VK;



