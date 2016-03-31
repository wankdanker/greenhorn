var concat = require('concat-stream');

module.exports = getStreamJSON;

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
