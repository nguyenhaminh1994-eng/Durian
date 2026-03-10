const game = document.getElementById("game");
const player = document.getElementById("player");

const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");

const timeEl = document.getElementById("time");
const finalTimeEl = document.getElementById("finalTime");

const gameOverBox = document.getElementById("gameOverBox");
const restartBtn = document.getElementById("restartBtn");

const countdownEl = document.getElementById("countdown");
const bestTimeEl = document.getElementById("bestTime");

let playerX = window.innerWidth / 2;

let obstacles = [];

let gameRunning = false;

let startTime = 0;

let bestTime = Number(localStorage.getItem("bestTime")) || 0;
bestTimeEl.innerText = `Best: ${bestTime.toFixed(2)}s`;

player.style.left = playerX + "px";

function movePlayer(x){
if(!gameRunning) return;

playerX = x - 40; // 40 = nửa kích thước player (80px)
player.style.left = playerX + "px";
}

/* điều khiển bằng chuột */
document.addEventListener("mousemove", e=>{
movePlayer(e.clientX);
});

/* điều khiển bằng chạm màn hình */
document.addEventListener("touchmove", e=>{
movePlayer(e.touches[0].clientX);
});

startBtn.onclick = ()=>{
startScreen.style.display="none";
countdown();
};

restartBtn.onclick = ()=>{
location.reload();
};

function countdown(){

let count = 3;
countdownEl.style.display="block";
countdownEl.innerText = count;

let timer = setInterval(()=>{

count--;
countdownEl.innerText = count;

if(count<=0){
clearInterval(timer);
countdownEl.style.display="none";
startGame();
}

},1000);

}

function startGame(){

gameRunning = true;

startTime = Date.now();

spawnLoop();

gameLoop();

}

function spawnLoop(){

if(!gameRunning) return;

spawnObstacle();

setTimeout(spawnLoop,800 + Math.random()*600);

}

function spawnObstacle(){

for(let i=0;i<1;i++){   // số boom spawn

const obstacle = document.createElement("div");

obstacle.classList.add("obstacle");

obstacle.style.left = Math.random() * (window.innerWidth-60) + "px";

game.appendChild(obstacle);

obstacles.push(obstacle);

}
}

function gameLoop(){

if(!gameRunning) return;

let now = Date.now();

let time = (now - startTime)/1000;

timeEl.innerText = "Time: " + time.toFixed(2) + "s";

obstacles.forEach((obs,index)=>{

let top = obs.offsetTop;

obs.style.top = top + 7 + "px";

if(checkCollision(player,obs)){

endGame(time);

}

if(top > window.innerHeight){

obs.remove();
obstacles.splice(index,1);

}

});

requestAnimationFrame(gameLoop);

}

function checkCollision(a,b){

const r1 = a.getBoundingClientRect();
const r2 = b.getBoundingClientRect();

return !(

r1.top > r2.bottom ||
r1.bottom < r2.top ||
r1.left > r2.right ||
r1.right < r2.left

);

}

function endGame(time){

gameRunning = false;

finalTimeEl.innerText = time.toFixed(2);

gameOverBox.style.display="block";

if(time > bestTime){

bestTime = time;

localStorage.setItem("bestTime",bestTime);

bestTimeEl.innerText = `Best: ${bestTime.toFixed(2)}s`;

}

}