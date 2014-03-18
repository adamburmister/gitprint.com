var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var assert = chai.assert;
var should = chai.should();
var urlHelper = require("../lib/url_translation_helper");
var Q = require('q');

chai.use(chaiAsPromised);

describe('UrlTranslationHelper', function(){
  describe('boolean tests', function () {
    describe('#isRepoIndex', function () {

      it('flags /adamburmister/gitprint.com as index', function() {
        var path = "/adamburmister/gitprint.com";
        urlHelper.isRepoIndex(path).should.equal(true);
      });

      it('flags /adamburmister/gitprint.com/ as index', function() {
        var path = "/adamburmister/gitprint.com/";
        urlHelper.isRepoIndex(path).should.equal(true);
      });

      it('flags /adamburmister/gitprint.com/master/ as index', function() {
        var path = "/adamburmister/gitprint.com/master/";
        urlHelper.isRepoIndex(path).should.equal(true);
      });

      it('flags /adamburmister/gitprint.com/blob/master as a index/', function() {
        var path = "/adamburmister/gitprint.com/blob/master/";
        urlHelper.isRepoIndex(path).should.equal(true);
      });

    });

    describe('#isRepoFile', function () {
      it('flags /adamburmister/gitprint.com/master/README.md as a repo file', function() {
        var path = "/adamburmister/gitprint.com/master/README.md";
        urlHelper.isRepoFile(path).should.equal(true);
      });

      it('flags /adamburmister/gitprint.com/blob/master/README.md as a repo file', function() {
        var path = "/adamburmister/gitprint.com/blob/master/README.md";
        urlHelper.isRepoFile(path).should.equal(true);
      });

      it('flags /adamburmister/gitprint.com/blob/feature/github-api/README.md as a repo file', function() {
        var path = "/adamburmister/gitprint.com/blob/feature/github-api/README.md";
        urlHelper.isRepoFile(path).should.equal(true);
      });

      it('flags /adamburmister/gitprint.com/master/test/examples/README.md as a repo file', function() {
        var path = "/adamburmister/gitprint.com/master/test/examples/README.md";
        urlHelper.isRepoFile(path).should.equal(true);
      });
    });
    
    describe('gists', function () {
      // todo
    });
  });

  describe('translation', function () {
    it('should translate http://gitprint.com/adamburmister/gitprint.com', function(done) {
      var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com";
      var expected = "https://raw.github.com/adamburmister/gitprint.com/master/README.md";
      urlHelper.translate(gitprintUrl).should.eventually.equal(expected);
    });

    it('should translate http://gitprint.com/adamburmister/gitprint.com/', function(done){
      var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/";
      var expected = "https://raw.github.com/adamburmister/gitprint.com/master/README.md";
      urlHelper.translate(gitprintUrl).should.eventually.equal(expected);
    });

    it('should translate http://gitprint.com/adamburmister/gitprint.com/master/', function(done){
      var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/master/";
      var expected = "https://raw.github.com/adamburmister/gitprint.com/master/README.md";
      urlHelper.translate(gitprintUrl).should.eventually.equal(expected);
    });

    it('should translate http://gitprint.com/adamburmister/gitprint.com/blob/master/', function(done){
      var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/blob/master/";
      var expected = "https://raw.github.com/adamburmister/gitprint.com/master/README.md";
      urlHelper.translate(gitprintUrl).should.eventually.equal(expected);
    });

    it('should translate http://gitprint.com/adamburmister/gitprint.com/master/README.md', function(){
      var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/master/README.md";
      var expected = "https://raw.github.com/adamburmister/gitprint.com/master/README.md";
      urlHelper.translate(gitprintUrl).should.equal(expected);
    });

    it('should translate http://gitprint.com/adamburmister/gitprint.com/blob/master/README.md', function(){
      var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/blob/master/README.md";
      var expected = "https://raw.github.com/adamburmister/gitprint.com/master/README.md";
      urlHelper.translate(gitprintUrl).should.equal(expected);
    });

    it('should translate http://gitprint.com/adamburmister/gitprint.com/blob/feature/github-api/README.md', function(){
      var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/blob/feature/github-api/README.md";
      var expected = "https://raw.github.com/adamburmister/gitprint.com/feature/github-api/README.md";
      urlHelper.translate(gitprintUrl).should.equal(expected);
    });

    it('should translate http://gitprint.com/adamburmister/gitprint.com/master/test/examples/README.md', function(){
      var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/master/test/examples/README.md";
      var expected = "https://raw.github.com/adamburmister/gitprint.com/master/test/examples/README.md";
      urlHelper.translate(gitprintUrl).should.equal(expected);
    });
  });

})