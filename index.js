var kitsune = {
      router: require('./lib/router'),
      view: require('./lib/view'),
      xhr: require('./lib/xhr'),
      log: require('./lib/log')
    },
    originalKitsune;

if (typeof window !== 'undefined') {
  originalKitsune = window.kitsune;
  kitsune.noConflict = function() {
    window.kitsune = originalKitsune;
    return kitsune;
  };
  window.kitsune = kitsune;
}

module.exports = kitsune;
