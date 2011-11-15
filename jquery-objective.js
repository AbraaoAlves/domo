(function ($) {
  $.fn.objective = function() {
    var append = function(array, value) { array.push(value); return array }
    var result = {};
    
    $(this).children().each(function() {
      var who = $(this).attr('name') ? $(this) : $(this).find('> [name], > :not([name]) [name]');
      var key = who.attr('name');

      var value = who.find('> [name], > :not([name]) [name]').size() > 0 ? who.objective() :
                  who.val() ? who.val() : who.text();
      
      value = who.is('select') ? who.val() :
              who.is('[type=checkbox]') ? $("[name="+ $(this).attr('name') +"]:checked")[0] ? true : false :
              who.is('[type=radio]') ? $("[name="+ $(this).attr('name') +"]:checked").val() :
              value;

      console.log(result[key]);

      if (key) result[key] = (result[key] && !$.isArray(result[key]) && !who.is('[type=radio]')) ? Array(result[key], value) :
                             $.isArray(result[key]) ? append(result[key], value) : value;
    });
    
    return result;
  };
})(jQuery);
