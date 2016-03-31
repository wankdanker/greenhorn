var tpl = require('./templater');
var debug = require('./debug');

module.exports = renderer;

function renderer () {
	return function (req, res, next) {
		res.render = render;

		return next();

		function render(opts, cb) {
			tpl.render({
				filename : opts.filename || opts.file || opts.view
				, engine : opts.engine
				, context : opts.data || opts.context
			}, function (err, result) {
				if (err) {
					if (err.code === 'ENOENT' && cb) {
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
