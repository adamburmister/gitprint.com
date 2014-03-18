var url = require('url');
var Q = require('q');
var request = require('request');

var USER_AGENT = 'gitprint.com';
var REGEX = {
  Gist: /^\/([0-9A-Za-z-]+\/[0-9a-f]+)\/raw\//,
  RepoMarkdown: /^(.+)\/(.+)\/(.+)\/(.+\.(md|mdown|markdown))$/,
  RepoIndex: /^\/(.+\/.+\/?)$/,
  TrailingSlash: /(.+)\/+$/,
};

/**
 */
function _translateRepoIndexUrl(gitprintPath, deferred) {
  var params = gitprintPath.match(REGEX.RepoIndex);
  var githubPath = gitprintPath.replace(REGEX.TrailingSlash, '$1'); // strip trailing slash

  var requestOptions = {
    url: 'https://api.github.com/repos/' + githubPath + '/readme',
    json: true,
    headers: { 'User-Agent': USER_AGENT }
  };

  // Ask Github what README file to use
  request(requestOptions, function(error, response, body) {
    var readmeFilename = body["path"] || 'README.md';
    var url = 'https://raw.github.com/' + githubPath + '/master/' + readmeFilename;
    deferred.resolve(url);
  });

  return deferred.promise;
}

/**
 */
function _translateRepoMarkdownUrl(gitprintPath, deferred) {
  var params = gitprintPath.match(REGEX.RepoMarkdown);
  var githubPath;

  if(params[1] === 'blob') {
    githubPath = params[0] + '/' + params[2] + '/' + params[3];
  } else {
    githubPath = params[0] + '/' + params[1] + '/' + params[2] + '/' + params[3];
  }

  var url = 'https://raw.github.com' + githubPath;
  deferred.resolve(url);

  return deferred.promise;
}

module.exports = function(gitprintUrl){ 
  var deferred = Q.defer();
  var path = url.parse(gitprintUrl).path;

  if(REGEX.Gist.test(path)) {
    return _translateGistMarkdownUrl(path, deferred);
  } 
  else if(REGEX.RepoMarkdown.test(path)) {
    return _translateRepoMarkdownUrl(path, deferred);
  }
  else if(REGEX.RepoIndex.test(path)) {
    return _translateRepoIndexUrl(path, deferred);
  }
  
  throw 'Unrecognised GitHub URL';
}