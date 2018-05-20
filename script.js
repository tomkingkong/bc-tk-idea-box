var $titleInput = $('.title-input');
var $bodyInput = $('.body-input');
var $saveButton = $('.save-button');
// var searchInput = $('.search-input');


$titleInput.add($bodyInput).keyup(function() {
  if ($titleInput.val() !== '' && $bodyInput.val() !== '') {
    $saveButton.prop('disabled', false); 
    console.log('enabled');
  } else {
    console.log('disabled still');
    return false;
  };
});


$saveButton.on('click', function(event) {
  event.preventDefault();
  console.log($titleInput.val() + $bodyInput.val())
  $.fn.clearFields();
  
  });

$.fn.clearFields = function() {
  $titleInput.val('');
  $bodyInput.val('');
  $saveButton.prop('disabled', true);
}


