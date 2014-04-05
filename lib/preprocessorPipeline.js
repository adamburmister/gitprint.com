var CombinedStream = require('combined-stream');

var imgPreprocessor = require('../lib/preprocessor/relToAbsImageUrl');
var redundantLinkRemovalPreprocessor = require('../lib/preprocessor/redundantLinkRemoval');

module.exports = function(options) {
  var combinedStream = CombinedStream.create();

  combinedStream.append(imgPreprocessor.build(options));
  combinedStream.append(redundantLinkRemovalPreprocessor.build(options));

  return through(combinedStream.pipe);
}