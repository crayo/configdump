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
		default: {
			'color': false,
			'verbose': false
		},
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
		rawConfigs = _.cloneDeep(configSources);

		if (argv.filter) {
			outputData = _.reduce(
				rawConfigs, 
				(result, configData) => {
					let filterData = _.get(configData.parsed, argv.filter);
					if (filterData) {
						result.push({
							'source': configData.name,
							'data': _.cloneDeep(filterData)
						});
					}
					return result;
				},
				[]
			);
		}
		else {
			outputData = rawConfigs;
		}
	}
	else {
		outputData = argv.filter ? config.get(argv.filter) : _.cloneDeep(config);
	}

	console.log(
		util.inspect(
			outputData,
			{
				colors: argv.color,
				depth: null
			}
		)
	);
}
