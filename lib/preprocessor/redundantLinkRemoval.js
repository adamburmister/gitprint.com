var split = require('split');
var through = require('through');
var duplexer = require('duplexer');

var REGEX = {
  anchors: {
    redundant: /\[(https?:\/\/.*)\]\(\1\)/g,
  }
};

/**
 * Remove redundant links from the markdown.
 * A redundant link is one that uses the URL for the link text.
 * 
 *     "[http://google.com](http://google.com)"
 *  ... becomes
 *     "http://google.com"
 *
 * {object} options
 */
module.exports = {
  REGEX: REGEX,
  build: function(options) {
    return function() {
      return through(function (data) {
        this.queue( data.replace(REGEX.anchors.redundant, '$1') );
      });
    }
  }
}