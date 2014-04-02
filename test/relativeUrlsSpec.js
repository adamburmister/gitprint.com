var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var assert = chai.assert;
var should = chai.should();
var urlHelper = require("../lib/url_helper");
var Q = require('q');

chai.use(chaiAsPromised);

describe('Relative URL support', function(){

  it('translates relative image URLs to absolute URLs', function() {    
    var relativePath = 'Documentation/assets/logo.png';
    var input = '![example-image](' + relativePath + ')';
    var baseUrl = 'http://baseurl';
    var result = 'TODO';
    var expected = '![example-image](' + baseUrl + '/' + relativePath + ')';
    result.should.equal(expected);
  });

});