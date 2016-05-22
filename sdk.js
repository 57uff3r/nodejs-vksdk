/**
 *
 * SDK for  vk.com API
 *
 * @author 57uff3r@gmail.com
 * @see https://github.com/57uff3r/nodejs-vksdk
 * @see http://57uff3r.ru
 */
var     util            = require('util'),
        EventEmitter    = require('events').EventEmitter,
        crypto          = require('crypto'),
        http            = require('http'),
        https           = require('https');

/**
 * Create new SDK object
 * @param {object} _options
 *  - mode  - auth mode (oauth or sig)
 *  - appID -
 * @returns {undefined}
 */
function VK(_options) {

    // set default options
    this.options = {
        'appSecret' : false,
        'appId'     : false,
        'https'     : false,
        'version'   : '5.58',
        'language'  : 'ru',
        'secure'    : false
    };

    // no default token
    this.token = false;

    /**
     * Setup config options
     */
    if (typeof(_options) != 'object' || this.isEmpty(_options)) {
        throw new Error('nodejs-vk-sdk: you have to specify options in sdk constructor');
    }

    if (!_options.hasOwnProperty('appId')) {
        throw new Error('nodejs-vk-sdk: you have to specify VK application id');
    }

    this.options = this.extend(this.options, _options);

    this.reqLastTime = new Date(0)
    this.requestingNow = false
}


util.inherits(VK, EventEmitter);
module.exports = VK;


/**
 * =========================== Getters and setters
 */
/**
 * Get current  API version
 * @return {string}
 */
VK.prototype.getVersion = function() {
    return this.options.version;
};

/**
 * Set current  API version
 * @param {string} _v
 *
 * @return {string}
 */
VK.prototype.setVersion = function(_v) {
    this.options.version = _v;
    return true;
};

/**
 * Get current  API language
 * @return {string}
 */
VK.prototype.getLanguage = function() {
    return this.options.language;
};

/**
 * Set current  API language
 * @param {string} _v
 *
 * @return {string}
 */
VK.prototype.setLanguage = function(_l) {
    this.options.language = _l;
    return true;
};


/**
 * Enable https
 * @return {bool}
 */
VK.prototype.setHttps = function(_v) {
    this.options.https = _v;
    return true;
};

/**
 * Disable https
 * @return {bool}
 */
VK.prototype.getHttps = function() {
    return this.options.https;
};

/**
 * Enable https
 * @return {bool}
 */
VK.prototype.setSecureRequests = function(_v) {
    this.options.secure = _v;
    return true;
};

/**
 * Disable https
 * @return {bool}
 */
VK.prototype.getSecureRequests = function() {
    return this.options.secure;
};

/**
 * Get current access token
 * @return {string}
 */
VK.prototype.getToken = function() {
    return this.token;
};

/**
 * Set current access token
 * @param {strinf}
 * @return {string}
 */
VK.prototype.setToken = function(_t) {
    this.token = _t;
    return true;
};

VK.prototype.waitForNextRequest = function (_cb) {
    var self = this;

    if (new Date() - this.reqLastTime > 334 && !this.requestingNow) {
        _cb();
    } else setTimeout(function () {
        self.waitForNextRequest(_cb);
    }, 50);
};

/**
 * =========================== Dealing with api
 */
/**
 * Request API method with signature
 * @param {string} _method
 * @param {mixed} _params
 * @param {mixed} _response
 * @returns {mixed}
 *
 * @see https://vk.com/pages?oid=-17680044&p=Application_Interaction_with_API
 */
VK.prototype.oldRequest = function(_method, _requestParams, _response) {
    var responseType = 'event';

    if ( typeof(_response) === 'function') {
        responseType = 'callback';
    }

    var params             = (!!_requestParams ? _requestParams : {});
    params.api_id          = this.options.appId;
    params.v               = '3.0';
    params.lang            = ('lang' in params) ? params['lang'] :  this.options.language ||  this.default.language;
    params.method          = _method;
    params.timestamp        = Math.round(new Date().getTime() / 1000);
    params.format          = 'json';
    params.random          = Math.floor(Math.random() * 9999);

    // JS doesn't guarantee the sequence of parameters in the object. It can break.
    params  = this.sortObjectByKey(params);
    params.sig             = this._createSig(params);

    var requestString = this.buildQuery(params);

    var options = {
        host: 'api.vk.com',
        port: 80,
        path: '/api.php?' + requestString
    };

    var self = this;

    http.get(options, function(res) {
        var apiResponse = new String();
        res.setEncoding('utf8');

        res.on('data', function(chunk) {
            apiResponse += chunk;
        });

        res.on('end', function() {
            var o = JSON.parse(apiResponse);
            if (responseType === 'callback' && typeof _response === 'function') {
                _response(o);
            } else {
                if (responseType === 'event' && !!_response) {
                    return self.emit(_response, o);
                }
                return self.emit('done:' + _method, o);
            }
        });
    }).on('error', function (e) {
        self.emit('http-error', e);
    });
};

/**
 * Request API method
 * @param {string} _method
 * @param {mixed} _params
 * @param {mixed} _response
 * @returns {mixed}
 *
 * @see https://vk.com/pages?oid=-17680044&p=Application_Interaction_with_API
 */
VK.prototype.request = function(_method, _requestParams, _response) {
    var responseType = 'event';

    if ( typeof(_response) === 'function') {
        responseType = 'callback';
    }

    var self = this;

    var params = {
        'lang'  : this.options.lang,
        'v'     : this.options.version,
        'https' : (this.options.https) ? 1 : 0
    };

    if (this.isEmpty(_requestParams) === false) {
        for (var i in _requestParams) {
            params[i] = _requestParams[i];
        }
    }

    var requestString = this.buildQuery(params);

    if (this.options.secure) {
        if (this.token) {
            requestString = requestString + '&access_token=' + this.token;
        }

        if (this.options.appSecret) {
            requestString = requestString + '&client_secret=' + this.options.appSecret;
        }
    }

    var options = {
        host: 'api.vk.com',
        port: 443,
        path: '/method/' + _method ,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': requestString.length
        }
    };

    this.waitForNextRequest(function () {
        self.requestingNow = true;
        var post_req = https.request(options, function(res) {
            var apiResponse = "";
            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                apiResponse += chunk;
            });

            res.on('end', function() {
              self.reqLastTime = new Date();
              self.requestingNow = false;
              try {
                var o = JSON.parse(apiResponse);
              } catch(e) {
                  return self.emit('parse-error', apiResponse);
              }

              if (responseType === 'callback' && typeof _response === 'function') {
                  _response(o);
              } else {
                  if (responseType === 'event' && !!_response) {
                      return self.emit(_response, o);
                  }
                  return self.emit('done:' + _method, o);
              }
            });
        }).on('error', function (e) {
            self.requestingNow = false;
            self.emit('http-error', e);
        });

        post_req.write(requestString);
        post_req.end();
    })
};

/**
 * Request server token
 *
 * @param {Function} _response - callback
 * @param {String} [_code] - authorization code
 * @param {String} [_redirect_uri] - URL where code has been received
 *
 */
VK.prototype.requestServerToken = function(_response, _code, _redirect_uri) {
    var responseType = 'event';

    if ( typeof(_response) === 'function') {
        responseType = 'callback';
    }

    var path = '/access_token?client_id=' + this.options.appId +
            '&client_secret=' + this.options.appSecret;

    if (typeof _code !== 'undefined' && typeof _redirect_uri !== 'undefined') {
        path += '&redirect_uri=' + _redirect_uri + '&code=' + _code;
    } else {
        path += '&v=' + this.options.version + '&grant_type=client_credentials';
    }

    var options = {
        host: 'oauth.vk.com',
        port: 443,
        path: path
    };

    var self  = this;

    https.get(options, function(res) {
        var apiResponse = new String();
        res.setEncoding('utf8');

        res.on('data', function(chunk) {
            apiResponse += chunk;
        });

        res.on('end', function() {
            var o = JSON.parse(apiResponse);
            if (responseType === 'callback' && typeof _response === 'function') {
                _response(o);
            } else {
                if (responseType === 'event' && !!_response) {
                    return self.emit(_response, o);
                }
                return self.emit('serverTokenReady', o);
            }
        });
    }).on('error', function (e) {
        self.emit('http-error', e);
    });
};



/**
 * =========================== Extra stuff
 */
// Speed up calls to hasOwnProperty
VK.prototype.hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Test — if variable empty
 * @param {mixed}
 * @return {bool}
 */
VK.prototype.isEmpty = function(_obj) {
    // null and undefined are "empty"
    if (_obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (_obj.length > 0)    return false;
    if (_obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in _obj) {
        if (this.hasOwnProperty.call(_obj, key)) return false;
    }
    return true;
};

/**
 * Merge multiple JSON's
 * @param {object}
 * @return {object}
 */
VK.prototype.extend = function(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
};

/**
 * Implode array to string
 * @param {string} glue
 * @param {array} pieces
 * @returns {@exp;pieces@call;join|@exp;@exp;pieces@call;joinpieces|VK.implode.pieces}
 */
VK.prototype.implode = function implode( glue, pieces ) {
    return ( ( pieces instanceof Array ) ? pieces.join ( glue ) : pieces );
};

/**
 * Sort object properties by name
 * @param {object} o
 * @returns {object}
 */
VK.prototype.sortObjectByKey = function (o) {
    var sorted = {},
    key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (var key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
};


/**
 * Generate URL-encoded query string
 * @param  {object} params
 * @return {string}
 */
VK.prototype.buildQuery = function(params) {
    var arr = [];
    for(var name in params) {
        var value = params[name];

        if("undefined" !== typeof value) {
          arr.push( name+'='+ encodeURIComponent(value) );
        }
    }

    return this.implode('&', arr);
};

/**
 * Authorization on a Remote Side
 * https://vk.com/dev/openapi_auth
 *
 * @param {String} sessionData
 * @returns {Boolean}
 */
VK.prototype.isAuthOpenAPIMember = function(sessionData) {
    var data = this._parseSessionData(sessionData);

    if (data && data.sig === this._createSig(data) && data.expire > Math.floor(Date.now() / 1000)) {
        return true;
    }
    return false;
};

/**
 * Create signature from parameters
 *
 * @param {Object} params
 * @returns {String}
 * @private
 */
VK.prototype._createSig = function(params) {
    var sig = '';
    for(var key in params) {
        if (key !== 'sig') {
            sig += key + '=' + params[key];
        }
    }
    sig = sig + this.options.appSecret;
    return crypto.createHash('md5').update(sig, 'utf8').digest('hex');
};

/**
 * Parse params from auth session data
 *
 * @param {String} data
 *
 * @returns {Object|Undefined}
 * @private
 */
VK.prototype._parseSessionData = function(data) {
    var items = data.split('&'),
        validKeys = ['expire', 'mid', 'secret', 'sid', 'sig'],
        parsedData = {},
        item,
        key,
        k;

    for (k in items) {

        item = items[k].split('=');
        key = item[0];

        if (this.isEmpty(key) || this.isEmpty(item[1]) || validKeys.indexOf(key) === -1) {
            return;
        }

        parsedData[key] = item[1];
    }

    for (k in validKeys) {
        if (typeof parsedData[validKeys[k]] === 'undefined') {
            return;
        }
    }

    return this.sortObjectByKey(parsedData);
};
