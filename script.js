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
$pageUl.on('click', '.downvote-button', downVote);
$pageUl.on('click', '.upvote-button', upVote);

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
  $ideaList.forEach(function(obj) {
    ideaCard += 
      `<li class="idea-card" data-id="${obj.id}">
        <header class="idea-head">
          <h2 contenteditable="true">
          ${obj.title}
          </h2>
          <button class="delete-button" alt="delete this idea"></button>
        </header>
        <p class="idea-body" contenteditable="true">
        ${obj.body}
        </p>
        <footer>
          <button id="down" class="downvote-button" alt="downvote this idea"></button>
          <button id="up" class="upvote-button" alt="upvote this idea"></button>
          <small>${obj.quality}</small>
        </footer>
      </li>`
  })
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
  var currentIdeaId = $(this).closest('li').attr('data-id');
  var updatedList = $ideaList.filter(function(obj) {
    return obj.id != currentIdeaId;
  });
    $ideaList = updatedList;
    $(this).closest('li').remove();
    updateStorageData();
}

//If button clicked is downvote && quality !== swill do this
//if button click is upvote && quality !== brilliant do this
// $pageUl.on('click', '.downvote-button, .upvote-button', function(event) {
//   var currentIdeaID = $(this).closest('li').attr('data-id');
//   var idea = $ideaList.find(function(obj){
//     return obj.id == currentIdeaID;
//   });
// console.log($(event))
// if (idea.quality !== 'quality: swill' && $(event.target).closest('button').hasClass($downVoteButton)) {
// console.log('shit is swill');
// } else if (idea.quality === 'quality: swill' && $(event.target).id('up')) {
// console.log('shit bout to be brilliant');
// }
// });


function upVote() {
  var currentIdeaID = $(this).closest('li').attr('data-id');
  $ideaList = grabStorageData();
  var idea = $ideaList.find(function(obj){
    return obj.id == currentIdeaID;
  })
    if (idea.quality === 'quality: brilliant') {
    return false;
  } else if (idea.quality === 'quality: plausible') {
    idea.quality = 'quality: brilliant';
  } else if (idea.quality === 'quality: swill'){
    idea.quality = 'quality: plausible';
  }
  var updatedList = $ideaList.map(function(obj) {
    if (obj.id === idea.id) {
      obj.quality = idea.quality;
    }
    return obj;
  })
  $ideaList = updatedList;
  updateStorageData();
  clearIdeas();
  prependIdeaToList();
}

function downVote() {
  var currentIdeaID = $(this).closest('li').attr('data-id');
  $ideaList = grabStorageData();
  var idea = $ideaList.find(function(obj){
    if (obj.id == currentIdeaID){
      return obj;
    }
  })
    if (idea.quality === 'quality: swill') {
    return false;
  } else if (idea.quality === 'quality: brilliant') {
    idea.quality = 'quality: plausible';
  } else if (idea.quality === 'quality: plausible'){
    idea.quality = 'quality: swill';
  }
  var updatedList = $ideaList.map(function(obj) {
    if (obj.id === idea.id) {
      obj.quality = idea.quality;
    }
    return obj;
  })
  $ideaList = updatedList;
  updateStorageData();
  clearIdeas();
  prependIdeaToList();
}

function clearIdeas() {
  $('li').remove();
}

//SEARCH
$('section').on('change keyup', '.search-input', function() {
  console.log('search changed');
})
