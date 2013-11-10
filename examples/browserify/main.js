var crypto = require('crypto'),

    // Vixen MVVM modules
    vmvvm = require('../../'),
    router = vmvvm.router,
    view = vmvvm.view,
    Log = vmvvm.Log,

    main;

// Setup default chaining functions for views.
view.defaultModel = {
  gravatar: function(email) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(email.trim().toLowerCase());
    return 'http://www.gravatar.com/avatar/'+md5sum.digest('hex')+
      '?d=identicon&s=200';
  }
};

module.exports = main = {
  // Init for main.
  init: function(window) {
    var body = window.document.getElementsByTagName('body')[0];

    function hashchange(e) {
      var hash = window.location.hash.substr(1);
      main.route(hash)(function(err, view) {
        body.innerHTML = '';
        body.appendChild(view.el);
      });
    }

    window.logs = [];
    main.logger.on('log', function(log) {
      window.logs.push(log);
    });

    window.addEventListener('hashchange', hashchange);
    hashchange();
  },

  // Setup routes.
  route: router({
    'user/(.*)': function (email) {
      return require('./user').bind(undefined, email);
    },

    // Default view, matches all paths
    'login': function () {
      return require('./login');
    },

    // Default view, matches all paths
    '.*': function () {
      return view.bind(null, {html:'404'});
    }
  }),

  // Setup a logger to log to memory.
  logger: new Log()
};

main.init(window);
