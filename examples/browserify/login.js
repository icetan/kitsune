var view = require('../../lib/view'),
    main = require('./main'),

    logger = main.logger.section('login');

module.exports = function(callback) {
  var model = {
        login: function(e) {
          e.preventDefault(e);
          if (model.password === 'test')
            window.location.hash = '#user/'+model.email;
          else
            model.error = 'show';
          return false;
        },
        email: 'c.freden@gmail.com',
        password: 'test'
      };

  logger.debug('Your on the login view son.');

  view({
    path: './login.html',
    model: model
  }, callback);
};
