/**
 * @author 57uff3r@gmail.com
 * @see https://github.com/57uff3r/nodejs-vksdk
 */

module.exports = {
        'init' : function(appID, appSecret) {
                this.appID      = appID;
                this.appSecret  = appSecret;
                this.crypto     = require('crypto');
                this.http       = require('http');
        },

        'request' : function(method, params, callback) {         
                this.callback = callback;
                params.api_id           = this.appID;
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
                sig             = sig + this.appSecret;
                params.sig      = this.crypto.createHash('md5').update(sig).digest('hex');

                var requestArray = new Array();
                for(key in params) {
                        requestArray.push(key + '=' + params[key]);
                }
                var requestString = this._implode('&', requestArray);
                
                var options = {
                        host: 'api.vk.com',
                        port: 80,
                        path: '/api.php?' + requestString,
                };
                this.http.get(options, function(res) {
                        var apiResponse = new String();
                        res.setEncoding('utf8');
                        
                        res.on('data', function(chunk) {
                                apiResponse += chunk;
                        });
                        
                        res.on('end',  function() {
                                var o = JSON.parse(apiResponse);
                                module.exports.callback(o);
                        });
                                             
                });
        },

        '_implode' : function implode( glue, pieces ) {
                return ( ( pieces instanceof Array ) ? pieces.join ( glue ) : pieces );
        },
        
        '_sortObjectByKey' : function (o) {
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
        }        
};