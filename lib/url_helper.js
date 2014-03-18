var url = require('url');
var Q = require('q');
var request = require('request');

// Constants

var USER_AGENT = 'gitprint.com';
var DEFAULT_MARKDOWN_FILENAME = 'README.md';
var RAW_GITHUB_BASE_URL = 'https://raw.github.com/';
var REGEX = {
  Gist: /^\/([0-9A-Za-z-]+\/[0-9a-f]+)\/raw\//,
  RepoMarkdownFile: /^\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+\.(md|mdown|markdown))$/,
  RepoIndex: /^\/(([^\/]+)\/([^\/]+)\/?(.*\/?))$/,
  TrailingSlash: /\/$/,
};

// Methods

/**
 * @return {promise}
 */
function _translateGistMarkdownUrl(gitprintPath, deferred) {
  // TODO
}

/**
 * @return {promise}
 */
function _translateRepoMarkdownIndexFileUrl(gitprintPath, deferred) {
  var params = gitprintPath.match(REGEX.RepoIndex);
  var githubPath = params[2] + '/' + params[3];
  var githubTree = (params[4] || '').replace('blob/',''); // strip out blob

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

    var readmeFilename = body["path"] || DEFAULT_MARKDOWN_FILENAME;
    var url;

    if(githubTree === '') {
      // /user/repo/
      url = RAW_GITHUB_BASE_URL + githubPath + '/master/' + readmeFilename;
    } else {
      // /user/repo/subpath/
      url = RAW_GITHUB_BASE_URL + githubPath + '/' + githubTree + readmeFilename;
    }

    deferred.resolve(url);
  });

  return deferred.promise;
}

/**
 * @return {string}
 */
function _translateRepoMarkdownFileUrl(gitprintPath) {
  var params = gitprintPath.match(REGEX.RepoMarkdownFile);
  var githubPath;

  if(params[3] === 'blob') {
    githubPath = params[1] + '/' + params[2] + '/' + params[4];
  } else {
    githubPath = params[1] + '/' + params[2] + '/' + params[3] + '/' + params[4];
  }

  var url = RAW_GITHUB_BASE_URL + githubPath;
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

exports.translate = function(gitprintUrl){ 
  var deferred = Q.defer();
  var path = url.parse(gitprintUrl).path;
  var valueOrPromise;

  if(_isGist(path)) {
    valueOrPromise = _translateGistMarkdownUrl(path, deferred);
  } 
  else if(_isRepoFile(path)) {
    valueOrPromise = _translateRepoMarkdownFileUrl(path);
  }
  else if(_isRepoIndex(path)) {
    valueOrPromise = _translateRepoMarkdownIndexFileUrl(path, deferred);
  } else {
    throw 'Unrecognised GitHub URL';  
  }
  
  return valueOrPromise;
}

exports.isGist = _isGist;
exports.isRepoFile = _isRepoFile;
exports.isRepoIndex =  _isRepoIndex;
exports.translateRepoFile = _translateRepoMarkdownFileUrl;
exports.translateRepoIndex = _translateRepoMarkdownIndexFileUrl;
exports.translateGist = _translateGistMarkdownUrl;
exports.REGEX = REGEX;