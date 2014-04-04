// TODO:
// Wiki's have markup to link between pages... stuff like:
// `[[Installation guide|Installation]]`. This should be rendered as `Installation (full url)`

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var assert = chai.assert;
var should = chai.should();
var urlHelper = require("../lib/url_helper");
var Q = require('q');
var wikiMarkdownPreprocessor = require('../lib/wiki_markdown_preprocessor');

chai.use(chaiAsPromised);

describe('Wiki markup support', function(){
  var preproc;
  before(function() {
  	var options = {
  		baseUrl: 'foo',
  	};
  	preproc = wikiMarkdownPreprocessor.build(options);
  });
});