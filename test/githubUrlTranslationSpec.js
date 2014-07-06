var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var assert = chai.assert;
var should = chai.should();
var urlHelper = require("../lib/url_helper");
var Q = require('q');
var request = require('request');

chai.use(chaiAsPromised);

function verifyGithubUrlValid(url, success) {
  var requestOptions = {
    method: 'HEAD',
    uri: url,
    followAllRedirects: true
  };

  // Do a cheaper HEAD request first to see if we already have a pre-rendered PDF on disk cache
  request(requestOptions, function (error, response, body) {
    if (response.statusCode != 200) {
      console.error("The URL " + url + " no longer exists on Github. They may have changed the URL structure on us!");
    }
    success();
  });
}

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
      it('should translate http://gitprint.com/adamburmister/gitprint.com', function(done) {
        var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md";
        verifyGithubUrlValid(expected, function() {
          Q.all([
            urlHelper.translate(gitprintUrl).should.eventually.equal(expected)
          ]).should.notify(done)  
        });
      });


      it('should translate http://gitprint.com/dspinellis/unix-history-repo', function(done) {
        var gitprintUrl = "http://gitprint.com/dspinellis/unix-history-repo";
        var expected = "https://raw.githubusercontent.com/dspinellis/unix-history-repo/master/README.md";
        verifyGithubUrlValid(expected, function() {
          Q.all([
            urlHelper.translate(gitprintUrl).should.eventually.equal(expected)
          ]).should.notify(done)  
        });
      });

      it('should translate http://gitprint.com/adamburmister/gitprint.com/', function(done){
        var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md";
        verifyGithubUrlValid(expected, function() {
          Q.all([
            urlHelper.translate(gitprintUrl).should.eventually.equal(expected)
          ]).should.notify(done)
        });
      });

      it('should translate http://gitprint.com/adamburmister/gitprint.com/master/', function(done){
        var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/master/";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md";
        verifyGithubUrlValid(expected, function() {
          Q.all([
            urlHelper.translate(gitprintUrl).should.eventually.equal(expected)
          ]).should.notify(done)
        });
      });

      it('should translate http://gitprint.com/adamburmister/gitprint.com/blob/master/', function(done){
        var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/blob/master/";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md";
        verifyGithubUrlValid(expected, function() {
          Q.all([
            urlHelper.translate(gitprintUrl).should.eventually.equal(expected)
          ]).should.notify(done)
        });
      });

      it('should translate https://gitprint.com/adamburmister/gitprint.com/tree/master/test/examples', function(done){
        var gitprintUrl = "https://gitprint.com/adamburmister/gitprint.com/tree/master/test/examples";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/test/examples/README.md";
        verifyGithubUrlValid(expected, function() {
          Q.all([
            urlHelper.translate(gitprintUrl).should.eventually.equal(expected)
          ]).should.notify(done)
        });
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
      it('should translate http://gitprint.com/adamburmister/gitprint.com/master/README.md', function(){
        var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/master/README.md";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md";
        verifyGithubUrlValid(expected, function() {
          urlHelper.translate(gitprintUrl).should.equal(expected);
        });
      });

      it('should translate http://gitprint.com/adamburmister/gitprint.com/blob/master/README.md', function(){
        var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/blob/master/README.md";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/README.md";
        verifyGithubUrlValid(expected, function() {
          urlHelper.translate(gitprintUrl).should.equal(expected);  
        });
      });

      it('should translate http://gitprint.com/adamburmister/gitprint.com/blob/feature/github-api/README.md', function(){
        var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/blob/feature/github-api/README.md";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/feature/github-api/README.md";
        verifyGithubUrlValid(expected, function() {
          urlHelper.translate(gitprintUrl).should.equal(expected);
        });
      });

      it('should translate http://gitprint.com/adamburmister/gitprint.com/master/test/examples/README.md', function(){
        var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/master/test/examples/README.md";
        var expected = "https://raw.githubusercontent.com/adamburmister/gitprint.com/master/test/examples/README.md";
        verifyGithubUrlValid(expected, function() {
          urlHelper.translate(gitprintUrl).should.equal(expected);
        });
      });

    });

    describe('wiki file', function() {
      describe('indexes', function() {
        it('should translate https://gitprint.com/adamburmister/gitprint.com/wiki', function () {
          var gitprintUrl = 'https://gitprint.com/adamburmister/gitprint.com/wiki';
          var expected = 'https://raw.githubusercontent.com/wiki/adamburmister/gitprint.com/home.md'
          verifyGithubUrlValid(expected, function() {
            urlHelper.translate(gitprintUrl).should.equal(expected);
          });
        });

        it('should translate https://gitprint.com/adamburmister/gitprint.com/wiki/', function () {
          var gitprintUrl = 'https://gitprint.com/adamburmister/gitprint.com/wiki/';
          var expected = 'https://raw.githubusercontent.com/wiki/adamburmister/gitprint.com/home.md'
          verifyGithubUrlValid(expected, function() {
            urlHelper.translate(gitprintUrl).should.equal(expected);
          });
        });
      });

      it('should translate https://gitprint.com/adamburmister/gitprint.com/wiki/Contribute', function () {
        var gitprintUrl = 'https://gitprint.com/adamburmister/gitprint.com/wiki/Contribute';
        var expected = 'https://raw.githubusercontent.com/wiki/adamburmister/gitprint.com/Contribute.md'
        verifyGithubUrlValid(expected, function() {
          urlHelper.translate(gitprintUrl).should.equal(expected);
        });
      });
    });

  });

})