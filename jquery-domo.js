(function ($) {

  $.fn.domo = function(object) {
    // ## Object to DOM ##
    if (typeof object == 'object') {
      var thisParent = $(this).parent();
      var $this = $(this).detach();

      $('[type=checkbox], [type=radio]', $this).removeAttr('checked');
      $('option', $this).removeAttr('selected');

      for (var prop in object) {
        var who = ( $("[name='" + prop + "']", $this).length ) ? $("[name='" + prop + "']", $this) : $("[name='" + prop + "[]']", $this);
        applyValues(who, object, prop);
      }

      return $this.appendTo(thisParent);

    } else {
      // ## DOM to object ##
      var append = function(array, value) { array.push(value); return array }
      var result = {};
      
      $(this).children().each(function() {
        var key = $(this).attr("name");

        if (key) {
          var key = key.replace(/\[]$/, "");
          var value = $(this).children().size() > 0 ? $(this).domo() :
                      $(this).val() ? $(this).val() : $(this).text();

          value = $(this).is('select') ? $(this).val() :
                  $(this).is('[type=checkbox]') ? $(this).prop('checked') :
                  $(this).is('[type=radio]') ? $("[name="+ $(this).attr('name') +"]:checked").val() :
                  value;
          
          result[key] = (result[key] && !$.isArray(result[key]) && !$(this).is('[type=radio]') || $(this).attr("name").match(/[]$/) ) ?
                        Array(result[key], value) : $.isArray(result[key]) ?
                        append(result[key], value) : value;

        } else {
          $.extend(result, $(this).domo());
        }
      });
    
      return result;
    }
  }

  $.domo = function() {
    window.domo = window.domo || {};
    window.domo.body = $("body").domo();
    window.domo.sync = JSON.stringify(window.domo.body);
    window.domo.onchange = window.domo.onchange || function() {};
    window.domo.onchange();
    window.body = window.domo.body;

    $(document)
      .undelegate("[name]", "change.domo")
      .delegate("[name]", "change.domo", function() {
        $.domo();
        return false;
    });
  }

  function applyValues(who, object, prop) {
    $.isPlainObject(object[prop]) ? who.domo(object[prop]) :
    $.isArray(object[prop]) && !who.is('[type=radio]') ? doArray(who, object[prop]) :
    who.is('select') ? who.find("option[value='" + object[prop] + "'], option:contains('" + object[prop] + "')").attr('selected', 'true') :
    who.is('[type=checkbox]') ? who.attr('checked', object[prop]) :
    who.is('[type=radio]') ? who.filter("[value=" + object[prop] + "]").attr("checked", true) :
    who.is('input') ? who.attr('value', object[prop]) : who.html(object[prop]);
  }

  function doArray(who, arr) {
    var container = $("<div />");
        
    for (var i = 0; i < arr.length; i++) {
        var clone = who.eq(0).clone();
        applyValues(clone, arr, i)
        container.append(clone.outerHTML);
    }
        
    if (who.length > 1) who.replaceWith(who.eq(0));
    who.replaceWith(container.html());
  }

  $.fn.outerHTML = $.fn.outerHTML || ((document.outerHTML) ? 
    function() { return this.get(0).outerHTML;}: 
    function() { return $('<div>').append(this).html(); });
  
  $(document).ready(function() {
    $.domo();
    setInterval(verifyChanges, 100);
  });

  function verifyChanges() {
    if (JSON.stringify(window.domo.body) != window.domo.sync) {
      $("body").domo( window.domo.body );
      $.domo();
    }
  };

})(jQuery);
