const Conf = require('conf');
const account = new Conf();

function logout() {
  if (!account.has('username')) {
    console.log('You are not logged in.');
    return;
  }
  
  account.delete('email');
  account.delete('username');
  account.delete('token');
  console.log('You have been logged out.');
}

module.exports = logout;
