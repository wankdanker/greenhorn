var argv = require('optimist').argv;

module.exports = function () {
  var defaultConfig = {};

  var sttic = argv.static || "./";

  defaultConfig.static = [{ root : sttic }];

  return defaultConfig;
};
