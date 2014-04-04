var split = require('split');
var through = require('through');
var duplexer = require('duplexer');

var REGEX = {
  anchors: {
    withoutUrl: /\[\[([^\|]+)\]\]/g,
    withUrl: /\[\[(.+)\|(.+)\]\]/g,
  }
};

/**
 * {object} options
 *   options.baseUrl relative URL for wiki documents
 */
module.exports = {
  REGEX: REGEX,
  build: function(options) {
    return function() {
      // Split the input stream by lines
      var splitter = split();

      var anchorReplacer = through(function (data) {
        data = data.replace(REGEX.anchors.withoutUrl, '$1');
        data = data.replace(REGEX.anchors.withUrl, '$1');
        this.queue(data + '\n');
      });

      splitter.pipe(anchorReplacer);

      return duplexer(splitter, anchorReplacer);
    }
  }
}