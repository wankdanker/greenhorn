var debug = require('./debug');

module.exports = tryRequire;

function tryRequire(module) {
  var m;

  debug('%s : trying to load module', module);

  try {
    m = require(module);
  }
  catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      debug('%s : module not found', module);
    }
    else {
      //if the error is something other than MODULE_NOT_FOUND
      //then we should throw it
      throw e;
    }
  }

  return m;
}
