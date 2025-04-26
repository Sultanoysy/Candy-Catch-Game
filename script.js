window.onload = function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  let score = 0;
  let timeLeft = 60;
  let gameRunning = false;
  let objects = [];
  let interval;
  let gameLoop;

  const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 10
  };

  document.getElementById('start-button').addEventListener('click', () => {
    timeLeft = parseInt(document.getElementById('timerInput').value, 10);
    score = 0;
    objects = [];
    gameRunning = true;
    document.getElementById('score').innerText = score;
    document.getElementById('time').innerText = timeLeft;
    clearInterval(interval);
    clearInterval(gameLoop);
    interval = setInterval(updateTimer, 1000);
    gameLoop = setInterval(updateGame, 30);
  });

  function updateTimer() {
    timeLeft--;
    document.getElementById('time').innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(interval);
      clearInterval(gameLoop);
      gameRunning = false;
      alert('Game Over! Your Score: ' + score);
    }
  }

  function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    moveObjects();
    drawObjects();
    detectCollisions();
  }

  function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  function spawnObject() {
    const size = 30;
    objects.push({
      x: Math.random() * (canvas.width - size),
      y: -size,
      size: size,
      speed: 3 + Math.random() * 3
    });
  }

  function moveObjects() {
    if (Math.random() < 0.05) {
      spawnObject();
    }
    for (let obj of objects) {
      obj.y += obj.speed;
    }
    objects = objects.filter(obj => obj.y < canvas.height);
  }

  function drawObjects() {
    ctx.fillStyle = 'pink';
    for (let obj of objects) {
      ctx.beginPath();
      ctx.arc(obj.x + obj.size / 2, obj.y + obj.size / 2, obj.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function detectCollisions() {
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      if (
        obj.x < player.x + player.width &&
        obj.x + obj.size > player.x &&
        obj.y < player.y + player.height &&
        obj.y + obj.size > player.y
      ) {
        score += 10;
        document.getElementById('score').innerText = score;
        objects.splice(i, 1);
        break;
      }
    }
  }

  document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'ArrowLeft' && player.x > 0) {
      player.x -= player.speed;
    } else if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
      player.x += player.speed;
    }
  });
};
