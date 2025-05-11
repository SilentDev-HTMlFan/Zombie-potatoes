// Game elements
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

// Player object
const player = {
    x: 400,
    y: 250,
    size: 30,
    speed: 5,
    color: '#FF5733',
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false
};

// Game state
let potatoes = [];
let zombies = [];
let score = 0;
let gameTime = 0;
let gameInterval;
let isGameRunning = false;

// Initialize game
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    isGameRunning = true;
    score = 0;
    gameTime = 0;
    potatoes = [];
    zombies = [];
    
    // UI Reset
    document.getElementById('potatoCount').textContent = '0';
    document.getElementById('zombieCount').textContent = '0';
    document.getElementById('time').textContent = '0';
    
    // Create initial potatoes
    for(let i = 0; i < 10; i++) {
        spawnPotato();
    }
    
    // Start game loop
    gameInterval = setInterval(updateGame, 20);
    
    // Start timer
    setInterval(updateTimer, 1000);
}

function updateTimer() {
    if(isGameRunning) {
        gameTime++;
        document.getElementById('time').textContent = gameTime;
    }
}

// Game loop
function updateGame() {
    if(!isGameRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move player
    updatePlayerPosition();
    
    // Draw game elements
    drawPlayer();
    updatePotatoes();
    updateZombies();
}

function updatePlayerPosition() {
    if(player.moveUp) player.y -= player.speed;
    if(player.moveDown) player.y += player.speed;
    if(player.moveLeft) player.x -= player.speed;
    if(player.moveRight) player.x += player.speed;
    
    // Boundary check
    player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();
}

function updatePotatoes() {
    potatoes.forEach((potato, index) => {
        if(checkCollision(player, potato)) {
            potatoes.splice(index, 1);
            score++;
            document.getElementById('potatoCount').textContent = score;
            spawnPotato();
            if(score % 5 === 0) spawnZombie();
        }
        drawPotato(potato);
    });
}

function updateZombies() {
    zombies.forEach(zombie => {
        chasePlayer(zombie);
        if(checkCollision(player, zombie)) {
            gameOver();
        }
        drawZombie(zombie);
    });
}

// Helper functions
function checkCollision(obj1, obj2) {
    const dist = Math.sqrt(
        Math.pow(obj1.x - obj2.x, 2) + 
        Math.pow(obj1.y - obj2.y, 2)
    );
    return dist < obj1.size + obj2.size;
}

function drawPotato(potato) {
    ctx.fillStyle = '#f4d03f';
    ctx.beginPath();
    ctx.arc(potato.x, potato.y, potato.size, 0, Math.PI * 2);
    ctx.fill();
}

function drawZombie(zombie) {
    ctx.fillStyle = '#27ae60';
    ctx.beginPath();
    ctx.arc(zombie.x, zombie.y, zombie.size, 0, Math.PI * 2);
    ctx.fill();
}

function spawnPotato() {
    potatoes.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: Math.random() * (canvas.height - 40) + 20,
        size: 15
    });
}

function spawnZombie() {
    zombies.push({
        x: Math.random() < 0.5 ? 0 : canvas.width,
        y: Math.random() * canvas.height,
        size: 25,
        speed: 1 + Math.random() * 1
    });
    document.getElementById('zombieCount').textContent = zombies.length;
}

function chasePlayer(zombie) {
    const angle = Math.atan2(player.y - zombie.y, player.x - zombie.x);
    zombie.x += Math.cos(angle) * zombie.speed;
    zombie.y += Math.sin(angle) * zombie.speed;
}

function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    alert(`Game Over!\nYou collected ${score} potatoes in ${gameTime} seconds!`);
    document.getElementById('startScreen').style.display = 'block';
}

// Event listeners
startButton.addEventListener('click', startGame);

window.addEventListener('keydown', (e) => {
    if(!isGameRunning) return;
    switch(e.key) {
        case 'ArrowUp': player.moveUp = true; break;
        case 'ArrowDown': player.moveDown = true; break;
        case 'ArrowLeft': player.moveLeft = true; break;
        case 'ArrowRight': player.moveRight = true; break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'ArrowUp': player.moveUp = false; break;
        case 'ArrowDown': player.moveDown = false; break;
        case 'ArrowLeft': player.moveLeft = false; break;
        case 'ArrowRight': player.moveRight = false; break;
    }
});