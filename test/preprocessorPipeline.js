var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var assert = chai.assert;
var should = chai.should();
var Q = require('q');

var PreprocessorPipeline = require('../lib/preprocessorPipeline');

chai.use(chaiAsPromised);

describe('Preprocessor pipeline', function(){
  
  it('should allow for multiple processors to run in turn', function() {
    var pipeline = PreprocessorPipeline({ baseUrl: 'http://baseurl' });
  });

});