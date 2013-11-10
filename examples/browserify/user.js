var view = require('../../lib/view'),
    main = require('./main'),

    logger = main.logger.section('user');

module.exports = function(email, callback) {
  logger.debug('Your looking at user %s.', email);

  view({
    el: 'div',
    path: './user.html',
    model: {
      email: email,
      items: [
        {name:'Apa', id:123},
        {name:'Hest', id:4231}
      ]
    }
  }, callback);
};
