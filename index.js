// don't warn if there are no configuration files
process.env.SUPPRESS_NO_CONFIG_WARNING = true;
// warn and exit if NODE_ENV or NODE_APP_INSTANCE don't make sense
// (see https://github.com/lorenwest/node-config/wiki/Strict-Mode)
process.env.NODE_CONFIG_STRICT_MODE = true;

let config = require('config');
let argv = require('minimist')(
	process.argv.slice(2),
	{
		alias: {
			'f': 'filter',
			'v': 'verbose'
		},
		boolean: ['verbose'],
		string: ['filter']
	}
);

let myVersion = require(__dirname + '/package.json').version;

// build an array of config sources
let configSources = config.util.getConfigSources();

// only continue if we have at least one configuration source
if (configSources.length > 0) {
	let outputData = null;
	if (argv.verbose) {
		outputData = config.util.cloneDeep(configSources);
	}
	else {
		outputData = argv.filter ? config.get(argv.filter) : config.util.cloneDeep(config);
	}

	try {
		console.log(
			JSON.stringify(
				outputData,
				null,
				2
			)
		);
	}
	catch (err) {
		console.error(err);
	}
}
