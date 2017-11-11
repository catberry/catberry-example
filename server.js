'use strict';

const http = require('http');
const path = require('path');

// configuration
const config = {
	title: process.env.CAT_TITLE || 'Catberry Application',
	server: {
		port: Number(process.env.CAT_PORT) || 3000
	},
	logger: {
		level: Number(process.env.CAT_LOG_LEVEL) || 30
	},
	isRelease: process.argv[2] === 'release',
	publicDirectoryPath: path.join(__dirname, 'public')
};

// catberry application
const catberry = require('catberry');
const cat = catberry.create(config); // the Catberry application object
cat.events.on('ready', () => {
	const logger = cat.locator.resolve('logger');
	logger.info(`Ready to handle incoming requests on port ${config.server.port}`);
});

// register Catberry plugins needed on the server
const templateEngine = require('catberry-handlebars');
templateEngine.register(cat.locator);

const loggerPlugin = require('catberry-logger');
loggerPlugin.register(cat.locator);

const uhrPlugin = require('catberry-uhr');
uhrPlugin.register(cat.locator);

// web server
const express = require('express');
const app = express();

const compression = require('compression');
const zlib = require('zlib');
app.use(compression({
	flush: zlib.Z_PARTIAL_FLUSH
}));

const serveStatic = require('serve-static');
app.use(serveStatic(config.publicDirectoryPath));

// serving client config
// CREATE A SEPARATE OBJECT HERE AND COPY REQUIRED VALUES
// FROM THE SERVER CONFIG EXCLUDING PRIVATE DATA IF NEEDED
const clientConfig = {
	title: config.title,
	isRelease: config.isRelease,
	logger: {
		level: config.logger.level
	}
};
const configResp = `window.$catConfig=${JSON.stringify(clientConfig)}`;
app.get('/config.js', (req, res) => res.end(configResp));

app.use(cat.getMiddleware()); // Catberry app as a middleware

const errorhandler = require('errorhandler');
app.use(errorhandler());

http
	.createServer(app)
	.listen(config.server.port);
