// don't warn if there are no configuration files
process.env.SUPPRESS_NO_CONFIG_WARNING = true;
// warn and exit if NODE_ENV or NODE_APP_INSTANCE don't make sense
// (see https://github.com/lorenwest/node-config/wiki/Strict-Mode)
process.env.NODE_CONFIG_STRICT_MODE = true;

let _ = require('lodash');
let config = require('config');
let util = require('util');

// parse command line arguments
let argv = require('minimist')(
	process.argv.slice(2),
	{
		alias: {
			'c': 'color',
			'f': 'filter',
			'v': 'verbose'
		},
		boolean: ['color', 'verbose'],
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
		rawConfigs = config.util.cloneDeep(configSources);

		if (argv.filter) {
			outputData = [];
			rawConfigs.forEach((configData) => {
				let filterData = _.first(_.at(configData.parsed, argv.filter));
				if (filterData) {
					outputData.push({
						'source': configData.name,
						'data': filterData
					});
				}
			});
		}
		else {
			outputData = rawConfigs;
		}
	}
	else {
		outputData = argv.filter ? config.get(argv.filter) : config.util.cloneDeep(config);
	}

	try {
		let outputString =
			argv.color ?
			util.inspect(
				outputData,
				{
					colors: true,
					depth: null
				}
			) :
			JSON.stringify(
				outputData,
				null,
				2
			)
		;

		console.log(outputString);
	}
	catch (err) {
		console.error(err);
	}
}
