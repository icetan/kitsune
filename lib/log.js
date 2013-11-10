function log(levels, callback) {
  var levels_ = {},
      levels = levels || ['fatal', 'error', 'warning', 'info', 'debug'],

      this_ = {
        level: levels.length - 1,

        getLevel: function(type) {
          return levels_[type];
        },

        filter: function(log) {
          return log.level <= this_.level;
        },

        log: function(type) {
          var log = {
            date: new Date(),
            section: this_.name,
            type: type,
            level: this_.getLevel(type)
          };
          if (!this_.filter(log)) return;
          log.msg = Array.prototype.slice.call(arguments, 1).join(' ');
          this_._onlog(log);
        },

        section: function(name, callback) {
          var logger = log(Object.keys(levels_), function(log) {
                callback && callback(log);
                if (this_.filter(log)) this_._onlog(log);
              });
          logger.name = name;
          return logger;
        },

        _onlog: function(log) {
          callback && callback(log);
          this_.onlog && this_.onlog(log);
        }
      };

  levels.forEach(function(type, i) {
    levels_[type] = i;
    this_[type] = this_.log.bind(this_, type);
  });

  return this_;
}

module.exports = log;
