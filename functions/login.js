const open = require('open');
const prompts = require('prompts');
const Conf = require('conf');
const { createOAuthDeviceAuth } = require("@octokit/auth-oauth-device");
const { Octokit } = require("@octokit/core");


const account = new Conf();
async function login() {
  
  if (account.has('username')) {
    console.log('You are already logged in as ' + account.get('username'));
    console.log('If you want to log in as a different user, please log out first.');
    console.log('To log out, run `is-a-dev logout`');
    return;
  }
  
  const auth = createOAuthDeviceAuth({
    clientType: "oauth-app",
    clientId: "8a9227de5ffbe23442b0",
    scopes: ["public_repo, user:email"],
    onVerification(verification) {
      // verification example
      // {
      //   device_code: "3584d83530557fdd1f46af8289938c8ef79f9dc5",
      //   user_code: "WDJB-MJHT",
      //   verification_uri: "https://github.com/login/device",
      //   expires_in: 900,
      //   interval: 5,
      // };
  
      console.log("Open %s", verification.verification_uri);
      console.log("Enter code: %s", verification.user_code);
    },
  });
  
  const tokenAuthentication = await auth({
    type: "oauth",
  });

  account.set('token', tokenAuthentication.token);

  const octokit = new Octokit({
    auth: tokenAuthentication.token
  })
  const res = await octokit.request('GET /user/emails', {});
  account.set('username', res.data.login);
  account.set('email', res.data.email);
  console.log('You are now logged in as ' + account.get('username'));

}

module.exports = login;