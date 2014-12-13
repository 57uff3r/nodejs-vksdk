var assert  = require('chai').assert,
    should  = require('chai').should(),
    VK      = require('../sdk');



// small tests workaround
var done = function(_o) {
};

describe('basicSdk', function() {
  var vk = new VK({
     'appId'     : 2807970,
     'appSecret' : 'L14ZKpgQPalJdumI6vFK'
  });

  this.timeout(20000);

  it('Should test getters and setters', function(done) {

    assert.doesNotThrow(function() {
        assert.equal(vk.getVersion(), '5.27');
    });

    assert.doesNotThrow(function() {
        assert.isTrue(vk.setVersion('5.25'));
        assert.equal(vk.getVersion(), '5.25');
    });

    assert.doesNotThrow(function() {
        assert.isFalse(vk.getToken());
    });

    assert.doesNotThrow(function() {
        assert.isTrue(vk.setToken('abcd'));
        assert.equal(vk.getToken(), 'abcd');
    });

    assert.doesNotThrow(function() {
        assert.isFalse(vk.getHttpsUsage());
        assert.isTrue(vk.enableHttps());
        assert.isTrue(vk.getHttpsUsage());
        assert.isTrue(vk.disableHttps());
        assert.isFalse(vk.getHttpsUsage());

    });

    done();
  });

});


describe('systemStuff', function() {
  var vk = new VK({
     'appId'     : 2807970,
     'appSecret' : 'L14ZKpgQPalJdumI6vFK'
  });

  this.timeout(20000);

  it('Should correctly identify non-empty objects', function(done) {
    assert.doesNotThrow(function() {
      assert.isFalse(vk.isEmpty("Hello"));
      assert.isFalse(vk.isEmpty([1,2,3]));
      assert.isFalse(vk.isEmpty({test: 1}));
      assert.isFalse(vk.isEmpty({length: 3, custom_property: [1,2,3]}));
      done();
    });
  });

  it('Should correctly identify empty objects', function(done) {
    assert.doesNotThrow(function() {
      assert.isTrue(vk.isEmpty(""));
      assert.isTrue(vk.isEmpty({}));
      assert.isTrue(vk.isEmpty([]));
      assert.isTrue(vk.isEmpty({length: 0, custom_property: []}));
      done();
    });
  });


  it('Should correctly merge objects', function(done) {
    assert.doesNotThrow(function() {
      assert.deepEqual(vk.extend({}), {});
      assert.deepEqual(vk.extend({}, {'t' : 1}), {'t' : 1});
      assert.deepEqual(vk.extend({'a' : 1}, {'t' : 1}, {'t' : 2}), {'t' : 2, 'a' : 1});
      done();
    });
  });

});

// describe('api', function() {
//     this.timeout(20000);

//     it('Should load a user profile', function(done) {
//       assert.doesNotThrow(function() {

//           vk.request('getProfiles', {'uids' : '29894'});
//           vk.on('done:getProfiles', function(_o) {
//             assert.equal(_o.response[0].uid, 29894);
//             done();
//           });
//       });
//     });


//     it('Should get response in callback function', function(done) {
//       assert.doesNotThrow(function() {

//           vk.request('getProfiles', {'uids' : '29894'}, function(_o) {
//             assert.equal(_o.response[0].uid, 29894);
//             done();
//           });
//       });
//     });


//     it('Should load a country info', function(done) {
//       assert.doesNotThrow(function() {

//         vk.request('places.getCountryById', {'cids' : '1,2'});
//         vk.on('done:places.getCountryById', function(_o) {
//           assert.equal(_o.response[0].cid, 1);
//           assert.equal(_o.response[1].cid, 2);
//           done();
//         });
//       });
//     });


//     it('Should return an error', function(done) {
//       assert.doesNotThrow(function() {

//         vk.request('secure.getAppBalance', {'cids' : '1,2'});
//         vk.on('done:secure.getAppBalance', function(_o) {
//           assert.equal(_o.error.error_code, 150);
//           done();
//         });
//       });
//     });


//     it('Should fire a custom event', function(done) {
//       assert.doesNotThrow(function() {

//         vk.request('places.getCountryById', {'cids' : '1,2'}, 'myCustomEventName');
//         vk.on('myCustomEventName', function(_o) {
//           assert.equal(_o.response[0].cid, 1);
//           assert.equal(_o.response[1].cid, 2);
//           done();
//         });
//       });
//     });


//     it('Should return an error', function(done) {
//       assert.doesNotThrow(function() {

//         vk.acquireToken('57uff3r@gmail.com', 'test');
//         vk.on('acquireTokenNotReady', function(_o) {
//           // assert.equal(_o.error, 'invalid_request');
//           done();
//         });
//       });
//     });


//     it('Server side request: should return error', function(done) {
//       assert.doesNotThrow(function() {
//         vk.changeMode('oauth');
//         vk.setToken();
//         vk.on('appServerTokenReady', function(_o) {
//           assert.equal(true, !!vk.getToken());
//           done();

//           vk.request('secure.getAppBalance');
//           vk.on('done:secure.getAppBalance', function(_o) {
//             assert.equal(_o.error.error_code, 500);
//           });
//         });
//       });
//     });

//     it('Method works: should run methods', function() {
//       assert.doesNotThrow(function() {
//         assert.isNotNull(vk.getToken());
//         assert.isNull(vk.getUserId());
//         assert.isNull(vk.getExpiresIn());
//       });
//     });

// });


