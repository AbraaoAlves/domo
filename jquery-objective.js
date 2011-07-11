jQuery.fn.extend({
  objective: function() {
    var result = {};
    var append = function(array, value) { array.push(value); return array }
    
    jQuery(this).children().each(function() {
      var key = jQuery(this)[0].tagName;

      var value = jQuery(this).children().size() > 0 ? jQuery(this).objective() :
                  jQuery(this).val() ? $(this).val() : jQuery(this).text();

      result[key] = (result[key] && !jQuery.isArray(result[key])) ? Array(result[key], value) :
                    jQuery.isArray(result[key]) ? append(result[key], value) : value;

    });
    
    return result;
  }
});

// jQuery.fn.extend({
//   objective: function() {
//     var result = {};
//     jQuery('[name]', this).each(function() {
//       var key = $(this).attr('name');
//       result[key] = (jQuery('[name]', this).size() > 0 && !jQuery.isArray($(this).val())) ? jQuery(this).objective() :
//                     jQuery(this).val() ? jQuery(this).val() : jQuery(this).text();
//     });
//     return result;
//   }
// });
