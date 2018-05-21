var $titleInput = $('.title-input');
var $bodyInput = $('.body-input');
var $saveButton = $('.save-button');
var $form = $('form');
// var searchInput = $('.search-input');

var $ideaList = $([]);

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
  grabStorageData();
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
  var stringedIdeaList = localStorage.getItem('storedIdeaList');
  if (stringedIdeaList !== null) {
    var parsedIdeaList = JSON.parse(stringedIdeaList);
    return parsedIdeaList;
  } else {
    return
  }
}

function updateStorageData() {
  var stringedIdeaList = JSON.stringify($ideaList);
  localStorage.setItem('storedIdeaList', stringedIdeaList);
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
  $ideaList.map(function () {
    ideaCard = `<li class="idea-card">
    <header class="idea-head">
      <h2>${this.title}</h2>
      <button id="${this.id}" class="image-delete" alt="delete this idea"></button>
    </header>
    <p class="idea-body">${this.body}</p>
    <footer>
      <button id="${this.id}"class="image-downvote" alt="downvote this idea"></button>
      <button id="${this.id}" class="image-upvote" alt="upvote this idea"></button>
      <small>${this.quality}</small>
    </footer>
  </li>`;
  });
  $('ul').prepend(ideaCard);
}