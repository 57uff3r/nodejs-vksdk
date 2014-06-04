var assert  = require('chai').assert,
    should  = require('chai').should(),
    VK      = require('../vksdk');

var vk = new VK({
   'appID'     : 2807970,
   'appSecret' : 'L14ZKpgQPalJdumI6vFK',
   'mode'      : 'sig'
});

// small tests workaround
var done = function(_o) {
};

describe('api', function() {

    it('should load a user profile', function(done) {
        assert.doesNotThrow(function() {

            vk.request('getProfiles', {'uids' : '29894'});
            vk.on('done:getProfiles', function(_o) {
                assert.equal(_o.response[0].uid, 29894);
                done();
            });
        });

    });
});
