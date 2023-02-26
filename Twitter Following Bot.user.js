// ==UserScript==
// @name         Twitter Following Bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  click follow button on twitter
// @author       https://www.fiverr.com/junaid285
// @match        https://twitter.com/*/followers
// @match        https://twitter.com/*/following
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @resource   IMPORTED_CSS https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css
// @grant      GM_getResourceText
// @grant      GM_addStyle
// ==/UserScript==

// add bootstrap
// add all the content


(function() {
    'use strict';
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);
})();



function addContent() {

  const mainContainer = document.createElement('div');

  mainContainer.innerHTML = ` <div class="col-md-4">
<div class="card card-body p-4">
  <a id="closebtn" href="#" style="position: absolute; top:10px; right: 20px;">X</a>
  <h3 class="pt-3">Twitter Following Bot</h1>

  <p class="pt-2">Current Profile: <span class="font-weight-bold">@<span id="current-profile">junaid9211</span></span></p>

    <form id="inputForm">

      <div class="form-group row pt-3">
        <label for="delay-min" class="col-sm-4 col-form-label" style="margin-top: -10px;">Random Delay in seconds</label>
        <div class="col-sm-4">
          <input type="number" class="form-control" id="delay-min" placeholder="Min" required>
        </div>
        <div class="col-sm-4">
          <input type="number" class="form-control" id="delay-max" placeholder="Max" required>
        </div>
      </div>


      <div class="form-group row pt-3">
        <label for="inputEmail3" class="col-sm-6 col-form-label"  style="margin-top: -10px;">Number of people to follow</label>
        <div class="col-sm-5">
          <input type="number" min="1" max="1000" class="form-control" id="max-count" placeholder="" required>
        </div>
      </div>


      <!-- <div class="form-group">
        <label for="author">Author</label>
        <input type="text" class="form-control" id="author" placeholder="Enter Author">
      </div>

      <div class="form-group">
        <label for="isbn">ISBN#</label>
        <input type="text" class="form-control" id="isbn" placeholder="Enter ISBN#">
      </div> -->

      <input id="submitBtn" type="submit" value="Start Following!" class="btn btn-success btn-block">
    </form>

    <div>
    <p class="pt-3">
    Remaining: <span id="remaining-count">0</span>
    <span class="font-weight-bold">| </span>
    Followed: <span id="followed-count">0 </span> </P>
    <p></P>
    </div>
  </div>
  </div>
`;

  mainContainer.id = 'main';
  mainContainer.classList.add('container');
  mainContainer.style.position = 'fixed';
  mainContainer.style.top = '10px';
  mainContainer.style.display = 'none';
  mainContainer.style.zIndex = '999';


  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggleBtn';
  toggleBtn.classList.add('btn', 'btn-primary');
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.top = '10px';
  toggleBtn.style.left = '10px';
  toggleBtn.style.zIndex = '999';
  toggleBtn.textContent = 'Show Bot!';


  const div = document.querySelector('h1');

  document.body.insertBefore(mainContainer, document.querySelector('div'));
  document.body.insertBefore(toggleBtn, document.querySelector('div'));

}

addContent();

let follow = false;






function randomSleepInterval(min, max) { // min and max included
  return Math.floor((Math.random() * (max - min + 1) + min) * 1000);
}


const mainContainer = document.querySelector('#main');
const inputForm = document.querySelector('#inputForm');
const toggleBtn = document.querySelector('#toggleBtn');
const startButton = document.querySelector('#submitBtn');
const closeBtn = document.querySelector('#closebtn');
const minDelay = document.querySelector('#delay-min');
const maxDelay = document.querySelector('#delay-max');
const maxCount = document.querySelector('#max-count');
const remainingCount = document.querySelector('#remaining-count');
const followedCount = document.querySelector('#followed-count');


function followfunc(maxCountValue) {
  if (follow && maxCountValue>0) {
    window.scrollBy(0, 50);
    const followbtn = document.querySelector('div[aria-label*="Timeline: Follow"] div[aria-label*="Follow @"]');
    followbtn.click();
    maxCountValue--;
    remainingCount.textContent = maxCountValue;
    followedCount.textContent = Number(followedCount.textContent) + 1;
    let delay = randomSleepInterval(Number(minDelay.value), Number(maxDelay.value));
    setTimeout(() => followfunc(maxCountValue), delay);
  }

  if (maxCountValue==0){
    follow = false;
    stopState();
  }

}


function startState() {
  startButton.value = 'Stop following!';
  startButton.classList.remove('btn-success')
  startButton.classList.add('btn-danger')
  minDelay.disabled = true;
  maxDelay.disabled = true;
  maxCount.disabled = true;
  remainingCount.textContent = maxCount.textContent;
  followedCount.textContent = 0;
}

function stopState() {
  startButton.value = 'Start following!';
  startButton.classList.add('btn-success')
  startButton.classList.remove('btn-danger')
  minDelay.disabled = false;
  maxDelay.disabled = false;
  maxCount.disabled = false;
  remainingCount.textContent = 0;
  followedCount.textContent = 0;
}



toggleBtn.addEventListener('click', (e) => {
  mainContainer.style.display = 'inline';
  toggleBtn.style.display = 'none';
  let profile = document.URL.split('/');
  profile = profile[profile.length-2];
  document.getElementById('current-profile').textContent = profile;
})


closeBtn.addEventListener('click', (e) => {
  mainContainer.style.display = 'none';
  toggleBtn.style.display = 'inline';
  e.preventDefault();
})



startButton.addEventListener('click', (e) => {
  console.log('hahha');

  follow = !follow;

  if (follow) {
    startState();
    followfunc(Number(maxCount.value));
  } else {
    stopState();
  }

  e.preventDefault();

})

// get a random number between 2 values
// multiply by 1000 to get milliseconds then wait that amount of time
// number to keep track of count