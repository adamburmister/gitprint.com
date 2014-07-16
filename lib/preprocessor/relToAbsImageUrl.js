// Make image URLs relative to github
var _ = require('underscore');
var split = require('split');
var through = require('through');
var duplexer = require('duplexer');
var through = require("through");
var url = require('url');

var REGEX = {
  image: /!\[[^\]]+\]\([^\)]+\)/gm,
  imageParts: /!\[([^\]]+)\]\(([^\)\s]+)(\s".*")?\)/,
  imageWithAbsUrl: /!\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/,
};

/**
 * {object} options
 *   options.baseUrl relative URL for images
 */
module.exports = {
  REGEX: REGEX,
  build: function(options) {
    var _baseUrl = options.baseUrl;

    // Ensure base URL ends with a slash
    if(_baseUrl[_baseUrl.length - 1] != '/') {
      _baseUrl += '/';
    }

    return function() {
      return through(function (data) { 
        var str = data.toString();
        var mdImage, absMdImage, altText, relUrl;

        // If there are any images within this data
        var matches = str.match(REGEX.image);
        
        _.each(matches, function(m) {
          if(REGEX.imageWithAbsUrl.test(m) == false) {
            // Break apart the match into it's parts so we can rebuild it
            var parts = m.match(REGEX.imageParts);
            mdImage = parts[0];
            altText = parts[1];
            relUrl  = parts[2];
            postAltText = parts[3] || '';

            // Ensure the relative URL doesn't begin with a '/''
            if(relUrl[0] === '/') {
              relUrl = relUrl.substr(1);
            }

            // Rebuild the image reference as an absolute URL
            absMdImage = '![' + altText + '](' + url.resolve(_baseUrl, relUrl) + postAltText + ')';
            // console.log('Replacing', mdImage, absMdImage);

            str = str.replace(mdImage, absMdImage);
          }
        });
 
        this.queue(str);
      });
    }
  }
}