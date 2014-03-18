var url = require('url');
var Q = require('q');
var request = require('request');

var USER_AGENT = 'gitprint.com';
var REGEX = {
  Gist: /^\/([0-9A-Za-z-]+\/[0-9a-f]+)\/raw\//,
  RepoMarkdownFile: /^\/(.+)\/(.+)\/(.+)\/(.+\.(md|mdown|markdown))$/,
  RepoIndex: /^\/(.+\/.+\/?)$/,
  LeadingAndTrailingSlash: /^\/(.+)\/+$/,
};

/**
 * @return {promise}
 */
function _translateGistMarkdownUrl(gitprintPath, deferred) {

}

/**
 * @return {promise}
 */
function _translateRepoMarkdownIndexUrlFile(gitprintPath, deferred) {
  var params = gitprintPath.match(REGEX.RepoIndex);
  var githubPath = gitprintPath.replace(REGEX.LeadingAndTrailingSlash, '$1'); // strip trailing slash

  var requestOptions = {
    url: 'https://api.github.com/repos/' + githubPath + '/readme',
    json: true,
    headers: { 'User-Agent': USER_AGENT }
  };

  // Ask Github what README file to use
  request(requestOptions, function(error, response, body) {
    if(error) {
      deferred.reject(error);
    }

    var readmeFilename = body["path"] || 'README.md';
    var url = 'https://raw.github.com/' + githubPath + '/master/' + readmeFilename;
    deferred.resolve(url);
  });

  return deferred.promise;
}

/**
 * @return {string}
 */
function _translateRepoMarkdownFileUrlFile(gitprintPath) {
  var params = gitprintPath.match(REGEX.RepoMarkdownFile);
  var githubPath;

  if(params[1] === 'blob') {
    githubPath = params[0] + '/' + params[2] + '/' + params[3];
  } else {
    githubPath = params[0] + '/' + params[1] + '/' + params[2] + '/' + params[3];
  }

  var url = 'https://raw.github.com/' + githubPath;
  return url
}

function _isRepoIndex(path) {
  return REGEX.RepoIndex.test(path);
}

function _isRepoFile(path) {
  return REGEX.RepoMarkdownFile.test(path);
}

function _isGist(path) {
  return REGEX.Gist.test(path);
}

exports.isGist = _isGist;
exports.isRepoFile = _isRepoFile;
exports.isRepoIndex =  _isRepoIndex;

exports.translate = function(gitprintUrl){ 
  var deferred = Q.defer();
  var path = url.parse(gitprintUrl).path;
  var valueOrPromise;
  if(_isGist(path)) {
    valueOrPromise = _translateGistMarkdownUrl(path, deferred);
  } 
  else if(_isRepoFile(path)) {
    valueOrPromise = _translateRepoMarkdownFileUrlFile(path);
  }
  else if(_isRepoIndex(path)) {
    valueOrPromise = _translateRepoMarkdownIndexUrlFile(path, deferred);
  } else {
    throw 'Unrecognised GitHub URL';  
  }
  
  return valueOrPromise;
}