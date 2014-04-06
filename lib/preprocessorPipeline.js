var CombinedStream = require('combined-stream');
var through = require('through');
var imgPreprocessor = require('../lib/preprocessor/relToAbsImageUrl');
var redundantLinkRemovalPreprocessor = require('../lib/preprocessor/redundantLinkRemoval');

module.exports = function(options) {
  return function() {
    var combinedStream = CombinedStream.create();

    combinedStream.append(imgPreprocessor.build(options));
    combinedStream.append(redundantLinkRemovalPreprocessor.build(options));

    return combinedStream;
  }
}