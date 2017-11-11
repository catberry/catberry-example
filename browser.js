'use strict';

// catberry application
const catberry = require('catberry');

// config is assigned in the script included into HEAD component
// see server.js and the HEAD component for more details
const cat = catberry.create(window.$catConfig);

// register Catberry plugins needed in a browser
const templateEngine = require('catberry-handlebars');
templateEngine.register(cat.locator);

const loggerPlugin = require('catberry-logger');
loggerPlugin.register(cat.locator);

const uhrPlugin = require('catberry-uhr');
uhrPlugin.register(cat.locator);

// starts the application when DOM is ready
cat.startWhenReady();
