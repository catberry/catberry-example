'use strict';

// configuration
const config = {
	isRelease: process.argv[2] === 'release',
	logger: {
		level: Number(process.env.CAT_LOG_LEVEL) || 30
	}
};

// catberry application
const catberry = require('catberry');
const cat = catberry.create(config);

// register Catberry plugins needed for building process
const templateEngine = require('catberry-handlebars');
templateEngine.register(cat.locator);

const logger = require('catberry-logger');
logger.register(cat.locator);

// run the build
cat.build();
