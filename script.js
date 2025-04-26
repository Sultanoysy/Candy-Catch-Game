let score = 0;
let timer = 60;
let interval, spawnInterval;
let isPaused = false;
let gameStarted = false;
let currentPlayer = 1;
let playerScores = [0, 0];

const scoreDisplay = document.getElementById("score");
const timeLeftDisplay = document.getElementById("time-left");
const currentPlayerDisplay = document.getElementById("current-player");
const gameArea = document.getElementById("game-area");
const soundToggle = document.getElementById("sound-toggle");
const clickSound = document.getElementById("click-sound");

const foodEmojis = ['🍦','🍫','🍭','🍕','🍩','🍉','🍒','🥪'];
const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const backgroundColors = ['#fce4ec', '#ffe0b2', '#dcedc8', '#b3e5fc', '#f8bbd0'];
let bgIndex = 0;

setInterval(() => {
  document.body.style.backgroundColor = backgroundColors[bgIndex];
  bgIndex = (bgIndex + 1) % backgroundColors.length;
}, 5000);

function toggleSettings() {
  document.getElementById("settings").classList.toggle("hidden");
}

function getFallSpeed() {
  const diff = document.getElementById("difficulty").value;
  return diff === 'easy' ? 2 : diff === 'normal' ? 4 : 6;
}

function getRandomObject() {
  const type = document.getElementById("object-type").value;
  if (type === "letters") {
    return letters[Math.floor(Math.random() * letters.length)];
  } else {
    if (Math.random() < 0.1) return '⭐';
    return foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
  }
}

function createCandy() {
  if (!gameStarted || isPaused) return;

  const candy = document.createElement("div");
  candy.classList.add("candy");
  candy.textContent = getRandomObject();
  candy.style.left = Math.random() * (gameArea.offsetWidth - 50) + "px";
  candy.style.top = "-60px";
  gameArea.appendChild(candy);

  let top = -60;
  const speed = getFallSpeed();

  const fall = setInterval(() => {
    if (isPaused || !gameStarted) return;
    top += speed;
    candy.style.top = top + "px";
    if (top > gameArea.offsetHeight) {
      candy.remove();
      clearInterval(fall);
    }
  }, 20);

  candy.addEventListener("click", () => {
    if (soundToggle.checked) clickSound.play();
    score += candy.textContent === '⭐' ? 5 : 1;
    scoreDisplay.textContent = score;
    candy.remove();
    clearInterval(fall);
  });
}

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  isPaused = false;
  score = 0;

  const customTime = parseInt(document.getElementById("custom-time").value) || 60;
  timer = customTime;

  scoreDisplay.textContent = score;
  timeLeftDisplay.textContent = timer;
  currentPlayerDisplay.textContent = currentPlayer;

  clearInterval(interval);
  clearInterval(spawnInterval);
  gameArea.innerHTML = '';

  interval = setInterval(() => {
    if (!isPaused) {
      timer--;
      timeLeftDisplay.textContent = timer;
      if (timer <= 0) endTurn();
    }
  }, 1000);

  spawnInterval = setInterval(createCandy, 1000);
}

function pauseGame() {
  isPaused = !isPaused;
}

function restartGame() {
  clearInterval(interval);
  clearInterval(spawnInterval);
  gameStarted = false;
  isPaused = false;
  score = 0;

  const customTime = parseInt(document.getElementById("custom-time").value) || 60;
  timer = customTime;

  currentPlayer = 1;
  playerScores = [0, 0];
  scoreDisplay.textContent = 0;
  timeLeftDisplay.textContent = timer;
  currentPlayerDisplay.textContent = 1;
  gameArea.innerHTML = '';
}

function endTurn() {
  clearInterval(interval);
  clearInterval(spawnInterval);
  gameStarted = false;
  playerScores[currentPlayer - 1] = score;

  const mode = document.getElementById("mode").value;
  if (mode === "multi" && currentPlayer === 1) {
    alert("Player 1's turn is over. Now Player 2!");
    currentPlayer = 2;
    score = 0;
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timer;
    startGame();
  } else {
    if (mode === "multi") {
      const [p1, p2] = playerScores;
      const winner = p1 > p2 ? "Player 1 Wins!" : (p1 < p2 ? "Player 2 Wins!" : "It's a tie!");
      alert(`Game Over!\nPlayer 1: ${p1}\nPlayer 2: ${p2}\n${winner}`);
    } else {
      alert(`Game Over! Your score: ${score}`);
    }
  }
}
