
// jQuery - Swift (MIT Licensed)
// 
// Copyright (c) 2009 TJ Holowaychuk <tj@vision-media.ca>
// Copyright (c) 2010 Victor Berchet - http://www.github.com/vicb

;(function($){
  
  // --- Swift instances, button indexes and mapping
  
  var instances = []
    , btnIndex = 0
    , btnMapping = {};
  
  /**
   * Generate input buttons from the given _options_.
   *
   * @param  {Object} options
   * @return {string}
   * @see $.fn.swift.templates.button
   * @api private
   */
  
  function buttons(options) {
    var id, buf = '';
    if (!options) throw 'swift must be passed a hash of buttons';
    $.each(options, function(k, v) {
      v.action = v.action || function(){};
      id = "btn-swift-" + btnIndex++;
      buf += $.fn.swift.templates.button(k, v.label, id);
      btnMapping[id] = v;
    });
    return buf;
  }
  
  /**
   * Generate a swift instance with the given _label_ and _options_.
   *
   *
   * @param  {String} label
   * @param  {Object} options
   * @return {jQuery}
   * @see $.fn.swift.templates.dialog
   * @api private
   */
  
  function template(label, options) {
    options = options || {};
    var instance = $.fn.swift.templates.dialog(label, options, buttons);
    instances.push(instance);
    return instance;
  }
  
  /**
   * Close all swift instances with the given _options_.
   *
   * @param  {Object} options
   * @see $.fn.swift.effects.hide
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
   * @param  {String} label
   * @param  {Object} options
   * @return {jQuery}
   * @api public
   */
  
  $.fn.swift = function(label, options) {
    close(options = options || {});
    var self = template(label, options), target = this;
    return $.fn.swift.effects.show(self, target, options)
      .find('[id^=btn-swift-]')
      .click(function(e){
        e.target = target;
        if (btnMapping[$(this).attr('id')].action.call(self, e) !== false) { 
          close();
        }
      })
      .end();
  };

  $.extend($.fn.swift, {
    effects: {

      /**
       * Show a dialog instance
       *
       * Options:
       *
       *  - body:    arbitrary text or markup placed before buttons
       *  - buttons: hash of buttons passed to buttons()
       *
       * @param  {jQuery} instance: dialog
       * @param  {jQuery} target: element triggering the dialog
       * @param  {Object} options
       */
      
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

      /**
       * Hide a dialog instance
       *
       * Options:
       *
       *  - duration:  animation duration in milliseconds
       *
       * @param  {jQuery} instance: dialog
       * @param  {Object} options
       */

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

      /**
       * Generate a swift instance with the given _label_ and _options_.
       *
       * Options:
       *
       *  - body:    arbitrary text or markup placed before buttons
       *  - buttons: hash of buttons passed to buttons()
       *
       * @param  {String} label
       * @param  {Object} options
       * @param  {Function} makeButtons
       * @return {jQuery} dialog
       */

      dialog: function(label, options, makeButtons) {
        return $('<span class="swift east">' +
          '<span class="wrapper">' +
            '<span class="title">' + label + '</span>' +
            '<span class="body">' + (options.body || '') +
            makeButtons(options.buttons) + '</span>' +
          '</span>' +
        '</span>');
      },

      /**
       * Generate a button markup with the given _name_, _value_ and _id_
       *
       * @param  {String} name
       * @param  {String} value
       * @param  {String} id: must be used as element's id
       * @return {String}
       */

      button: function(name, value, id) {
        return '<input type="button" id="' + id + '" name="' + name + '" value="' + value + '" />';
      }
    }
  });
    
})(jQuery);