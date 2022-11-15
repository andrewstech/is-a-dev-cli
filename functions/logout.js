const Conf = require('conf');
const account = new Conf();

function logout() {
  if (!account.has('username')) {
    console.log('You are not logged in.');
    return;
  }
  account.delete('username');
  account.delete('accesstoken');
  account.delete('refreshtoken');
  account.delete('idtoken');
  console.log('You have been logged out.');
}

module.exports = logout;