/**
 *
 * SDK for  vk.com API
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
        'version'   : '5.27',
        'language'  : 'ru'
    };

    // no default token
    this.token = false;

    /**
     * Setup config options
     */
    if (typeof(_options) != 'object' || this.isEmpty(_options)) {
        throw 'nodejs-vk-sdk: you have to specify options in sdk constructor';
    }

    if (!_options.hasOwnProperty('appId')) {
        throw 'nodejs-vk-sdk: you have to specify VK application id';
    }

    if (!_options.hasOwnProperty('appSecret')) {
        throw 'nodejs-vk-sdk: you have to specify VK application secret key';
    }

    this.options = this.extend(this.options, _options);

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
VK.prototype.enableHttps = function() {
    this.options.https = true;
    return true;
};

/**
 * Disable https
 * @return {bool}
 */
VK.prototype.disableHttps = function() {
    this.options.https = false;
    return true;
};

/**
 * Disable https
 * @return {bool}
 */
VK.prototype.getHttpsUsage = function() {
    return this.options.https;
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

