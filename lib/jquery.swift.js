
// jQuery - Swift - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

;(function($){
  
  var instances = []
  
  function buttons(options) {
    var buf = ''
    if (!options) throw 'swift must be passed a hash of buttons'
    for (var key in options)
      buf += '<input type="button" name="' + key + '" value="' + options[key].label + '" />'
    return buf
  }
  
  function template(label, options) {
    options = options || {}
    var instance = $('<span class="swift east">       \
      <span class="wrapper">                          \
        <span class="title">' + label + '</span>      \
        <span class="body">' + buttons(options.buttons) + '</span> \
      </span>                                         \
    </span>')
    instances.push(instance)
    return instance
  }
  
  function remove(options) {
    options = options || {}
    for (var i = 0, len = instances.length; i < len; ++i)
      instances[i].animate({
        left: instances[i].offset().left - (options.finishDistance || options.distance || 50),
        opacity: 0
      }, options.duration || 500, function(){
        $(this).remove()
      })
  }
  
  $.fn.swift = function(label, options) {
    remove(options = options || {})
    var self, left = this.offset().left + this.width()
    return (self = template(label, options)).appendTo('body').css({
      position: 'absolute',
      top: this.offset().top,
      left: left - (options.startDistance || options.distance || 30),
      opacity: 0
    })
    .animate({
      left: left,
      opacity: 1
    }, options.duration || 500)
    .find(':button')
    .click(function(e){
      var name = $(this).attr('name')
      if (name in options.buttons)
        if (options.buttons[name].action.call(self, e) !== false)
          remove()
    })
  }
  
})(jQuery)