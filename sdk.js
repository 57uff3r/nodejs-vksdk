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


};

util.inherits(VK, EventEmitter);
module.exports = VK;
