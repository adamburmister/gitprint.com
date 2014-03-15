var fs = require('fs');
var markdownpdf = require('markdown-pdf')
var request = require('request');
var crypto = require('crypto');

// How long to wait for the view to render
var WAIT_FOR_RENDER_DELAY = 1500;
var MAX_FILENAME_LEN = 60;

var REGEX = {
  BlobMarkdown: /^(.*)\/blob\/master\/(.+\.(md|mdown|markdown))$/,
  TrailingSlash: /(.*)\/$/,
};

var MARKDOWN_OPTIONS = {
  cssPath: __dirname + '/../public/css/print.css',
  paperBorder: '1cm',
  renderDelay: WAIT_FOR_RENDER_DELAY,
  runningsPath: __dirname + '/../lib/runnings.js',
};

var DISPOSITION = {
  INLINE: 'inline',
  ATTACHMENT: 'attachment',
}
var DEFAULT_DISPOSITION = DISPOSITION.INLINE;

/**
 * Convert a github raw URL to PDF and send it to the client
 * @param {string} url
 * @param {string} disposition ('inline' | 'attachment')
 */
function convert(req, res, url, disposition) {
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
        var pdfFilename = 'gitprint__' + (req.params[0].replace(/[^a-zA-Z0-9-_\.]/gi,'-')).substr(0, MAX_FILENAME_LEN) + '.pdf';
        var headerContentDisposition = (disposition || DEFAULT_DISPOSITION) + '; filename="' + pdfFilename + '"';
        
        res.setHeader('Content-disposition', headerContentDisposition);
        res.contentType('application/pdf');

        if (exists) {
          // We have a copy already! Just send that
          console.log('Serving PDF from cache, ' + outputPath);
          fs.createReadStream(outputPath).pipe(res);
        } else {
          // We don't have a prerendered PDF, so download and render one
          // Upgrade to a full GET request...
          requestOptions.method = 'GET';
          request(requestOptions, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              markdownpdf(MARKDOWN_OPTIONS).from.string(body).to(outputPath, function (data) {
                var stream = fs.createReadStream(outputPath);                
                stream.pipe(res);
              });
            } else {
              res.contentType('text/html');
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

  if(Object.keys(req.query).indexOf('download') !== -1) {
    convert(req, res, url, DISPOSITION.ATTACHMENT);
  } else if(Object.keys(req.query).indexOf('inline') !== -1) {
    convert(req, res, url, DISPOSITION.INLINE);
  } else {
    res.render('printView', { pageTitle: githubPath });
  }
};

exports.convertRootMarkdownToPdf = function(req, res){
  var githubPath = req.params[0].replace(REGEX.TrailingSlash, '$1'); // strip trailing slash
  if(Object.keys(req.query).indexOf('download') !== -1 || Object.keys(req.query).indexOf('inline') !== -1) {
    var requestOptions = {
      url: 'https://api.github.com/repos/' + githubPath + '/readme',
      json:true,
      headers: { 'User-Agent': 'gitprint.com' }
    };
    var disposition = DISPOSITION.INLINE;
    if(Object.keys(req.query).indexOf('download') !== -1) {
      disposition = DISPOSITION.ATTACHMENT;
    }

    // Ask Github what README file to use
    request(requestOptions, function(error, response, body) {
      var readmeFilename = body["path"] || 'README.md';
      var url = 'https://raw.github.com/' + githubPath + '/master/' + readmeFilename;
      convert(req, res, url, disposition);
    });
  } else {
    res.render('printView', { pageTitle: githubPath });
  }
};

/* GET home page. */
exports.index = function(req, res){
  res.render('index');
};
