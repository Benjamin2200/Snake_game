// ===== GAME SETUP =====
const canvas =
    document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const gridSize = 20;
const tileCount = canvas.width / gridSize;
const highScoreKey = "snakeHighScore";

// ===== INITIAL STATE =====
let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];
let direction = { x: 1, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let highScore = Number(localStorage.getItem(highScoreKey)) || 0;
let gameLoop = null;
let isPaused = false;
let gameStarted = false;

// ===== DRAWING =====
const drawGame = () => {
    ctx.clearRect(0, 0,
        canvas.width, canvas.height);

    ctx.fillStyle = "#dc2626";
    ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize, gridSize
    );

    for (let index = 0; index < snake.length; index++) {
        const segment = snake[index];
        ctx.fillStyle = index === 0 ? "#14532d" : "#16a34a";
        ctx.fillRect(
            segment.x * gridSize,
            segment.y * gridSize,
            gridSize, gridSize
        );
    }

    info.textContent =
        `Score: ${score} | High score: ${highScore}`;
};

const endGame = () => {
    clearInterval(gameLoop);
    gameLoop = null;
    isPaused = false;
    gameStarted = false;
    pauseButton.textContent = "Pause";
    pauseButton.disabled = true;
    info.classList.add("game-over");
    info.textContent =
        `Game over! Final score: ${score} | High score: ${highScore}`;
};

const generateFoodPosition = () => {
    let position;

    do {
        position = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (
        snake.some(
            (segment) =>
                segment.x === position.x && segment.y === position.y
        )
    );

    return position;
};

const gameTick = () => {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
    ) {
        endGame();
        return;
    }

    const collidedWithSnake = snake.some(
        (segment) => segment.x === head.x && segment.y === head.y
    );

    if (collidedWithSnake) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFoodPosition();
        score++;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem(highScoreKey, highScore);
        }
        startLoop();
    } else {
        snake.pop();
    }

    drawGame();
};

const getGameInterval = () => {
    if (score >= 15) {
        return 110;
    }
    if (score >= 10) {
        return 140;
    }
    if (score >= 5) {
        return 170;
    }
    return 200;
};

const startLoop = () => {
    if (gameLoop !== null) {
        clearInterval(gameLoop);
    }
    gameLoop = setInterval(gameTick, getGameInterval());
};

const startGame = () => {
    if (gameLoop !== null) {
        clearInterval(gameLoop);
    }

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    food = generateFoodPosition();
    score = 0;
    isPaused = false;
    gameStarted = true;
    pauseButton.textContent = "Pause";
    pauseButton.disabled = false;
    info.classList.remove("game-over");
    drawGame();
    startLoop();
};

const togglePause = () => {
    if (!gameStarted || (!isPaused && gameLoop === null)) {
        return;
    }

    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameLoop);
        gameLoop = null;
    } else {
        startLoop();
    }
    pauseButton.textContent = isPaused ? "Resume" : "Pause";
};

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction.y !== 1) {
        direction = { x: 0, y: -1 };
    } else if (event.key === "ArrowDown" && direction.y !== -1) {
        direction = { x: 0, y: 1 };
    } else if (event.key === "ArrowLeft" && direction.x !== 1) {
        direction = { x: -1, y: 0 };
    } else if (event.key === "ArrowRight" && direction.x !== -1) {
        direction = { x: 1, y: 0 };
    } else if (event.code === "Space") {
        event.preventDefault();
        togglePause();
    }
});

startButton.addEventListener(
    "click",
    startGame
);
document.getElementById("restartButton").addEventListener(
    "click",
    startGame
);
pauseButton.addEventListener(
    "click",
    togglePause
);

drawGame();
info.textContent = "Click Start Game to begin";
pauseButton.disabled = true;
