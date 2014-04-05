var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var assert = chai.assert;
var should = chai.should();
var redundantLinkRemovalPreprocessor = require("../lib/preprocessor/redundantLinkRemoval");
var Q = require('q');

chai.use(chaiAsPromised);

describe('Redundant link removal', function(){
  var _preproc;

  before(function() {
    var options = {};
    _preproc = redundantLinkRemovalPreprocessor.build(options);
  });

  it('removes redundant links', function(done) {
	  var input = '[http://google.com/subpath](http://google.com/subpath)';
	  var expected = 'http://google.com/subpath';

	  var stream = _preproc(input);

	  stream.on('data', function (data) {
	    data.should.equal(expected);
	    done();
	  });

	  stream.write(input);
	});

  it('removes redundant links in amongst sentences', function(done) {
	  var input = 'This sentence contains [http://google.com/subpath](http://google.com/subpath) a URL';
	  var expected = 'This sentence contains http://google.com/subpath a URL';

	  var stream = _preproc(input);

	  stream.on('data', function (data) {
	    data.should.equal(expected);
	    done();
	  });

	  stream.write(input);
	});

  it("doens't removed non-redundant links", function(done) {
	  var input = 'The sentence contains a [http://google.com](http://google.com/subpath) URL';
	  var expected = input;

	  var stream = _preproc(input);

	  stream.on('data', function (data) {
	    data.should.equal(expected);
	    done();
	  });

	  stream.write(input);
	});

});