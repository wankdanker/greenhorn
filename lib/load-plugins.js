var debug = require('./debug');
var tryRequire = require('./try-require');

module.exports = loadPlugins;

function loadPlugins(app, plugins) {
  plugins = [].concat(plugins || []);

  debug('plugins:', plugins);

  plugins.forEach(function (plugin) {
    if (!plugin) {
      return;
    }

    var m = tryRequire(plugin) || tryRequire('greenhorn_' + plugin);

    if (!m) {
      debug('plugin not found : %s', plugin);
      return;
    }

    if (typeof m !== 'function') {
      debug('plugin not not a function: %s', plugin);
      return;
    }

    m(app);
  });
}
