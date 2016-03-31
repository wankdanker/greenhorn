var UseyServer = require('usey-http');
var join = require('path').join;
var normalize = require('path').normalize;
var debug = require('./debug');

var serveStatic = UseyServer.static;
var cwd = process.cwd();

module.exports = loadAppConfig;

function loadAppConfig(app, config, cb) {
	var greenhorn = { config : config };
	var path = ['/','(.*)'];
	var base = greenhorn.base = join.apply(null, path);
	var routes = greenhorn.routes = UseyServer();

	app.use(routes);

	if (config.routes) {
		config.routes.forEach(function (route) {
			if (route.static) {
				var root = join(cwd, route.root);

				debug('serving static content from %s', route.root);

				app.use(serveStatic(root, route));
			}
			else {
				app[route.method || "all"](route.url, renderRoute(route.view, route.data));
			}
		});
	}

	routes.get(base, defaultRoute);

	return cb(null, greenhorn);

	function staticRoute (url, root) {
		return serveStatic()
	}

	function renderRoute (view, data) {
		return function (req, res, next) {
			var nurl = join(cwd, normalize(view));

			res.render({
				view : nurl
				, context :data
			});
		}
	}

	function defaultRoute (req, res, next) {
		var nurl = join(cwd, normalize(req.url));

		res.render({
			filename : nurl
			, engine : config.engine
			, context : config.data
		}, next);
	}
}
