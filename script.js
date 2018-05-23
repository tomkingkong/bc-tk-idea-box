//Variables

var $ideaList = [];
var $pageUl = $('ul');
var $form = $('form');
var $titleInput = $('.title-input');
var $bodyInput = $('.body-input');
var $saveButton = $('.save-button');
var searchInput = $('.search-input');
var $deleteButton = $('.delete-button');
var $upVoteButton = $('.upvote-button');
var $downVoteButton = $('.downvote-button');

//Listeners

//TODO: CHANGE FUNCTION TO SIMPLIFY LISTENER
$(window).on('load', function() {
  var stringedIdeaList = localStorage.getItem('list');
  var parsedIdeaList = JSON.parse(stringedIdeaList);
  if (parsedIdeaList !== null) {
    $ideaList = parsedIdeaList;
    $ideaList.forEach(prependIdeaToList);
  } 
})

//TODO: fix disable button on backspacing text input! CHANGE FUNCTION
$titleInput.add($bodyInput).keyup(function () {
  if ($titleInput.val() !== '' && $bodyInput.val() !== '') {
    $saveButton.prop('disabled', false);
  } else {
    return false;
  }
});

$form.on('submit', submitToList);
$pageUl.on('click', '.delete-button', filterOutIdea);

//FUNCTIONS

function Idea(title, body) {
  this.title = title;
  this.body = body;
  this.quality = 'quality: swill';
  this.id = Date.now();
}

function clearFields() {
  $titleInput.val('');
  $bodyInput.val('');
  $saveButton.prop('disabled', true);
}

function grabStorageData() {
  var stringedIdeaList = localStorage.getItem('list');
  var parsedIdeaList = JSON.parse(stringedIdeaList);
  if (parsedIdeaList === null){
    return [];
  }
  return parsedIdeaList;
}

function updateStorageData() {
  var stringedIdeaList = JSON.stringify($ideaList);
  localStorage.setItem('list', stringedIdeaList);
}

function addNewIdeaToArray() {
  var idea = new Idea($titleInput.val(), $bodyInput.val());
  $ideaList.unshift(idea);
}

function prependIdeaToList() {
  var ideaCard = '';
  for (var i = 0; i < $ideaList.length; i++) {
    ideaCard += 
      `<li class="idea-card" data-id="${$ideaList[i].id}">
        <header class="idea-head">
          <h2 contenteditable="true">
          ${$ideaList[i].title}
          </h2>
          <button class="delete-button" alt="delete this idea"></button>
        </header>
        <p class="idea-body" contenteditable="true">
        ${$ideaList[i].body}
        </p>
        <footer>
          <button class="downvote-button" alt="downvote this idea"></button>
          <button class="upvote-button" alt="upvote this idea"></button>
          <small>${$ideaList[i].quality}</small>
        </footer>
      </li>`
  }
  return $pageUl.html(ideaCard);
}

function submitToList(event) {
  event.preventDefault();
  $ideaList = grabStorageData();
  addNewIdeaToArray();
  updateStorageData();
  prependIdeaToList();
  clearFields();
}

function filterOutIdea() {
  var currentIdea = $(this).closest('li').attr('data-id');
  var updatedList = $ideaList.filter(function(obj) {
    return obj.id != currentIdea;
  });
    $ideaList = updatedList;
    $(this).closest('li').remove();
    updateStorageData();
}

$pageUl.on('click', '.upvote-button', function() {
  console.log($(this).closest('li').attr('data-id'));
  console.log('upvote clicked');
})

$pageUl.on('click', '.downvote-button', function() {
  console.log($(this).closest('li').attr('data-id'));
  console.log('downvote clicked');
})

$('section').on('change keyup', '.search-input', function() {
  console.log('search changed');
})