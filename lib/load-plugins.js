var debug = require('./debug');
var tryRequire = require('./try-require');
var path = require('path');

var cwd = process.cwd();

module.exports = loadPlugins;

function loadPlugins(app, plugins) {
  plugins = [].concat(plugins || []);

  debug('plugins:', plugins);

  plugins.forEach(function (plugin) {
    if (!plugin) {
      return;
    }

    var m = tryRequire(path.join(cwd, plugin))
      || tryRequire(path.join(cwd, 'greenhorn_' + plugin))
      || tryRequire(path.join(cwd, 'node_modules', 'greenhorn_' + plugin))
      || tryRequire(plugin)
      || tryRequire('greenhorn_' + plugin);

    if (!m) {
      debug('plugin not found : %s', plugin);
      return;
    }

    if (typeof m !== 'function') {
      debug('plugin not not a function: %s', plugin);
      return;
    }

    //if the module has a single parameter, then we pass it the app
    if (m.length === 1) {
      m(app);
    }
    else {
      //if the module has something other than 1, then we 'use' it
      //hopefully it's signature is (req, res, next);
      app.use(m);
    }
  });
}
