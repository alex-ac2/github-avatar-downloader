var request = require('request');
var credentials = require('./secrets.js');
var fs = require('fs');

let githubToken = credentials.GITHUB_TOKEN;



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

  request.get(options, function(err, res, body) {
    // console.log(body);
    if (!err && res.statusCode == 200) {
      let data = JSON.parse(body);
      cb(err, data);
    } else {
      cb(err, body);
    }
  }); 
}

function downloadImageByURL(url, filePath) {
  request.get(url, filePath) 
    .on('error', function(err) {
      console.log(err);
    })
    .on('response', function(response) {
      console.log('Response Status Code: ', response.statusCode);
    })
    .pipe(fs.createWriteStream(filePath));
}


getRepoContributors("lighthouse-labs", "laser_shark", function(err, result) {
  console.log("Errors:", err);
  result.forEach((element) => {
    console.log(element.avatar_url);
    downloadImageByURL(element.avatar_url, 
      './avatar/' + element.login + '.png');
  });
});
