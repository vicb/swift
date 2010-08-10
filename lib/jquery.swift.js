
// jQuery - Swift - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

;(function($){
  
  // --- Swift instances
  
  var instances = [], btnIndex = 0, btnMapping = {};
  
  /**
   * Generate input buttons from the given _hash_.
   *
   * @param  {object} hash
   * @return {string}
   * @api private
   */
  
  function buttons(hash) {
    var buf, id;
    if (!hash) { throw 'swift must be passed a hash of buttons'; }
    $.each(hash, function(k, v) {
      v.action = v.action || function() {};
      id = "btn-swift-" + btnIndex++;
      buf += $.fn.swift.templates.button(k, v.label, id);
      btnMapping[id] = v;
    });
    return buf;
  }
  
  /**
   * Generate a swift instance with the given _label_ and _options_.
   *
   * Options:
   *
   *  - body:    arbitrary text or markup placed before buttons
   *  - buttons: hash of buttons passed to buttons()
   *
   * @param  {string} label
   * @param  {object} options
   * @return {jQuery}
   * @api private
   */
  
  function template(label, options) {
    options = options || {};
    var instance = $.fn.swift.templates.dialog(label, options);
    instances.push(instance);
    return instance;
  }
  
  /**
   * Close all swift instances with the given _options_.
   *
   * Options:
   *
   *  - duration:  animation duration in milliseconds
   *
   * @param  {object} options
   * @api private
   */
  
  function close(options) {
    var instance;
    options = options || {};
    while (instance = instances.pop()) {
      $.fn.swift.effects.hide(instance, options);
    }
    btnMapping = {};
  }
  
  /**
   * Create a swift instance applied to the first element
   * in the collection. Self-positions based on it's offset.
   *
   * Returns the collection of swift elements.
   *
   * Options:
   *
   *  - duration:  animation duration in milliseconds 
   *  - body:      arbitrary text or markup placed before buttons
   *  - buttons:   hash of buttons passed to buttons()
   *
   * @param  {string} label
   * @param  {object} options
   * @return {jQuery}
   * @api public
   */
  
  $.fn.swift = function(label, options) {
    close(options = options || {});
    var self, target = this;
    return $.fn.swift.effects.show(self = template(label, options), target, options)
    .find('[id^=btn-swift-]')
    .click(function(e){
      e.target = target;
      if (btnMapping[$(this).attr('id')].action.call(self, e) !== false) { close(); }
    })
    .end();
  };

  $.extend($.fn.swift, {
    effects: {
      show: function(instance, target, options) {
        var left = target.offset().left + target.width();
        return instance.appendTo('body').css({
          position: 'absolute',
          top: target.offset().top,
          left: left - 30,
          opacity: 0
        })
        .animate({
          left: left,
          opacity: 1
        }, options.duration || 500);
      },
      hide: function(instance, options) {
        instance.animate({
          left: instance.offset().left - 30,
          opacity: 0
        }, options.duration || 500, function(){
          $(this).remove();
        });
      }
    },
    templates : {
      dialog: function(label, options) {
        return $('<span class="swift east">' +
          '<span class="wrapper">' +
            '<span class="title">' + label + '</span>' +
            '<span class="body">' + (options.body || '') +
            buttons(options.buttons) + '</span>' +
          '</span>' +
        '</span>');
      },
      button: function(name, value, id) {
        return '<input type="button" id="' + id + '" name="' + name + '" value="' + value + '" />';
      }
    }
  });
    
})(jQuery);