var request = require('request');
var credentials = require('./secrets.js');
let githubToken = credentials.GITHUB_TOKEN;
console.log('cred', credentials.GITHUB_TOKEN);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url:  "https://api.github.com/repos/" + repoOwner + "/" + repoName + 
      "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': githubToken 
    }
  };

  request(options, function(err, res, body) {
    console.log(body);
    if (!err && res.statusCode == 200) {
      let data = JSON.parse(body);
      cb(err, data);
    } else {
      cb(err, body);
    }
  }); 

}

getRepoContributors("lighthouse-labs", "laser_shark", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
  result.forEach((element) => {
    console.log(element.avatar_url);
  });
});
