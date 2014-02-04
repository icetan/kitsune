var router = function(routes) {
  var regexps = {}, path;

  function cache(path) {
    regexps[path] = new RegExp('^'+path+'$');
  }

  function add(path, fn) {
    routes[path] = fn;
    cache(path);
  }

  function remove(path) {
    delete routes[path];
    delete regexps[path];
  }

  function route(path) {
    var i, m;
    if (path in routes) {
      return routes[path]();
    }
    for (i in regexps) {
      m = path.match(regexps[i]);
      if (m != null) {
        return routes[i].apply(undefined, m.slice(1));
      }
    }
  };

  for (path in routes) cache(path);

  route.add = add;
  route.remove = remove;
  return route;
};

module.exports = router;
