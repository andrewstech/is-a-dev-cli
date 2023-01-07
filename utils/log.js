const alert = require('cli-alerts');

const info = () => {
	const log = alert({
		type: `warning`,
		name: `DEBUG LOG`,
		msg: ``
	});

	console.log(log, "\n");
};

const positive = (message) => {
	console.log(`\x1b[32m%s\x1b[0m`, message);
};

const neutral = (message) => {
	console.log(message);
};

const negative = (message) => {
	console.log(`\x1b[31m%s\x1b[0m`, message);
};

module.exports = {
	info,
	positive,
	neutral,
	negative
};