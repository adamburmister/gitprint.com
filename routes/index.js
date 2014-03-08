var fs = require('fs');
var markdownpdf = require('markdown-pdf')
var request = require('request');
var crypto = require('crypto');

var REGEX = {
  BlobMarkdown: /^(.*)\/blob\/master\/(.+\.(md|mdown|markdown))$/,
  TrailingSlash: /(.*)\/$/
};

/**
 Convert a github raw URL to PDF and send it to the client
 @param {string} url
 */
function convert(req, res, url) {
  // Where are we saving this file?
  var hash = crypto.createHash('md5').update(url).digest("hex");
  var outputPath = __dirname + '/../cache/' + hash + '.pdf';

  console.log(outputPath);
  console.log(url);

  var markdownOptions = {
    cssPath: __dirname + '/../public/stylesheets/print.css',
    paperBorder: '2cm',
    renderDelay: 500
  };

  var requestOptions = {
    method: 'GET',
    uri: url,
    followAllRedirects: true
  };

  request(requestOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      markdownpdf(markdownOptions).from.string(body).to(outputPath, function (data) {
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

exports.convertMarkdownToPdf = function(req, res){
  var githubPath = req.params[0];
  if(REGEX.BlobMarkdown.test(githubPath)) {
    githubPath = githubPath.replace(REGEX.BlobMarkdown, '$1/master/$2');
    console.log('Path blob', githubPath);
  } else {
    console.log('Path not blob', githubPath);
  }
  var url = 'https://raw.github.com/' + githubPath;
  convert(req, res, url);
};

exports.convertRootMarkdownToPdf = function(req, res){
  var githubPath = req.params[0].replace(REGEX.TrailingSlash, '$1'); // strip trailing slash
  var readme = 'README.md';
  // TODO: Figure out what the readme file and extension is
  var url = 'https://raw.github.com/' + githubPath + '/master/' + readme;
  convert(req, res, url);
};


/* GET home page. */
exports.index = function(req, res){
  res.render('index');
};
