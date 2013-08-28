/**
 * 
 * SDK для предыдущих версий API (без поддержки HTTPS)
 * 
 * @author 57uff3r@gmail.com
 * @see https://github.com/57uff3r/nodejs-vksdk
 */
var     util            = require('util');
        EventEmitter    = require('events').EventEmitter,
        crypto          = require('crypto'),
        http            = require('http');

var VK = function(_appID, _appSecret) {
    var self = this;

    self.appID          = _appID;
    self.appSecret     = _appSecret;

    self.request = function(method, params) {
            params.api_id           = self.appID;
            params.v                = '3.0';
            params.method           = method;
            params.timestamp        = new Date().getTime();
            params.format           = 'json';
            params.random           = Math.floor(Math.random() * 9999)

            params  = this._sortObjectByKey(params);
            var sig = '';
            for(key in params) {
                    sig = sig + key + '=' + params[key];
            }
            sig             = sig + self.appSecret;
            params.sig      = crypto.createHash('md5').update(sig, 'utf8').digest('hex');


            var requestArray = new Array();
            for(key in params) requestArray.push(key + '=' + (params[key]) );
            var requestString = this._implode('&', requestArray);

            var options = {
                    host: 'api.vk.com',
                    port: 80,
                    path: '/api.php?' + requestString,
            };
            http.get(options, function(res) {
                    var apiResponse = new String();
                    res.setEncoding('utf8');

                    res.on('data', function(chunk) {
                            apiResponse += chunk;
                    });

                    res.on('end',  function() {
                            var o = JSON.parse(apiResponse);
                            self.emit('done:' + method, o);
                    });

            });
    };

    self._implode  = function implode( glue, pieces ) {
            return ( ( pieces instanceof Array ) ? pieces.join ( glue ) : pieces );
    };

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

}

util.inherits(VK, EventEmitter);
module.exports = VK;
