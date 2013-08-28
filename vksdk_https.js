/**
 * 
 * SDK для новой API (без поддержки HTTPS)
 * 
 * @author 57uff3r@gmail.com
 * @see https://github.com/57uff3r/nodejs-vksdk
 */
var     util            = require('util');
        EventEmitter    = require('events').EventEmitter,
        https           = require('https');

var VK = function(_appID, _appSecret, _token) {
    var self = this;

    self.appID         = _appID;
    self.appSecret     = _appSecret;
    self.token         = _token;
  
    
    self.getCurrentToken = function() {
        return self.token;
    };
    
    self.request = function(_method, _params) {
        
        var options = {
                host: 'api.vk.com',
                path: '/method/' + _method + '?' +
                        'cids=1' + '&access_token=' + self.token
        };
        
        https.get(options, function(res) {
                var apiResponse = new String();
                res.setEncoding('utf8');

                res.on('data', function(chunk) {
                        apiResponse += chunk;
                });                   

                res.on('end',  function() {
                     var o = JSON.parse(apiResponse);
                     self.emit('done:' + _method, o);
                });
                //res.end();
        });             
        
    };
    

    self._getTokenFromServer = function() {
        
        var options = {
                host: 'api.vk.com',
                port: 443,
                path: '/oauth/access_token?client_id=' + self.appID +
                    '&client_secret=' + self.appSecret + 
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
                        if (o.error) { self.emit('notReady', o);
                            
                        } else { 
                            self.token = o.access_token;
                            self.emit('ready');
                        }
                        
                });

        });        
        
    };
    
    if (!self.token) {
        self._getTokenFromServer();
    } 

};

util.inherits(VK, EventEmitter);
module.exports = VK;
