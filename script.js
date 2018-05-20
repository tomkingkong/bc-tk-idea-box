var $titleInput = $('.title-input');
var $bodyInput = $('.body-input');
var $saveButton = $('.save-button');
// var searchInput = $('.search-input');

var ideaList = [];

$titleInput.add($bodyInput).keyup(function() {
  if ($titleInput.val() !== '' && $bodyInput.val() !== '') {
    $saveButton.prop('disabled', false);
    console.log('enabled');
  } else {
    console.log('disabled still');
    return false;
  }
});

$saveButton.on('click', function(event) {
  event.preventDefault();
  console.log($titleInput.val() + $bodyInput.val());
  clearFields();
});

function clearFields() {
  $titleInput.val('');
  $bodyInput.val('');
  $saveButton.prop('disabled', true);
}

function grabStorageData() {
  var stringedIdeaList = localStorage.getItem('storedIdeaList');
  var parsedIdeaList = JSON.parse(stringedIdeaList);
  return parsedIdeaList;
}

function updateStorageData() {
  var stringedIdeaList = JSON.stringify(ideaList);
  console.log(stringedIdeaList);
  localStorage.setItem('storedIdeaList', stringedIdeaList);
}

function Idea(title, body) {
  this.title = title;
  this.body = body;
  this.quality = 'swill';
  this.id = Date.now();
}

function makeNewIdeaAddToList() {
  var idea = new Idea($titleInput.val(), $bodyInput.val());
}
