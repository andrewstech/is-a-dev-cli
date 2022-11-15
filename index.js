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


const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	input.includes(`login`) && login();
	input.includes(`check`) && check(flags.check);

	debug && log(flags);
})();
