const { Issuer, errors: { OPError } } = require('openid-client');
const open = require('open');
const prompts = require('prompts');
var axios = require("axios").default;
const Conf = require('conf');
const domain = 'is-a-dev.uk.auth0.com';
const clientId = 'uYwB3yegsQvhx1tFM5LGbFdSgD0iIQEA';
const scopes = 'openid profile email offline_access';
const account = new Conf();
async function login() {
  
  if (account.has('username')) {
    console.log('You are already logged in as ' + account.get('username'));
    console.log('If you want to log in as a different user, please log out first.');
    console.log('To log out, run `is-a-dev logout`');
    return;
  }
  
  const auth0 = await Issuer.discover(`https://${domain}`);

  // instantiates a client
  const client = new auth0.Client({
    client_id: clientId,
    token_endpoint_auth_method: 'none',
    id_token_signed_response_alg: 'RS256',
  });

  // Device Authorization Request - https://tools.ietf.org/html/rfc8628#section-3.1
  const handle = await client.deviceAuthorization({ scope: scopes })

  // Device Authorization Response - https://tools.ietf.org/html/rfc8628#section-3.2
  const { verification_uri_complete, user_code, expires_in } = handle

  // User Interaction - https://tools.ietf.org/html/rfc8628#section-3.3
  await prompts({
    type: 'invisible',
    message: `Press any key to open up the browser to login or press ctrl-c to abort. You should see the following code: ${user_code}. It expires in ${expires_in % 60 === 0 ? `${expires_in / 60} minutes` : `${expires_in} seconds`}.`,
  });
  // opens the verification_uri_complete URL using the system-register handler for web links (browser)
  open(verification_uri_complete);

  // Device Access Token Request - https://tools.ietf.org/html/rfc8628#section-3.4
  // Device Access Token Response - https://tools.ietf.org/html/rfc8628#section-3.5
  let tokens;
  try {
    tokens = await handle.poll()
  } catch (err) {
    switch (err.error) {
      case 'access_denied': // end-user declined the device confirmation prompt, consent or rules failed
        console.error('\n\ncancelled interaction');
        break;
      case 'expired_token': // end-user did not complete the interaction in time
        console.error('\n\ndevice flow expired');
        break;
      default:
        if (err instanceof OPError) {
          console.error(`\n\nerror = ${err.error}; error_description = ${err.error_description}`);
        } else {
          throw err;
        }
    }
  }

  if (tokens) {
    // try-catching this since resource may have been used and the access token may
    // not be eligible for accessing the UserInfo Response
    try {
      console.log('\n\nSigned in as ', await (await client.userinfo(tokens)).name);
      account.set('refreshtoken', tokens.refresh_token);
      account.set('accesstoken', tokens.access_token);
      account.set('idtoken', tokens.id_token);
      account.set('username', await (await client.userinfo(tokens)).name);

      refreshtoken(tokens.refresh_token);
    } catch (err) {
      //
    }
  }

}

function refreshtoken(token) {
    console.log('refreshing token');
    var options = {
        method: 'POST',
        url: `https://${domain}/oauth/token`,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          authorization: 'Basic {yourApplicationCredentials}'
        },
        data: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: clientId,
          refresh_token: token
        })
      };
      
    axios.request(options).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });
}


module.exports = login;