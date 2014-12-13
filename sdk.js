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
var VK = function(_options) {
    var self = this;

    // setup options
    if (typeof(_options) != 'object' || _options.length == 0) {
        throw 'nodejs-vk-sdk: you have to specify options in sdk constructor';
    }


    // By default we use latest API version
    self.version = '5.27';

    // set default value for token variable
    self.token  = false;

    /**
     * Get current  API version
     * @return {string}
     */
    self.getVersion = function() {
        return self.version;
    },

    /**
     * Set current  API version
     * @param {string} _v
     *
     * @return {string}
     */
    self.setVersion = function(_v) {
        self.version = _v;
        return true;
    },

    /**
     * Get current access token
     * @return {string}
     */
    self.getToken = function() {
        return self.token;
    },

    /**
     * Set current access token
     * @param {strinf}
     * @return {string}
     */
    self.setToken = function(_t) {
        self.token = _t;
        return true;
    }



    /**
     * Extra stuff
     */
    // Speed up calls to hasOwnProperty
    self.hasOwnProperty = Object.prototype.hasOwnProperty;

    /**
     * Test — if variable empty
     * @param {mixed}
     * @return {bool}
     */
    self.isEmpty = function(_obj) {
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
            if (self.hasOwnProperty.call(_obj, key)) return false;
        }
        return true;
    }


};

util.inherits(VK, EventEmitter);
module.exports = VK;
