#!/usr/bin/env node

var UseyServer = require('usey-http');
var Usey = require('usey');
var argv = require('optimist').argv;
var join = require('path').join;

var debug = require('./lib/debug')
var renderer = require('./lib/renderer');
var logger = require('./lib/logger');
var loadAppConfig = require('./lib/load-app-config');
var getLocalConfig = require('./lib/get-local-config');

var port = argv.port || process.env.PORT || 5000;
var cwd = process.cwd();

var startup = Usey();
var app = UseyServer();
var horns = UseyServer();

app.use(renderer())
app.use(logger());
app.use(horns);
app.use(UseyServer._404());

var configLoaded = false;

startup.use(function (next) {
	debug('checking cwd for greenhorn.json');

	getLocalConfig(join(cwd, 'greenhorn.json'), function (err, config) {
		if (err) {
			debug(err);
			return next();
		}

		loadAppConfig(horns, config, function (err) {
			if (err) {
				debug(err);
				return next();
			}

			configLoaded = true;

			return next();
		});
	});
});

startup.use(function (next) {
	debug("listening on %s", port);

	app.listen(port);

	if (!configLoaded) {
		debug('no configuration loaded');
	}
});

startup();
