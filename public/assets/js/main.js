// nice text box scripts..

$(document).ready(function(){
   $('.nice-textbox').blur(function() {
        if($(this).val().length === 0){
          $('.nice-label').removeClass("focus");
        }
        else { returns; }
      })
      .focus(function() {
        $('.nice-label').addClass("focus")
      });
});

// end nice text box scripts..
