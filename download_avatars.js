var request = require('request');
var credentials = require('./secrets.js');
let github_token = credentials.GITHUB_TOKEN;
console.log('cred', credentials.GITHUB_TOKEN);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url:  "https://api.github.com/repos/" + repoOwner + "/" + repoName + 
      "/contributors",
    headers: {
      'User-Agent': 'request'
    },
    Authorization: github_token 
  };

  request(options, function(err, res, body) {
    cb(err, body);
  }); 

}

getRepoContributors("jquery", "jquery", function(err, result) {
    console.log("Errors:", err);
    console.log("Result:", result);
});
