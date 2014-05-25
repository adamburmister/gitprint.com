var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var assert = chai.assert;
var should = chai.should();
var urlHelper = require("../lib/url_helper");
var Q = require('q');

chai.use(chaiAsPromised);

describe('UrlHelper', function(){
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

    describe('#isWiki', function() {
      describe('indexes', function() {
        it('flags /adamburmister/gitprint.com/wiki as a wiki file', function() {
          var path = "/adamburmister/gitprint.com/wiki";
          urlHelper.isWikiFile(path).should.equal(true);
        });

        it('flags /adamburmister/gitprint.com/wiki/ as a wiki file', function() {
          var path = "/adamburmister/gitprint.com/wiki/";
          urlHelper.isWikiFile(path).should.equal(true);
        });

        it('flags /adamburmister/gitprint.com/wiki/Contribute as a wiki file', function() {
          var path = "/adamburmister/gitprint.com/wiki/Contribute";
          urlHelper.isWikiFile(path).should.equal(true);
        });

        it('flags /adamburmister/gitprint.com/wiki/Contribute/ as a wiki file', function() {
          var path = "/adamburmister/gitprint.com/wiki/Contribute/";
          urlHelper.isWikiFile(path).should.equal(true);
        });
      });

      describe('revisions', function () {
        it('flags /adamburmister/gitprint.com/wiki/Contribute/b8404dfc027a06ec82276dd31188e6c85c87487b as a wiki file', function() {
          var path = "/adamburmister/gitprint.com/wiki/Contribute/b8404dfc027a06ec82276dd31188e6c85c87487b";
          urlHelper.isWikiFile(path).should.equal(true);
        });
      })
      
    });
  });

  describe('translate', function () {
    describe('repo index', function () {
      it('should translate https://gitprint.com/adamburmister/gitprint.com', function(done) {
        var gitprintUrl = "https://gitprint.com/adamburmister/gitprint.com";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md";
        Q.all([
          urlHelper.translate(gitprintUrl).should.eventually.equal(expected)
        ]).should.notify(done)
      });

      it('should translate https://gitprint.com/adamburmister/gitprint.com/', function(done){
        var gitprintUrl = "https://gitprint.com/adamburmister/gitprint.com/";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md";
        Q.all([
          urlHelper.translate(gitprintUrl).should.eventually.equal(expected)
        ]).should.notify(done)
      });

      it('should translate https://gitprint.com/adamburmister/gitprint.com/master/', function(done){
        var gitprintUrl = "https://gitprint.com/adamburmister/gitprint.com/master/";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md";
        Q.all([
          urlHelper.translate(gitprintUrl).should.eventually.equal(expected)
        ]).should.notify(done)
      });

      it('should translate https://gitprint.com/adamburmister/gitprint.com/blob/master/', function(done){
        var gitprintUrl = "https://gitprint.com/adamburmister/gitprint.com/blob/master/";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md";
        Q.all([
          urlHelper.translate(gitprintUrl).should.eventually.equal(expected)
        ]).should.notify(done)
      });

      it('should translate https://gitprint.com/adamburmister/gitprint.com/tree/master/examples', function(done){
        var gitprintUrl = "https://gitprint.com/adamburmister/gitprint.com/tree/master/examples";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/examples/README.md";
        Q.all([
          urlHelper.translate(gitprintUrl).should.eventually.equal(expected)
        ]).should.notify(done)
      });

      it('should translate https://gitprint.com/adamburmister/gitprint.com/tree/develop/', function(done){
        var gitprintUrl = "https://gitprint.com/adamburmister/gitprint.com/tree/develop";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/develop/README.md";
        Q.all([
          urlHelper.translate(gitprintUrl).should.eventually.equal(expected)
        ]).should.notify(done)
      });

      it('should translate https://gitprint.com/adamburmister/gitprint.com/blob/master/test/examples/README.md', function(){
        var gitprintUrl =              "https://gitprint.com/adamburmister/gitprint.com/blob/master/test/examples/README.md";
        var expected =    "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/test/examples/README.md";
        urlHelper.translate(gitprintUrl).should.equal(expected);
      });
    });

    describe('repo file', function () {
      it('should translate https://gitprint.com/adamburmister/gitprint.com/master/README.md', function(){
        var gitprintUrl = "https://gitprint.com/adamburmister/gitprint.com/master/README.md";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md";
        urlHelper.translate(gitprintUrl).should.equal(expected);
      });

      it('should translate https://gitprint.com/adamburmister/gitprint.com/blob/master/README.md', function(){
        var gitprintUrl = "https://gitprint.com/adamburmister/gitprint.com/blob/master/README.md";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md";
        urlHelper.translate(gitprintUrl).should.equal(expected);
      });

      it('should translate https://gitprint.com/adamburmister/gitprint.com/blob/feature/github-api/README.md', function(){
        var gitprintUrl = "https://gitprint.com/adamburmister/gitprint.com/blob/feature/github-api/README.md";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/feature/github-api/README.md";
        urlHelper.translate(gitprintUrl).should.equal(expected);
      });

      it('should translate https://gitprint.com/adamburmister/gitprint.com/master/test/examples/README.md', function(){
        var gitprintUrl = "https://gitprint.com/adamburmister/gitprint.com/master/test/examples/README.md";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/test/examples/README.md";
        urlHelper.translate(gitprintUrl).should.equal(expected);
      });

    });

    describe('wiki file', function() {
      describe('indexes', function() {
        it('should translate https://gitprint.com/adamburmister/gitprint.com/wiki', function () {
          var gitprintUrl = 'https://gitprint.com/adamburmister/gitprint.com/wiki';
          var expected = 'https://raw.githubusercontent.com/wiki/adamburmister/gitprint.com/home.md'
          urlHelper.translate(gitprintUrl).should.equal(expected);
        });

        it('should translate https://gitprint.com/adamburmister/gitprint.com/wiki/', function () {
          var gitprintUrl = 'https://gitprint.com/adamburmister/gitprint.com/wiki/';
          var expected = 'https://raw.githubusercontent.com/wiki/adamburmister/gitprint.com/home.md'
          urlHelper.translate(gitprintUrl).should.equal(expected);
        });
      });

      it('should translate https://gitprint.com/adamburmister/gitprint.com/wiki/Contribute', function () {
        var gitprintUrl = 'https://gitprint.com/adamburmister/gitprint.com/wiki/Contribute';
        var expected = 'https://raw.githubusercontent.com/wiki/adamburmister/gitprint.com/Contribute.md'
        urlHelper.translate(gitprintUrl).should.equal(expected);
      });
    });

  });

})