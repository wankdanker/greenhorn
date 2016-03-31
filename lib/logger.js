var debug = require('./debug')

module.exports = logger;

function logger () {
	return function (req, res, next) {
		debug(req.method, req.url);

		return next();
	}
}
