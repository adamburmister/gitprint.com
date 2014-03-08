var markdownpdf = require("markdown-pdf")
var request = require('request');

var githubUrl = 'http://www.github.com/';
var outputPath = '';

request(githubUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    markdownpdf().from.string(body).to(outputPath, function () {
		console.log("Created", outputPath);
	})
  } else {
  	console.log("Error");
  }
})