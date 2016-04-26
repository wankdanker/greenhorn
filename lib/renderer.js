var tpl = require('./templater');
var debug = require('./debug');

module.exports = renderer;

function renderer () {
	return function (req, res, next) {
		res.render = render;

		return next();

		function render(opts, cb) {
			var rndr = {
				filename : opts.filename || opts.file || opts.view
				, engine : opts.engine
				, context : opts.data || opts.context
			};

			tpl.render(rndr, function (err, result) {
				if (err) {
					if (err.code === 'ENOENT' && cb) {
						return cb();
					}

					if (~err.message.indexOf('engine not found')) {
						debug('engine not found for %s', rndr.filename);
						return cb();
					}

					debug(err);
					return res.end(err.message);
				}

				return res.end(result);
			});
		}
	}
}
