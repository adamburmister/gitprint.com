var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var assert = chai.assert;
var should = chai.should();
var Q = require('q');

var relImgPreproc = require('../lib/preprocessor/relToAbsImageUrl');

chai.use(chaiAsPromised);

describe('Relative URL support', function(){
  var _preproc;
  var _baseUrl = 'http://baseurl';

  before(function() {
    var options = {
      baseUrl: _baseUrl,
    };
    _preproc = relImgPreproc.build(options);
  });

  describe('alt text', function() {

    it('should allow single word alt text', function(done) {
      var input = '![imgA](imgA.png)';
      var expected = '![imgA](' + _baseUrl + '/' + 'imgA.png)';

      var stream = _preproc(input);

      stream.on('data', function (data) {
        data.should.equal(expected);
        done();
      });

      stream.write(input);
    });


    it('should allow multi-word alt text', function(done) {
      var input = '![imgA has spaces](imgA.png)';
      var expected = '![imgA has spaces](' + _baseUrl + '/' + 'imgA.png)';

      var stream = _preproc(input);

      stream.on('data', function (data) {
        data.should.equal(expected);
        done();
      });

      stream.write(input);
    });


    it('should allow for alt text after the image reference', function(done) {
      var input = '![imgA](imgA.png "alt text at end")';
      var expected = '![imgA](' + _baseUrl + '/' + 'imgA.png "alt text at end")';

      var stream = _preproc(input);

      stream.on('data', function (data) {
        data.should.equal(expected);
        done();
      });

      stream.write(input);
    })
  });

  it('should support input containing a single markdown image (relative to the current folder) reference', function(done) {
    var input = '![imgA alt](imgA.png)';
    var expected = '![imgA alt](' + _baseUrl + '/imgA.png)';

    var stream = _preproc(input);

    stream.on('data', function (data) {
      data.should.equal(expected);
      done();
    });

    stream.write(input);
  });

  it('should support input containing a single markdown image (relative to the child folder) reference', function(done) {
    var relativePath = 'ChildFolder';
    var input = '![imgA alt](' + relativePath + '/imgA.png)';
    var expected = '![imgA alt](' + _baseUrl + '/' + relativePath + '/imgA.png)';

    var stream = _preproc(input);

    stream.on('data', function (data) {
      data.should.equal(expected);
      done();
    });

    stream.write(input);
  });

  it('should support input containing a single markdown image (relative to a root child folder) reference', function(done) {
    var relativePath = '/ChildFolder';
    var input = '![imgA alt](' + relativePath + '/imgA.png)';
    var expected = '![imgA alt](' + _baseUrl + relativePath + '/imgA.png)';

    var stream = _preproc(input);

    stream.on('data', function (data) {
      data.should.equal(expected);
      done();
    });

    stream.write(input);
  });


  it('should not modify markdown image refernces which use absolute URLs', function(done) {
    var input = '![imgA alt](http://baseurl/imgA.png)';
    var expected = '![imgA alt](http://baseurl/imgA.png)';

    var stream = _preproc(input);

    stream.on('data', function (data) {
      data.should.equal(expected);
      done();
    });

    stream.write(input);
  });

  it('should support input containing multiple relative URLs', function(done) {
    var relativePath = 'Documentation/assets/';
    var input = 'TEST MARKDOWN ![imgA](' + relativePath + 'imgA.png) with MULTIPLE IMAGES ![imgB](' + relativePath + 'imgB.png)';
    var expected = 'TEST MARKDOWN ![imgA](' + _baseUrl + '/' + relativePath + 'imgA.png) with MULTIPLE IMAGES ![imgB](' + _baseUrl + '/' + relativePath + 'imgB.png)';

    var stream = _preproc(input);

    stream.on('data', function (data) {
      data.should.equal(expected);
      done();
    });

    stream.write(input);
  });

});