const Conf = require('conf');
const account = new Conf();
const prompts = require('prompts');
const fetch = require("node-fetch");
const questions = require('./createquestions');
const logger = require('../utils/log');
const { Octokit } = require("@octokit/core");
const { Base64 } = require("js-base64");

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  };

function ValidateIPaddress(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true)  
    } 
    return (false)  
  }  

async function create() {
  if (!account.has('username')) {
    logger.negative('You are not logged in.');
    logger.neutral('To log in, run `is-a-dev login`');
    return;
  }
  logger.neutral('You are logged in as ' + account.get('username'));
  const response = await prompts(questions);
  const octokit = new Octokit({
    auth: account.get('token')
  })
  var type = response.type;
  await octokit.request('POST /repos/{owner}/{repo}/forks', {
    owner: 'is-a-dev',
    repo: 'register'
  })
  var content = response.Content;
  var username = account.get('username');
  var email = account.get('email');
  var validSubdomain = response.subdomain.replace(/\.is-a\.dev$/, '');
  var lowcaseDomain = validSubdomain.toLowerCase();
  var LowcaseContent = content.toLowerCase();
  if(type === "CNAME") {
    if (isValidURL(LowcaseContent) === false) {;
        logger.negative('The content you entered is not a valid URL.');
        return;
    }
    }
    if(type === "A") {
        if (ValidateIPaddress(LowcaseContent) === false) {
            logger.negative('The content you entered is not a valid IP address.');
            return;
        }
    }
    if(type === "A" || type === "MX") {
        LowcaseContent = JSON.stringify(
            LowcaseContent.split(",").map((s) => s.trim())
        );
      } else {
        LowcaseContent = `"${LowcaseContent.trim()}"`;
      }

    var fullContent = ` 
    {
      "owner": {
        "username": "${username}",
        "email": "${email}"
      },
      "record": {
        "${type}": ${LowcaseContent}
      }
    }
    `;
    var contentEncoded = Base64.encode(fullContent);

  fetch(`https://api.github.com/repos/is-a-dev/register/contents/domains/${lowcaseDomain}.json`, {
            method: 'GET',
            headers: {
                'User-Agent': 'mtgsquad'
            }
        }).then(async(res) => {
            if(res.status && res.status == 404) {
                octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                    owner: username,
                    repo: 'register',
                    path: 'domains/' + validSubdomain + '.json',
                    message: 'Added ' + validSubdomain,
                    content: contentEncoded
                }
                ).catch((error) => {
                    throw new Error("Something went badly wrong!");
                    return;
                }
                );
            } else throw new Error("The subdomain is unavailable!");
        })
        await delay(1000);
        var res = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
            owner: 'is-a-dev',
            repo: 'register',
            title: 'Added ' + validSubdomain + ' via is-a-dev-cli',
            body: 'Added ' + validSubdomain + ' via the CLI',
            head: username + ':main',
            base: 'main'
          })

            logger.positive('Your record has been created. Please wait for it to be approved.');
            logger.neutral('You can check the status of your record here: ' + res.data.html_url);
            logger.positive('Thanks for using is-a-dev CLI!');

}

module.exports = create;
