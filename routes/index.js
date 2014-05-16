var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var markdownpdf = require('markdown-pdf')
var request = require('request');
var crypto = require('crypto');
var Q = require('q');
var urlHelper = require('../lib/url_helper');

/* Preprocessors */
var imgPreprocessor = require('../lib/preprocessor/relToAbsImageUrl');
var redundantLinkRemovalPreprocessor = require('../lib/preprocessor/redundantLinkRemoval');

/* --- CONSTANTS --- */

// How long to wait for the view to render
var WAIT_FOR_RENDER_DELAY = 1500;
var MAX_FILENAME_LEN = 60;

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

/* ---- METHODS --- */


/**
 * Convert a github raw URL to PDF and send it to the client
 * @param {object} request
 * @param {object} response
 * @param {string} url
 * @param {string} disposition ('inline' | 'attachment')
 * @param {function} pre-process markdown
 * @param {function} pre-process html
 */
function convert(req, res, url, disposition, preProcessMd, preProcessHtml) {
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
      var hash = crypto.createHash('md5').update(url).digest('hex'); // fingerprint path
      var etag = (response.headers.etag || 'no_etag').replace(/"/g,''); // get the etag (stripping quotes)
      var outputPath = __dirname + '/../cache/' + hash + '-' + etag + '.pdf';

      fs.exists(outputPath, function(exists) {
        var pdfFilename = 'gitprint__' + (req.path.replace(/[^a-zA-Z0-9-_\.]/gi,'-')).substr(0, MAX_FILENAME_LEN) + '.pdf';
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
              var options = _.extend({}, MARKDOWN_OPTIONS);
              // Extend md options with any processors
              if(preProcessMd) {
                options.preProcessMd = preProcessMd;
              }
              if(preProcessHtml) {
                options.preProcessHtml = preProcessHtml;
              }

              markdownpdf(options).from.string(body).to(outputPath, function (data) {
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

/**
 * @param {object} url
 * @return the base URL for relative paths used within a Markdown file
 */
function _getBaseUrl(url) {
  var parsedUrl = require('url').parse(url);
  var baseUrlDir = path.dirname(parsedUrl.path);
  var baseUrl = parsedUrl.protocol + '//' + parsedUrl.host + baseUrlDir;
  return baseUrl;
}

/**
 * @return {function} Markdown pre-processor
 */
function _getMarkdownPreProcessors(url) {
  var opts = { baseUrl: _getBaseUrl(url) };
  var pproc = imgPreprocessor.build(opts);
  // TODO: Figure out how to add on the wiki markup processor and make this a pipeline
  return pproc;
}

exports.convertGistMarkdownToPdf = function(req, res) {
    var githubPath = req.path,
        url = urlHelper.translate(githubPath),
        qsParamKeys = Object.keys(req.query),
        autoPrint = (qsParamKeys.indexOf('print') !== -1);

  if(Object.keys(req.query).indexOf('download') !== -1) {
    convert(req, res, url, DISPOSITION.ATTACHMENT);
  } else if(Object.keys(req.query).indexOf('inline') !== -1) {
    convert(req, res, url, DISPOSITION.INLINE);
  } else {
    res.render('printView', { pageTitle: githubPath, autoPrint: autoPrint });
  }
};

exports.convertWikiMarkdownToPdf = function(req, res){
  var githubPath = req.path;
  var url = urlHelper.translate(githubPath);
  var qsParamKeys = Object.keys(req.query);
  var autoPrint = (qsParamKeys.indexOf('print') !== -1);

  if(qsParamKeys.indexOf('download') !== -1) {
    convert(req, res, url, DISPOSITION.ATTACHMENT, _getMarkdownPreProcessors(url));
  } else if(qsParamKeys.indexOf('inline') !== -1) {
    convert(req, res, url, DISPOSITION.INLINE, _getMarkdownPreProcessors(url));
  } else {
    res.render('printView', { pageTitle: githubPath, autoPrint: autoPrint });
  }
};


exports.convertMarkdownToPdf = function(req, res){
  var githubPath = req.path;
  var url = urlHelper.translate(githubPath);
  var qsParamKeys = Object.keys(req.query);
  var autoPrint = (qsParamKeys.indexOf('print') !== -1);

  if(qsParamKeys.indexOf('download') !== -1) {
    convert(req, res, url, DISPOSITION.ATTACHMENT, _getMarkdownPreProcessors(url));
  } else if(qsParamKeys.indexOf('inline') !== -1) {
    convert(req, res, url, DISPOSITION.INLINE, _getMarkdownPreProcessors(url));
  } else {
    res.render('printView', { pageTitle: githubPath, autoPrint: autoPrint });
  }
};

exports.convertReadmeMarkdownToPdf = function(req, res){
  var githubPath = req.path;
  var url;
  var disposition = DISPOSITION.INLINE;
  var qsParamKeys = Object.keys(req.query);
  var autoPrint = (qsParamKeys.indexOf('print') !== -1);

  if(qsParamKeys.indexOf('download') !== -1 || qsParamKeys.indexOf('inline') !== -1) {
    if(qsParamKeys.indexOf('download') !== -1) {
      disposition = DISPOSITION.ATTACHMENT;
    }
    Q.when(urlHelper.translate(githubPath)).then(function(url) {
      convert(req, res, url, disposition, _getMarkdownPreProcessors(url));
    });
  } else {
    res.render('printView', { pageTitle: githubPath, autoPrint: autoPrint });
  }
};

/* GET home page. */
exports.index = function(req, res){
  res.render('index');
};
