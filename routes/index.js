var fs = require('fs');
var markdownpdf = require('markdown-pdf')
var request = require('request');
var crypto = require('crypto');

// How long to wait for the view to render
var WAIT_FOR_RENDER_DELAY = 1500;

var REGEX = {
  BlobMarkdown: /^(.*)\/blob\/master\/(.+\.(md|mdown|markdown))$/,
  TrailingSlash: /(.*)\/$/
};

var MARKDOWN_OPTIONS = {
  cssPath: __dirname + '/../public/stylesheets/print.css',
  paperBorder: '2cm',
  renderDelay: WAIT_FOR_RENDER_DELAY
};

/**
 Convert a github raw URL to PDF and send it to the client
 @param {string} url
 */
function convert(req, res, url) {
  var requestOptions = {
    method: 'HEAD',
    uri: url,
    followAllRedirects: true
  };

  // Do a cheaper HEAD request first to see if we already have a pre-rendered PDF on disk cache
  request(requestOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // The HEAD request worked, no check the cache for a PDF

      // Where are we saving this file?
      var hash = crypto.createHash('md5').update(url).digest("hex"); // fingerprint path
      var etag = (response.headers.etag || 'no_etag').replace(/"/g,''); // get the etag (stripping quotes)
      var outputPath = __dirname + '/../cache/' + hash + '-' + etag + '.pdf';

      fs.exists(outputPath, function(exists) {
        if (exists) {
          // We have a copy already! Just send that
          console.log('Serving PDF from cache, ' + outputPath);
          fs.createReadStream(outputPath).pipe(res);
        } else {
          // We don't have a prerendered PDF, so download and render one

          // Upgrade to a full GET request
          requestOptions.method = 'GET';
          request(requestOptions, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              markdownpdf(MARKDOWN_OPTIONS).from.string(body).to(outputPath, function (data) {
                var stream = fs.createReadStream(outputPath);
                
                res.setHeader('Content-disposition', 'inline; filename="github-print.pdf"');
                res.contentType('application/pdf');
                
                stream.pipe(res);
              });
            } else {
              res.send(500, 'Something went wrong! Couldn\'t process ' + url);
            }
          });

        }
      });

    } else {
      // The HEAD failed
      res.send(500, 'Something went wrong! Couldn\'t process ' + url); 
    }

  });
}

exports.convertMarkdownToPdf = function(req, res){
  var githubPath = req.params[0].replace(REGEX.BlobMarkdown, '$1/master/$2')
  var url = 'https://raw.github.com/' + githubPath;
  convert(req, res, url);
};

exports.convertRootMarkdownToPdf = function(req, res){
  var githubPath = req.params[0].replace(REGEX.TrailingSlash, '$1'); // strip trailing slash
  var readme = 'README.md';
  // TODO: Figure out what the readme file and extension is by inspecting the repo somehow (DOM?)
  var url = 'https://raw.github.com/' + githubPath + '/master/' + readme;
  convert(req, res, url);
};


/* GET home page. */
exports.index = function(req, res){
  res.render('index');
};
