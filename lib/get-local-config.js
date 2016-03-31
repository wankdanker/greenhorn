var getStreamJSON = require('./get-stream-json');
var fs = require('fs');
var once = require('once');

module.exports = getLocalConfig;

function getLocalConfig(path, cb) {
	var r = fs.createReadStream(path);
	cb = once(cb);

	r.on('error', function (e) {
		cb(e);
	});

	getStreamJSON(r, cb);
}
