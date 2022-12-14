#!/usr/bin/env node

/**
 * is-a-dev
 * Create Free subdomains
 *
 * @author andrewstech <httpz>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const login = require('./functions/login');
const check = require('./functions/check');
const logout = require('./functions/logout');
const create = require('./functions/create');
const debuger = require('./functions/debug');


const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	input.includes(`login`) && login();
	input.includes(`check`) && check(flags.check);
	input.includes(`logout`) && logout();
	input.includes(`create`) && create();
	input.includes(`debuger`) && debuger();

	debug && log(flags);
})();
