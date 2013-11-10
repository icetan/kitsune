var test = require('tap').test,

    Log = require('../').log;

test('should create an instance with logging methods mapping to levels', function(t) {
  var log = Log(['large','medium','small']);
  t.ok(log.large instanceof Function);
  t.ok('medium' in log);
  t.ok('small' in log);
  t.end();
});

test('should create an instance with default levels', function(t) {
  var log = Log();
  t.ok(log.info instanceof Function);
  t.ok('warning' in log);
  t.ok('error' in log);
  t.ok('fatal' in log);
  t.ok('debug' in log);
  t.end();
});

test('should emit log event on all messages as default', function(t) {
  var log = Log(null, function() {
    t.ok(true);
  });
  log.fatal('OMG everything is on fire!');
  log.debug('I don\'t even need to log this.');
  t.plan(2);
});

test('should only emit log event for levels lower than set level', function(t) {
  var log = new Log(null, function() {
    t.ok(true);
  });
  log.level = 1;
  log.fatal('OMG everything is on fire!');
  log.error('This is bad!');
  log.warning('This is, not so bad acctualy.');
  log.debug('I don\'t even need to log this.');
  t.plan(2);
});

test('should format log message like console.log', function(t) {
  var log = new Log(null, function(log) {
    t.equal(log.msg, 'This is a message about: DEBUG');
  });
  log.debug('This is a message about:', 'DEBUG');
  t.plan(1);
});

test('should return correct numeric level for a log type string', function(t) {
  var log = new Log(['zero','one', 'two']);
  t.equal(log.getLevel('zero'), 0);
  t.equal(log.getLevel('one'), 1);
  t.equal(log.getLevel('two'), 2);
  t.end();
});

test('should bubble section logs', function(t) {
  var log = new Log(null, function(log) {
        t.equal(log.section, 'test1');
      }),
      section = log.section('test1');
  section.level = 0;
  section.fatal('Fatal section message');
  section.error('Erroriorioirr');
  t.plan(1);
});

test('should apply filter on section logs', function(t) {
  var log = new Log(null, function(log) {
        t.ok(true);
      }),
      section = log.section('test1', function(log) {
        t.ok(true);
      });
  log.level = 0;
  section.level = 2;
  section.fatal('Fatal section message'); // Emitted by both loggers
  section.error('Erroriorioirr'); // Emitted only by section
  section.warning('Warninaflhjgldng'); // Emitted only by section
  section.info('Infoofosfiofisfon');
  section.debug('Debuggilibugily');
  log.level = 4;
  section.warning('Warninaflhjgldng'); // Emitted by both loggers
  section.debug('Debuggilibugily'); // Emitted by none of the loggers
  t.plan(2 + 4);
});

test('should obay custom filters', function(t) {
  var log = new Log(null, function(log) {
        t.ok(true);
      }),
      section1 = log.section('test1');
      section2 = log.section('test2');
  section1.debug('Infoofosfiofisfon'); // Bubble
  section2.debug('Debuggilibugily'); // Bubble
  log.filter = function(log) {
    return log.section === 'test1';
  };
  section1.debug('Infoofosfiofisfon'); // Bubble
  section2.debug('Debuggilibugily'); // Filtered out
  t.plan(3);
});
