const game = document.getElementById("game");
const player = document.getElementById("player");
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const timeEl = document.getElementById("time");
const bestTimeEl = document.getElementById("bestTime");
const countdownEl = document.getElementById("countdown");

const gameOverBox = document.getElementById("gameOverBox");
const finalTimeEl = document.getElementById("finalTime");
const restartBtn = document.getElementById("restartBtn");

const gameWidth = game.offsetWidth;

let playerX = gameWidth / 2;
let speed = 4;
let gameOver = true;
let startTime = 0;
let animationId;
let spawnTimer;

// BEST TIME
let bestTime = localStorage.getItem("bestTime") || 0;
bestTimeEl.innerText = `Best: ${Number(bestTime).toFixed(2)}s`;

// TOUCH CONTROL
let startX = 0;
game.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

game.addEventListener("touchmove", e => {
  if (gameOver) return;
  let dx = e.touches[0].clientX - startX;
  playerX += dx * 0.25;
  startX = e.touches[0].clientX;
});

// PC CONTROL
document.addEventListener("keydown", e => {
  if (gameOver) return;
  if (e.key === "ArrowLeft") playerX -= 18;
  if (e.key === "ArrowRight") playerX += 18;
});

// START BUTTON
startBtn.addEventListener("click", startGame);

// RESTART BUTTON
restartBtn.addEventListener("click", () => {
  gameOverBox.style.display = "none";
  startGame();
});


// =======================
// START GAME
// =======================
function startGame() {
  startScreen.style.display = "none";
  player.style.display = "block";

  gameOverBox.style.display = "none";

  document.querySelectorAll(".obstacle").forEach(o => o.remove());
  clearTimeout(spawnTimer);
  cancelAnimationFrame(animationId);

  playerX = gameWidth / 2;
  speed = 4;
  gameOver = true;

  countdown();
}


// =======================
// COUNTDOWN
// =======================
function countdown() {
  let count = 3;
  countdownEl.style.display = "flex";
  countdownEl.innerText = count;

  const timer = setInterval(() => {
    count--;

    if (count > 0) {
      countdownEl.innerText = count;
    } else {
      clearInterval(timer);
      countdownEl.innerText = "GO!";

      setTimeout(() => {
        countdownEl.style.display = "none";
        startPlay();
      }, 500);
    }
  }, 1000);
}


// =======================
// START PLAY
// =======================
function startPlay() {
  gameOver = false;
  startTime = performance.now();
  spawnLoop();
  update();
}


// =======================
// OBSTACLE LOOP
// =======================
function spawnLoop() {
  if (gameOver) return;
  spawnObstacle();
  spawnTimer = setTimeout(spawnLoop, 800);
}


// =======================
// CREATE OBSTACLE
// =======================
function spawnObstacle() {
  const obs = document.createElement("div");
  obs.className = "obstacle";
  obs.style.left = Math.random() * (gameWidth - 48) + "px";
  game.appendChild(obs);

  let y = -32;

  const fall = setInterval(() => {
    if (gameOver) {
      clearInterval(fall);
      obs.remove();
      return;
    }

    y += speed;
    obs.style.top = y + "px";

    // COLLISION
    const p = player.getBoundingClientRect();
    const o = obs.getBoundingClientRect();

    if (
      p.left < o.right &&
      p.right > o.left &&
      p.top < o.bottom &&
      p.bottom > o.top
    ) {
      endGame();
    }

    // REMOVE IF OUTSIDE
    if (y > window.innerHeight) {
      clearInterval(fall);
      obs.remove();
      speed += 0.15;
    }

  }, 16);
}


// =======================
// UPDATE PLAYER + TIME
// =======================
function update() {
  if (gameOver) return;

  playerX = Math.max(0, Math.min(gameWidth - player.offsetWidth, playerX));
  player.style.left = playerX + "px";

  const currentTime = (performance.now() - startTime) / 1000;
  timeEl.innerText = `Time: ${currentTime.toFixed(2)}s`;

  animationId = requestAnimationFrame(update);
}


// =======================
// GAME OVER
// =======================
function endGame() {
  if (gameOver) return;

  gameOver = true;
  cancelAnimationFrame(animationId);
  clearTimeout(spawnTimer);

  const finalTime = (performance.now() - startTime) / 1000;

  // SAVE BEST
  if (finalTime > bestTime) {
    bestTime = finalTime;
    localStorage.setItem("bestTime", bestTime);
  }

  bestTimeEl.innerText = `Best: ${bestTime.toFixed(2)}s`;

  // HIỆN GAME OVER
  finalTimeEl.innerText = finalTime.toFixed(2);

  // ✅ BẮT BUỘC THÊM 2 DÒNG NÀY
  gameOverBox.style.display = "flex";
  gameOverBox.style.zIndex = "9999";
_toggleDebug();
}

function _toggleDebug(){
  console.log("GAME OVER BOX SHOWING");
}