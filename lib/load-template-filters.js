var path = require('path');
var debug = require('./debug');
var Templater = require('templater');

module.exports = loadTemplateFilters;

function loadTemplateFilters (modules) {
  var cwd = process.cwd();
  var engines = [];

  Templater.Engines.forEach(function (engine) {
    try {
      var e = require(engine);
      engines.push(e);
    }
    catch (e) {}
  });

  modules = [].concat(modules);

  modules.forEach(function (mod) {
    var p = path.join(cwd, 'node_modules', mod);

    debug('loading template filters from: %s', p)

    var m = require(p);

    Object.keys(m).forEach(function (key) {
      var fn = m[key];

      engines.forEach(function (e) {
        if (!e.filters) {
          return;
        }

        e.filters[key] = fn;
      });
    });
  });
}
