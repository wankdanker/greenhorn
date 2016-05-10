var UseyServer = require('usey-http');
var join = require('path').join;
var normalize = require('path').normalize;
var debug = require('./debug');
var loadTemplateFilters = require('./load-template-filters');

var serveStatic = UseyServer.static;
var cwd = process.cwd();

module.exports = loadAppConfig;

function loadAppConfig(app, config, cb) {
	var greenhorn = { config : config };
	var path = ['/','(.*)'];
	var base = greenhorn.base = join.apply(null, path);
	var routes = greenhorn.routes = UseyServer();

	if (config.filters) {
		loadTemplateFilters(config.filters);
	}

	app.use(routes);

	if (config.routes) {
		config.routes.forEach(function (route) {
			if (route.static) {
				app.use(staticRoute(route));
			}
			else {
				app[route.method || "all"](route.url, renderRoute(route.view, route.data, route.engine));
			}
		});
	}

	if (config.static) {
		config.static.forEach(function(static) {
			app.use(staticRoute(static))
		});
	}

	routes.get(base, defaultRoute);

	return cb(null, greenhorn);

	function staticRoute (opts) {
		debug('serving static content from %s', opts.root);

		return serveStatic(opts.root, opts);
	}

	function renderRoute (view, data, engine) {
		debug('adding route for view: %s', view);

		return function (req, res, next) {
			var nurl = join(cwd, normalize(view));

			res.render({
				view : nurl
				, engine : engine || config.engine
				, context :data
			});
		}
	}

	function defaultRoute (req, res, next) {
		var url = req.url.split('?')[0];
		var nurl = join(cwd, normalize(url));

		res.render({
			filename : nurl
			, engine : config.engine
			, context : config.data
		}, next);
	}
}
