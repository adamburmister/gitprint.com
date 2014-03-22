var url = require('url');
var Q = require('q');
var request = require('request');

// Constants

var USER_AGENT = 'gitprint.com';
var DEFAULT_MARKDOWN_FILENAME = 'README.md';
var DEFAULT_WIKI_INDEX_FILENAME = 'home';
var RAW_GITHUB_BASE_URL = 'https://raw.github.com/';
var REGEX = {
  Gist: /^\/([0-9A-Za-z-]+\/[0-9a-f]+)\/raw\//,
  RepoMarkdownFile: /^\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+\.(md|mdown|markdown))$/,
  RepoIndex: /^\/(([^\/]+)\/([^\/]+)\/?(.*\/?))$/,
  WikiFile: /^\/(([^\/]+)\/([^\/]+)\/wiki\/?(.*\/?))$/,
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
 * Translate a Wiki URL to a raw markdown URL
 * @param {string} URL Wiki path
 */
function _translateWikiMarkdownFileUrl(gitprintPath) {
  var params = gitprintPath.match(REGEX.WikiFile);
  var filename = (params[4] || DEFAULT_WIKI_INDEX_FILENAME) + '.md';
  var githubPath = 'wiki/' + params[2] + '/' + params[3] + '/' + filename;
  var url = RAW_GITHUB_BASE_URL + githubPath;
  return url
}

/**
 * @return {promise}
 */
function _translateRepoMarkdownIndexFileUrl(gitprintPath, deferred) {
  var params = gitprintPath.match(REGEX.RepoIndex);
  var githubPath = params[2] + '/' + params[3];
  var githubTree = (params[4] || '').replace('blob/','').replace(REGEX.TrailingSlash, ''); // strip out blob and trailing slash

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

    if(githubTree === '') {
      githubTree = 'master';
    }

    var readmeFilename = body["path"] || DEFAULT_MARKDOWN_FILENAME;
    var url = RAW_GITHUB_BASE_URL + githubPath + '/' + githubTree + '/' + readmeFilename;

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

function _isWikiFile(path) {
  return REGEX.WikiFile.test(path);
}

exports.translate = function(gitprintUrl){ 
  var deferred = Q.defer();
  var path = url.parse(gitprintUrl).path;
  var valueOrPromise;

  if(_isGist(path)) {
    valueOrPromise = _translateGistMarkdownUrl(path, deferred);
  } 
  else if(_isWikiFile(path)) {
    valueOrPromise = _translateWikiMarkdownFileUrl(path);
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
exports.isWikiFile = _isWikiFile;
exports.translateRepoFile = _translateRepoMarkdownFileUrl;
exports.translateRepoIndex = _translateRepoMarkdownIndexFileUrl;
exports.translateGist = _translateGistMarkdownUrl;
exports.REGEX = REGEX;