
//#region--------------VARIABLES---------------------- //

var $ideaList = [];
var $pageUl = $('ul');
var $form = $('form');
var $titleInput = $('.title-input');
var $bodyInput = $('.body-input');
var $saveButton = $('.save-button');
var $searchInput = $('.search-input');
var $deleteButton = $('.delete-button');
var $upVoteButton = $('.upvote-button');
var $downVoteButton = $('.downvote-button');

//#endregion ------------------------------------------//

//#region--------------LISTENERS---------------------- //

$(window).on('load', repopulatePage);
$form.on('submit', submitToList);
$titleInput.add($bodyInput).keyup(toggleEnableSaveButton);
$pageUl.on('click', '.idea-title', makeContentEditable);
$('section').on('change keyup', '.search-input', matchFunction);
$pageUl.on('click', '.delete-button', filterOutIdea);
$pageUl.on('click', '.downvote-button', downVote);
$pageUl.on('click', '.upvote-button', upVote);
//TODO: Refactor Event Listeners for changing title and body
$pageUl.on('focusout', '.idea-body', function(event){
  event.preventDefault();
     changeBody(event);
 });
$pageUl.on('keyup', '.idea-body', function(event){
 event.preventDefault();
  if (event.which === 13) {
    changeBody(event);
  }
});
$pageUl.on('focusout', '.idea-title', function(event){
  event.preventDefault();
     changeTitle(event);
 });
$pageUl.on('keyup', '.idea-title', function(event){
 event.preventDefault();
  if (event.which === 13) {
    changeTitle(event);
  }
});


//#endregion ------------------------------------------//

//#region--------------FUNCTIONS---------------------- //

function repopulatePage() {
  var stringedIdeaList = localStorage.getItem('list');
  var parsedIdeaList = JSON.parse(stringedIdeaList);
  if (parsedIdeaList !== null) {
    $ideaList = parsedIdeaList;
    $ideaList.forEach(prependIdeasToList);
  } 
}

function toggleEnableSaveButton() {
  if ($titleInput.val() !== '' && $bodyInput.val() !== '') {
    $saveButton.prop('disabled', false);
  } else if ($titleInput.val() == '' || $bodyInput.val() == ''){
    $saveButton.prop('disabled', true);
  } else {
    return false;
  }
}

function submitToList(event) {
  event.preventDefault();
  $ideaList = grabStorageData();
  addNewIdeaToArray();
  updateStorageData();
  prependIdeasToList();
  clearFields();
}

function clearFields() {
  $titleInput.val('');
  $bodyInput.val('');
  $saveButton.prop('disabled', true);
}

function clearIdeas() {
  $('li').remove();
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

function Idea(title, body) {
  this.title = title;
  this.body = body;
  this.quality = 'quality: swill';
  this.id = Date.now();
}

function addNewIdeaToArray() {
  var idea = new Idea($titleInput.val(), $bodyInput.val());
  $ideaList.unshift(idea);
}

function prependIdeasToList() {
  var ideaCard = '';
  $ideaList.forEach(function(obj) {
    ideaCard += 
      `<li role="idea card" aria-selected="true" class="idea-card" data-id="${obj.id}">
        <header class="idea-head">
          <h2 class="idea-title" tabindex="1" contenteditable="false" aria-label="enter to edit content">
          ${obj.title}
          </h2>
          <button class="delete-button" aria-label="delete"></button>
        </header>
        <p class="idea-body" tabindex="0" contenteditable="true" type="submit">
        ${obj.body}
        </p>
        <footer>
          <button id="down" class="downvote-button" aria-label="downvote"></button>
          <button id="up" class="upvote-button" aria-label="upvote"></button>
          <small>${obj.quality}</small>
        </footer>
      </li>`
  })
  return $pageUl.html(ideaCard);
}

//TODO: Turn part of this filter function into single function for reuse!
//first 4 or 5 lines!
function filterOutIdea() {
  var currentIdeaId = $(this).closest('li').attr('data-id');
  var updatedList = $ideaList.filter(function(obj) {
    return obj.id != currentIdeaId;
  });
    $ideaList = updatedList;
    $(this).closest('li').remove();
    updateStorageData();
}

//TODO:: Make up/down vote buttons with one function 
//If button clicked is downvote && quality !== swill do this
//if button click is upvote && quality !== brilliant do this
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
  prependIdeasToList();
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
  prependIdeasToList();
}

function changeBody(event) {
  var currentIdeaID = $(event.currentTarget).closest('li').attr('data-id');
  var newBody = $(event.currentTarget).closest('p').text(); 
  var idea = $ideaList.find(function(obj){
    if (obj.id == currentIdeaID){
      return obj;
    }
  })
  var updatedList = $ideaList.map(function(obj) {
    if (obj.id === idea.id) {
      obj.body = newBody;
    }
    return obj;
  })
  $ideaList = updatedList;
  updateStorageData();
  clearIdeas();
  prependIdeasToList();
  return
}

function changeTitle(event) {
  var currentIdeaID = $(event.currentTarget).closest('li').attr('data-id');
  var newTitle = $(event.currentTarget).closest('h2').text();
  var idea = $ideaList.find(function(obj){
    if (obj.id == currentIdeaID){
      return obj;
    }
  })
  var updatedList = $ideaList.map(function(obj) {
    if (obj.id === idea.id) {
      obj.title = newTitle;
      console.log(obj)
    }
    return obj;
  })
  $ideaList = updatedList;
  updateStorageData();
  clearIdeas();
  prependIdeasToList();
}

//TODO:CHANGE BOTH TITLE AND BODY // Create IF/Else
function changeBodyTitle() {
  var currentIdeaID = $(this).closest('li').attr('data-id');
  var newBody = $(this).closest('p').text();
  var newTitle = $(this).closest('h2').text();
  var idea = $ideaList.find(function(obj){
    if (obj.id == currentIdeaID){
      return obj;
    }
  })
  var updatedList = $ideaList.map(function(obj) {
    if (obj.id === idea.id) {
      obj.body = newBody;
      obj.title = newTitle;
    }
    return obj;
  })
  $ideaList = updatedList;
  updateStorageData();
  clearIdeas();
  prependIdeasToList();
}

function matchFunction() {
  var str = $searchInput.val();
  var regexp = new RegExp(str, 'ig'); //item to search in string, 'i' -capitol or lowercase, 'g' -all of the string
  storageList = grabStorageData();
  var titleResults = storageList.filter(obj => obj.title.match(regexp));//match regex string to title, return filtered array
  var bodyResults = storageList.filter(obj => obj.body.match(regexp));//match regex string to body, return filtered array
  var $mergedArray = $.merge(titleResults, bodyResults);//merge both results
  var $results = jQuery.uniqueSort($mergedArray);//remove duplicates and return single array
  clearIdeas();//clear ideas from DOM
  displaySearchResults($results);//restore filtered list of ideas to DOM
}

//Make this function universal, it is nearly identical to prependIdeasToList
function displaySearchResults(results) {
  var ideaCard = '';
  results.forEach(function(obj) {
    ideaCard += 
      `<li class="idea-card" aria-selected="true" data-id="${obj.id}">
        <header class="idea-head">
          <h2 class="idea-title" tabindex="1" contenteditable="false" aria-label="click to edit content">
          ${obj.title}
          </h2>
          <button class="delete-button" aria-label="delete"></button>
        </header>
        <p class="idea-body" tabindex="0"  contenteditable="true" type="submit">
        ${obj.body}
        </p>
        <footer>
          <button id="down" class="downvote-button" aria-label="downvote"></button>
          <button id="up" class="upvote-button" aria-label="upvote"></button>
          <small>${obj.quality}</small>
        </footer>
      </li>`
  })
  return $pageUl.html(ideaCard);
}

//change click to enter
function makeContentEditable() {
  console.log('whoot');
  $('.idea-title').prop('contenteditable', true);
}

//endregion------------------------------------------------ //
