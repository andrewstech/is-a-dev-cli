const meow = require("meow");
const meowHelp = require("cli-meow-help");

const flags = {
  clear: {
    type: `boolean`,
    default: true,
    alias: `c`,
    desc: `Clear the console`
  },
  noClear: {
    type: `boolean`,
    default: true,
    desc: `Don't clear the console`
  },
  debug: {
    type: `boolean`,
    default: false,
    alias: `d`,
    desc: `Print debug info`
  },
  version: {
    type: `boolean`,
    alias: `v`,
    desc: `Print CLI version`
  },
  check: {
    type: `string`,
    alias: `c`,
    desc: `Check if a subdomain is available`
  }
};

const commands = {
  create: { desc: `Create a subdomain` },
  check: { desc: `Check if a subdomain is available` },
  login: { desc: `Login to is-a.dev` },
  help: { desc: `Print help info` },
  logout: { desc: `Logout of is-a.dev` }
};

const helpText = meowHelp({
  name: `is-a-dev`,
  flags,
  commands
});

const options = {
  inferType: true,
  description: false,
  hardRejection: false,
  flags
};

module.exports = meow(helpText, options);
