const Conf = require('conf');
const account = new Conf();
const figlet = require('figlet');
const chalk = require('chalk')

function debuger() {
    console.log(
        chalk.yellow(
          figlet.textSync('is-a.dev', { horizontalLayout: 'full' })
        )
      );
    console.log('===============================');
    console.log('DEBUGGER');
    console.log('USERNAME: ' + account.get('username'));
    console.log('EMAIL: ' + account.get('email'));
    console.log('TOKEN: ' + account.get('token'));
}

module.exports = debuger;

