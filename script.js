var $titleInput = $('.title-input');
var $bodyInput = $('.body-input');
var $saveButton = $('.save-button');
var $form = $('form');
// var searchInput = $('.search-input');

var $ideaList = [];

$(window).on('load', function() {
  var stringedIdeaList = localStorage.getItem('list');
  var parsedIdeaList = JSON.parse(stringedIdeaList);
  if (parsedIdeaList !== null) {
    $ideaList = parsedIdeaList;
    $ideaList.forEach(prependIdeaToList);
    console.log($ideaList)
  } 

})

//TODO: fix disable button on backspacing text input!
$titleInput.add($bodyInput).keyup(function () {
  if ($titleInput.val() !== '' && $bodyInput.val() !== '') {
    $saveButton.prop('disabled', false);
  } else {
    return false;
  }
});

$form.on('submit', function (event) {
  event.preventDefault();
  addNewIdeaToArray();
  prependIdeaToList();
  updateStorageData();
  clearFields();
});

function clearFields() {
  $titleInput.val('');
  $bodyInput.val('');
  $saveButton.prop('disabled', true);
}

function grabStorageData() {
  var stringedIdeaList = localStorage.getItem('list');
  var parsedIdeaList = JSON.parse(stringedIdeaList);
  return parsedIdeaList
}

function updateStorageData() {
  var stringedIdeaList = JSON.stringify($ideaList);
  localStorage.setItem('list', stringedIdeaList);
}

function Idea(title, body) {
  this.title = title;
  this.body = body;
  this.quality = 'swill';
  this.id = Date.now();
}

function addNewIdeaToArray() {
  var idea = new Idea($titleInput.val(), $bodyInput.val());
  $ideaList.push(idea);
}

function prependIdeaToList() {
  var ideaCard = '';
  for (var i = 0; i < $ideaList.length; i++) {
    ideaCard += `<li class="idea-card">
    <header class="idea-head">
      <h2 contenteditable="true">${$ideaList[i].title}</h2>
      <button data-id="${$ideaList[i].id}" class="image-delete" alt="delete this idea"></button>
    </header>
    <p class="idea-body" contenteditable="true">${$ideaList[i].body}</p>
    <footer>
      <button data-id="${$ideaList[i].id}"class="image-downvote" alt="downvote this idea"></button>
      <button data-id="${$ideaList[i].id}" class="image-upvote" alt="upvote this idea"></button>
      <small>${$ideaList[i].quality}</small>
    </footer>
  </li>`;
  };
  $('ul').html(ideaCard);
}

