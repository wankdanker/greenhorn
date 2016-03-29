#!/usr/bin/env node

var UseyServer = require('usey-http');
var Usey = require('usey');
var argv = require('optimist').argv;
var debug = require('debug')('greenhorn');
var fs = require('fs');
var concat = require('concat-stream');
var join = require('path').join;
var normalize = require('path').normalize;
var once = require('once');
var Templater = require('templater');

var port = argv.port || process.env.PORT || 5000;
var cwd = process.cwd();

var startup = Usey();
var app = UseyServer();
var horns = UseyServer();

app.use(log);
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

function log(req, res, next) {
	debug(req.method, req.url);
	
	return next();
}

function loadAppConfig(app, config, cb) {
	var greenhorn = { config : config };
	var path = ['/','(.*)'];
	var base = greenhorn.base = join.apply(null, path);
	var tpl = greenhorn.templater = new Templater();
	var routes = greenhorn.routes = UseyServer();

	app.use(routes);

	routes.get(base, route);

	return cb(null, greenhorn); 

	function route (req, res, next) {
		var nurl = join(cwd, normalize(req.url));

		tpl.render({
			filename : nurl
			, engine : config.engine
			, context : config.data 
		}, function (err, result) {
			if (err) {
				debug(err);

				return res.end(err.message);
			}

			return res.end(result);
		});
	}
}

function getLocalConfig(path, cb) {
	var r = fs.createReadStream(path);
	cb = once(cb);

	r.on('error', function (e) {
		cb(e);
	});

	getStreamJSON(r, cb);
}

function getStreamJSON(stream, cb) {
	var cs = concat(function (data) {
		var json;

		try {
			json = JSON.parse(data);
		}
		catch (e) {
			return cb(e);
		}

		return cb(null, json);
	});

	stream.pipe(cs);
}
