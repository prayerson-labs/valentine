/* ============================================
   Valentine v2 — Interactive Love Letter
   ============================================
   One room. Four states. Only fades.
   ============================================ */

/* ============================================
   DOM References
   ============================================ */
const app              = document.getElementById('app');
const stateArrival     = document.getElementById('state-arrival');
const stateSuspense    = document.getElementById('state-suspense');
const stateQuestion    = document.getElementById('state-question');
const stateCelebration = document.getElementById('state-celebration');

const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');

const btnContinue      = document.getElementById('btn-continue');
const dateText         = document.getElementById('date-text');
const buttonsContainer = document.getElementById('buttons-container');
const btnYes           = document.getElementById('btn-yes');
const btnNo            = document.getElementById('btn-no');
const noMessage        = document.getElementById('no-message');

const btnShare      = document.getElementById('btn-share');
const copiedMessage = document.getElementById('copied-message');

const heartsBg          = document.getElementById('hearts-bg');
const confettiContainer = document.getElementById('confetti-container');

/* ============================================
   Utility Functions
   ============================================ */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function typeText(element, text, speed) {
  speed = speed || 50;
  return new Promise(function (resolve) {
    var i = 0;
    element.classList.add('typing');

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed + Math.random() * 30);
      } else {
        element.classList.remove('typing');
        resolve();
      }
    }

    type();
  });
}

/* ============================================
   State Transitions
   ============================================ */
function transitionTo(stateId) {
  var states = document.querySelectorAll('.state');
  for (var i = 0; i < states.length; i++) {
    states[i].classList.remove('active');
  }
  document.getElementById(stateId).classList.add('active');
}

/* ============================================
   Background Hearts
   ============================================ */
var heartEmojis = ['❤️', '💕', '💖', '💗', '♥️', '💓'];
var heartSpawnRate = 800;
var heartTimer = null;
var maxHearts = 20;

function spawnHeart() {
  if (heartsBg.childElementCount >= maxHearts) return;

  var heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';

  var duration = 6 + Math.random() * 6;
  heart.style.setProperty('--duration', duration + 's');
  heart.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');

  heartsBg.appendChild(heart);
  heart.addEventListener('animationend', function () {
    heart.remove();
  });
}

function startHearts() {
  spawnHeart();
  heartTimer = setInterval(spawnHeart, heartSpawnRate);
}

function doubleHearts() {
  clearInterval(heartTimer);
  maxHearts = 40;
  heartSpawnRate = 350;
  heartTimer = setInterval(spawnHeart, heartSpawnRate);
  // Burst of extra hearts
  for (var i = 0; i < 12; i++) {
    (function (delay) {
      setTimeout(spawnHeart, delay);
    })(i * 80);
  }
}

/* ============================================
   Background Sparkles
   ============================================ */
function spawnSparkle() {
  var sparkle = document.createElement('span');
  sparkle.className = 'sparkle';
  sparkle.textContent = '✨';
  sparkle.style.left = Math.random() * 100 + 'vw';
  sparkle.style.top = Math.random() * 100 + 'vh';
  sparkle.style.fontSize = (0.5 + Math.random() * 0.7) + 'rem';
  document.body.appendChild(sparkle);
  sparkle.addEventListener('animationend', function () {
    sparkle.remove();
  });
}

function startSparkles() {
  spawnSparkle();
  setInterval(spawnSparkle, 1800);
}

/* ============================================
   Confetti Burst
   ============================================ */
function launchConfetti() {
  var colors = ['#ffd6e7', '#ff4d6d', '#cdb4ff', '#ffd700', '#ff85a2', '#fff'];

  for (var i = 0; i < 70; i++) {
    var piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = (10 + Math.random() * 80) + 'vw';
    piece.style.top = '-10px';
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    piece.style.setProperty('--fall-duration', (2 + Math.random() * 2.5) + 's');
    piece.style.setProperty('--fall-delay', (Math.random() * 0.6) + 's');
    piece.style.setProperty('--drift', (Math.random() * 150 - 75) + 'px');
    piece.style.setProperty('--rotation', (Math.random() * 720) + 'deg');

    confettiContainer.appendChild(piece);
    piece.addEventListener('animationend', function () {
      this.remove();
    });
  }
}

/* ============================================
   Date Cycling (State 3)
   ============================================ */
var dates = [
  'feb 14', 'feb 15', 'feb 16', 'feb 17',
  'feb 18', 'feb 19', 'feb 20', 'forever'
];

async function cycleDates() {
  // Pause so user reads "Will you be my Valentine for… feb 14"
  await wait(900);

  for (var i = 1; i < dates.length; i++) {
    // Fade out current text
    dateText.classList.add('fade-out');
    await wait(300);

    // Swap text
    dateText.textContent = dates[i];
    dateText.classList.remove('fade-out');

    if (dates[i] === 'forever') {
      dateText.classList.add('forever');
      await wait(600);
      // Reveal Yes / No buttons
      buttonsContainer.classList.add('visible');
      return;
    }

    // Progressive speed-up: starts ~900ms, ends ~500ms
    var delay = Math.max(500, 900 - i * 60);
    await wait(delay);
  }
}

/* ============================================
   No Button Dodge
   ============================================ */
var noAttempts = 0;
var usingTouch = false;

function dodgeNoButton() {
  if (noAttempts >= 15) return;

  noAttempts++;

  // First dodge → switch to fixed positioning
  if (!btnNo.classList.contains('dodging')) {
    btnNo.classList.add('dodging');
  }

  // Random position inside viewport
  var padding = 20;
  var btnW = btnNo.offsetWidth;
  var btnH = btnNo.offsetHeight;
  var maxX = window.innerWidth  - btnW - padding;
  var maxY = window.innerHeight - btnH - padding;
  var newX = padding + Math.random() * Math.max(0, maxX - padding);
  var newY = padding + Math.random() * Math.max(0, maxY - padding);

  btnNo.style.left = newX + 'px';
  btnNo.style.top  = newY + 'px';

  // Threshold behaviors
  if (noAttempts === 5) {
    btnNo.textContent = 'be serious';
  }

  if (noAttempts === 10) {
    btnNo.classList.add('shrunk');
  }

  if (noAttempts >= 15) {
    noMessage.textContent = 'the button refuses rejection';
    noMessage.classList.add('visible');
  }
}

/* ============================================
   Celebration (State 4)
   ============================================ */
function triggerCelebration() {
  btnYes.disabled = true;

  // Immediate effects
  app.classList.add('shake');
  document.body.classList.add('celebrate');
  launchConfetti();
  doubleHearts();

  // After shake completes → cross-fade to celebration state
  setTimeout(function () {
    app.classList.remove('shake');
    transitionTo('state-celebration');
  }, 600);
}

/* ============================================
   Share / Clipboard
   ============================================ */
async function copyShareText() {
  var text = 'i said yes \u{1F642}\u200D\u2195\uFE0F';

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }

  copiedMessage.textContent = 'text copied. just paste it in our instagram chat.';
  copiedMessage.classList.add('visible');
}

/* ============================================
   GIF Fallbacks
   ============================================ */
var gifs = document.querySelectorAll('.state-gif');
for (var g = 0; g < gifs.length; g++) {
  gifs[g].onerror = function () {
    this.style.display = 'none';
    this.nextElementSibling.style.display = 'block';
  };
}

/* ============================================
   Event Listeners
   ============================================ */

// Continue → State 3
btnContinue.addEventListener('click', function () {
  transitionTo('state-question');
  cycleDates();
});

// Yes → Celebration
btnYes.addEventListener('click', triggerCelebration);

// No → Dodge (touch)
btnNo.addEventListener('touchstart', function (e) {
  e.preventDefault();
  usingTouch = true;
  dodgeNoButton();
}, { passive: false });

// No → Dodge (mouse)
btnNo.addEventListener('mouseenter', function () {
  if (!usingTouch) dodgeNoButton();
});

// No → Dodge (click fallback — prevents actual click)
btnNo.addEventListener('click', function (e) {
  e.preventDefault();
  if (noAttempts < 15) dodgeNoButton();
});

// Share
btnShare.addEventListener('click', copyShareText);

/* ============================================
   Init — The show begins
   ============================================ */
async function init() {
  // Background comes alive instantly
  startHearts();
  startSparkles();

  // STATE 1 → visible for ~1.5s
  await wait(1500);

  // Fade to STATE 2
  transitionTo('state-suspense');
  await wait(500); // let the fade finish

  // Typewriter
  await typeText(line1, 'okay listen…', 55);
  await wait(600);
  await typeText(line2, 'i have been meaning to ask you something', 45);
  await wait(900);
  await typeText(line3, 'please don\'t panic', 50);
  await wait(400);

  // Reveal continue button
  btnContinue.classList.add('visible');
}

init();
