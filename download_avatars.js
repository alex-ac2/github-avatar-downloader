// Obtain command line arguments for repo owner and repo name
var terminalArgs = process.argv.splice(2);

var request = require('request');
var credentials = require('./secrets.js');
var fs = require('fs');

// Github token 
var githubToken = credentials.GITHUB_TOKEN;

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, callback) {
  var options = {
    url:  "https://api.github.com/repos/" + repoOwner + "/" + repoName + 
      "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': githubToken 
    }
  };

  // GET Request to pass parsed response data to callback function
  request.get(options, function(err, res, body) {
    let data = JSON.parse(body);

    if (!err && res.statusCode == 200) {
      callback(err, data);
    } else if (data.message.toLowerCase() == 'not found') {
      console.log("Repo owner or repo name not found, please check your spelling");
      callback(true, data);
    }
  }); 
}

// Second GET request to retreive avatar image
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

// Check repo owner and repo name
if (terminalArgs.length !== 2) {
  console.log("Please provide only two names, <repo owner> & <repo name>");
} else {
  //Function Call to initate avatar lookup
  getRepoContributors(terminalArgs[0], terminalArgs[1], function(err, result) {
    if (err) {
      console.log("Error ocurred, please resubmit.\n");
    } else {
      result.forEach((element) => {
        console.log(element.avatar_url);
        downloadImageByURL(element.avatar_url, 
          './avatar/' + element.login + '.png');
      });
    }
  });
}
