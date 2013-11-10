var fs = require('fs'),
    vixen = require('vixen'),

    xhr = require('./xhr');

function view(opt, callback) {
  opt = opt || {};

  function done(err, html) {
    if (err) return callback && callback(err);
    if (html != null) opt.el.innerHTML = html;
    var vm = view.vixen(opt.el, opt.model);
    callback && callback(null, {
      el: opt.el,
      model: vm,
      appendTo: function(to) {
        to.appendChild(this.el);
        return this;
      }
    });
  }

  // Override default view model with given model.
  opt.model = (function(a, b) {
    for (var i in b) if (!(i in a)) a[i] = b[i];
    return a;
  })(opt.model || {}, view.defaultModel);

  if (view.window && (!opt.el || typeof opt.el === 'string'))
    opt.el = view.window.document.createElement(opt.el || 'div');

  if (opt.id != null) opt.el.id = opt.id;
  if (opt.className != null) opt.el.className = opt.className;

  if (opt.path)
    view.readPath(opt.path, done);
  else
    done(null, opt.html);
}

if (typeof window !== 'undefined') view.window = window;

view.readPath = fs.readFile ?
  function(path, done) {
    fs.readFile(path, {encoding:'utf8'}, done);
  } : xhr.get;

view.defaultModel = {};
view.vixen = vixen.factory();

module.exports = view;
