// // TODO:
// // Wiki's have markup to link between pages... stuff like:
// // `[[Installation guide|Installation]]`. This should be rendered as `Installation (full url)`

// var chai = require("chai");
// var chaiAsPromised = require("chai-as-promised");
// var assert = chai.assert;
// var should = chai.should();
// var urlHelper = require("../lib/url_helper");
// var Q = require('q');
// var wikiMarkdownPreprocessor = require('../lib/wiki_markdown_preprocessor');

// chai.use(chaiAsPromised);

// describe('Wiki markup support', function(){
//   var _preproc;
//   var _baseUrl = 'http://baseurl';

//   before(function() {
//     var options = {
//       baseUrl: _baseUrl,
//     };
//     _preproc = wikiMarkdownPreprocessor.build(options);
//   });

//   it('should not modify standard wiki links', function(done) {
//     var input = 'A sentence with a [Google](http://www.google.com) link in it';
//     var expected = input;

//     var stream = _preproc(input);

//     stream.on('data', function (data) {
//       data.should.equal(expected);
//       done();
//     });

//     stream.write(input);
//   });

//   it('should not translate wiki link markdown to standard markdown', function(done) {
//     var input = 'A sentence with a [[Google|http://www.google.com]] link in it';
//     var expected = 'A sentence with a [Google](http://www.google.com) link in it';

//     var stream = _preproc(input);

//     stream.on('data', function (data) {
//       data.should.equal(expected);
//       done();
//     });

//     stream.write(input);
//   });

// });