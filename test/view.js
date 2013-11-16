var test = require('tap').test,
    jsdom = require('jsdom'),

    view = require('../').view;

test('should create an empty div if no paramaters given', function(t) {
  jsdom.env('<html><body></body></html>', [], function(err, window) {
    view.window = window;
    view(null, function(err, v) {
      t.equal(v.el.tagName, 'DIV');
      t.ok(v.el instanceof window.HTMLElement);
    });
  });
  t.plan(2);
});

test('should create an empty element of type specified as first param', function(t) {
  jsdom.env('<html><body></body></html>', [], function(err, window) {
    view.window = window;
    view({el:'span'}, function(err, v) {
      t.equal(v.el.tagName, 'SPAN');
      t.ok(v.el instanceof window.HTMLElement);
    });
    view({el:'h1'}, function(err, v) {
      t.equal(v.el.tagName, 'H1');
      t.ok(v.el instanceof window.HTMLElement);
    });
  });
  t.plan(4);
});

test('should create an empty element of type specified with named params', function(t) {
  t.plan(6);
  jsdom.env('<html><body></body></html>', [], function(err, window) {
    view.window = window;
    var div = window.document.createElement('div');
    div.innerHTML = 'lol rofl';
    view({el:div}, function(err, v) {
      t.equal(v.el, div);
      t.equal(v.el.textContent, 'lol rofl');
    }, function() {
      t.ok(true);
    });
    view({el:'span', html:'hej på dig'}, function(err, v) {
      t.ok(v.el instanceof window.HTMLElement);
      t.equal(v.el.tagName, 'SPAN');
      t.equal(v.el.textContent, 'hej på dig');
    });
  });
});

test('should extend view model with model param', function(t) {
  jsdom.env('<html><body></body></html>', [], function(err, window) {
    view.window = window;
    view({
      el: 'div',
      html: '{{lol}}',
      model: {lol: 'rofl'}
    }, function(err, v) {
      t.equal(v.el.textContent, 'rofl');
      t.equal(v.model.lol, 'rofl');
    });
  });
  t.plan(2);
});

test('should add default view model properties to each new view', function(t) {
  jsdom.env('<html><body></body></html>', [], function(err, window) {
    view.window = window;
    view.defaultModel.pi = function(v) {return v.substr(1);};
    view({
      el: 'div',
      html: '{{lol | pi}}',
      model: {lol: 'rofl'}
    }, function(err, v) {
      t.equal(v.model.lol, 'rofl');
      t.equal(v.el.textContent, 'ofl');
    });
  });
  t.plan(2);
});

test('should add default view model properties to each new view', function(t) {
  jsdom.env('<html><body></body></html>', [], function(err, window) {
    var doc = window.document;
    view.window = window;
    view.defaultModel.pi = function(v) {return v.substr(1);};
    view({
      el: 'div',
      path: require.resolve('./data/view-template.html'),
      model: { a:1, b:2 }
    }, function(err, v) {
      t.equal(v.el.querySelector('#a').textContent, '1');
      t.equal(v.el.querySelector('#b').textContent, '2');
    });
  });
  t.plan(2);
});

test('same model object returned as given', function(t) {
  jsdom.env('<html><body></body></html>', [], function(err, window) {
    var model = { a:1, b:2 };
    view.window = window;
    view({ model: model }, function(err, v) {
      t.ok(v.model === model);
    });
  });
  t.plan(1);
});

test('should render view without callback', function(t) {
  jsdom.env('<html><body>{{a}} och {{b}}</body></html>', [], function(err, window) {
    var model = { a:1, b:2 },
        el = window.document.body;
    view.window = window;
    view({ model:model, el:el });
    t.equal(el.textContent, '1 och 2');
  });
  t.plan(1);
});

test('should attach el once to parent', function(t) {
  t.plan(5);
  jsdom.env('<html><body>Blorg</body></html>', [], function(err, window) {
    var model = { a:'lad', b:'ida' },
        parent = window.document.body,
        div = window.document.createElement('div'),
        el;
    div.innerHTML = 'lol'
    view.window = window;
    t.equal(parent.textContent, 'Blorg');
    view({
      model: model,
      parent: parent,
      path: require.resolve('./data/view-template.html')
    }, function(err, v) {
      el = v.el;
      parent.appendChild(div);
      view(v, function(err, v) {
        t.equal(parent.textContent, 'ladida\nlol');
        t.equal(el, v.el);
        t.equal(el, parent.children[0]);
        t.equal(div, parent.children[1]);
      });
    });
  });
});

test('should only parse el once with vixen', function(t) {
  var c = 0;
  t.plan(3);
  jsdom.env('<html><body>Blorg</body></html>', [], function(err, window) {
    var model = { a:'lad', b:'ida' },
        parent = window.document.body,
        v = { path:require.resolve('./data/view-template.html') };
    view.window = window;
    v.parent = parent;
    view(v, function(err, v) {
      t.equal(c++, 2);
    }, function(err, v) {
      t.equal(c++, 1);
    });
    view(v, function(err, v) {
      t.equal(c++, 0);
    }, function(err, v) {
      t.ok(false);
    });
  });
});
