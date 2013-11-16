var fs = require('fs'),
    vixen = require('vixen'),

    xhr = require('./xhr');

function view(opt, callback, ready) {
  var fromPath, opt = opt || {};

  function done(err, html) {
    if (err) return callback && callback(err);
    var parse = html != null || !(!!fromPath ^ !!opt.el.__fromPath);

    if (html != null) opt.el.innerHTML = html;
    if (parse) view.vixen(opt.el, opt.model);

    if (opt.parent && opt.el.parentNode !== opt.parent) {
      opt.parent.innerHTML = '';
      opt.parent.appendChild(opt.el);
    }

    if (parse) ready && ready(null, opt);
    callback && callback(null, opt);
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

  if (opt.path) {
    opt.el.__fromPath = fromPath = true;
    view.readPath(opt.path, done);
    delete opt.path;
  } else {
    done(null, opt.html);
    delete opt.html;
  }

  return opt;
}

if (typeof window !== 'undefined') view.window = window;

view.readPath = fs.readFile ?
  function(path, done) {
    fs.readFile(path, {encoding:'utf8'}, done);
  } : xhr.get;

view.defaultModel = {};
view.vixen = vixen.factory();

module.exports = view;
