var fs = require('fs');
var markdownpdf = require('markdown-pdf')
var request = require('request');
var url = require('url');

// Translate github.com to raw.github.com
// https://github.com    /echonest/pyechonest/blob/master/README.md
// https://raw.github.com/echonest/pyechonest/master/README.md
function githubRawPath(url) {
  if(/^.*\/blob\/master\/.+\.(md|mdown|markdown)$/.test(url)) {
    url = url.replace(/^(.*)\/blob\/master\/(.+\.(md|mdown|markdown))$/, '$1/master/$2\.$3');
  }
  return url;
}

/* GET users listing. */
exports.convertMarkdownToPdf = function(req, res){
  var githubPath = req.params[0];
  var githubUrl = 'https://raw.github.com/' + githubRawPath(githubPath);
  var outputPath = '/tmp/file.pdf';
  var filename = encodeURIComponent('print.pdf');

  console.log('Downloading ' + githubUrl);

  var markdownOptions = {
    cssPath: __dirname + '/../public/stylesheets/print.css',
    paperBorder: '1.5cm',
    renderDelay: 500
  };

  var requestOptions = {
    method: 'GET',
    uri: githubUrl,
    followAllRedirects: true,
    strictSSL: false
  };

  request(requestOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      markdownpdf(markdownOptions).from.string(body).to(outputPath, function (data) {
        var stream = fs.createReadStream(outputPath);
        
        res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
        res.contentType('application/pdf');
        
        stream.pipe(res);
      });
    } else {
      res.send(500, 'Something went wrong! ' + githubUrl);
    }
  });
};

/* GET home page. */
exports.index = function(req, res){
  res.render('index');
};
