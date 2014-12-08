function xhr(opt, callback) {
  var r = new XMLHttpRequest,
      method = opt.type || 'POST',
      header;
  r.open(method, opt.url, true);
  if (opt.headers) for (header in opt.headers) {
    r.setRequestHeader(header, opt.headers[header]);
  }
  if (callback) r.onreadystatechange = function() {
    if (r.readyState === 4) {
      if (r.status === 200) {
        callback(void 0, r.responseText, r);
      } else {
        callback(new Error(r.statusText + ': ' + r.responseText),
                 r.responseText, r);
      }
    }
  };
  return r.send(opt.data);
}

xhr.json = function(opt, callback) {
  var headers = { 'Accept': 'application/json' },
      callback_;

  if (callback) callback_ = function callback_(err, json, xhr) {
    var data;
    if (err) {
      callback(err, void 0, xhr);
    } else {
      try {
        data = JSON.parse(json);
      } catch (err_) {
        err = err_;
      }
      callback(err, data, xhr);
    }
  };

  if (!(opt.data instanceof FormData)) {
    opt.data = JSON.stringify(opt.data);
    headers['Content-Type'] = 'application/json';
  }
  opt.headers = (function (a,b) {for(var i in b)a[i]=b[i];return a;})(
    headers, opt.headers);
  return xhr(opt, callback_);
};

xhr.form = function(form, callback) {
  var opt = { url: form.action };

  if (!!FormData) {
    opt.data = new FormData(form);
  } else {
    opt.data = [].map.call(form, function(el) {
      return el.name + "=" + encodeURIComponent(el.value);
    }).join('&');
    opt.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  }

  xhr(opt, callback);
};

xhr.get = function(opt, callback) {
  if (typeof opt === 'string') opt = {
    url: opt
  };
  opt.type = 'GET';
  xhr(opt, callback);
};

module.exports = xhr;
