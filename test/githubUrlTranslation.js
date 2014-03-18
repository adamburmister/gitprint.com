var assert = require("assert");
var translateUrl = require("../lib/url_translation_helper");

describe('UrlTranslationHelper', function(){

  it('should translate http://gitprint.com/adamburmister/gitprint.com', function(done){
    var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com";
    var expected = "https://raw.github.com/adamburmister/gitprint.com/master/README.md";
    translateUrl(gitprintUrl).then(function(actual) {
      assert.equal(actual, expected);
    }).then(done);
  });

  it('should translate http://gitprint.com/adamburmister/gitprint.com/', function(done){
    var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/";
    var expected = "https://raw.github.com/adamburmister/gitprint.com/master/README.md";
    translateUrl(gitprintUrl).then(function(actual) {
      assert.equal(actual, expected);
    }).then(done);
  });

  it('should translate http://gitprint.com/adamburmister/gitprint.com/master/', function(done){
    var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/master/";
    var expected = "https://raw.github.com/adamburmister/gitprint.com/master/README.md";
    translateUrl(gitprintUrl).then(function(actual) {
      assert.equal(actual, expected);
    }).then(done);
  });

  it('should translate http://gitprint.com/adamburmister/gitprint.com/master/README.md', function(done){
    var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/master/README.md";
    var expected = "https://raw.github.com/adamburmister/gitprint.com/master/README.md";
    translateUrl(gitprintUrl).then(function(actual) {
      assert.equal(actual, expected);
    }).then(done);
  });

  it('should translate http://gitprint.com/adamburmister/gitprint.com/blob/master/', function(done){
    var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/blob/master/";
    var expected = "https://raw.github.com/adamburmister/gitprint.com/master/README.md";
    translateUrl(gitprintUrl).then(function(actual) {
      assert.equal(actual, expected);
    }).then(done);
  });

  it('should translate http://gitprint.com/adamburmister/gitprint.com/blob/master/README.md', function(done){
    var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/blob/master/README.md";
    var expected = "https://raw.github.com/adamburmister/gitprint.com/master/README.md";
    translateUrl(gitprintUrl).then(function(actual) {
      assert.equal(actual, expected);
    }).then(done);
  });

  it('should translate http://gitprint.com/adamburmister/gitprint.com/blob/feature/github-api/README.md', function(done){
    var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/blob/feature/github-api/README.md";
    var expected = "https://raw.github.com/adamburmister/gitprint.com/feature/github-api/README.md";
    translateUrl(gitprintUrl).then(function(actual) {
      assert.equal(actual, expected);
    }).then(done);
  });

  it('should translate http://gitprint.com/adamburmister/gitprint.com/master/test/examples/README.md', function(done){
    var gitprintUrl = "http://gitprint.com/adamburmister/gitprint.com/master/test/examples/README.md";
    var expected = "https://raw.github.com/adamburmister/gitprint.com/master/test/examples/README.md";
    translateUrl(gitprintUrl).then(function(actual) {
      assert.equal(actual, expected);
    }).then(done);
  });

})