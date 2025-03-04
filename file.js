document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const menu = document.getElementById("menu");
    const gameCanvas = document.getElementById("gameCanvas");
    const gameStats = document.getElementById("gameStats");
    const gameOverID = document.getElementById("gameOverID");
    const startButton = document.getElementById("startButton");
    const restartButton = document.getElementById("restartButton");
    const scoreElement = document.getElementById("score");
    const livesElement = document.getElementById("lives");
    const finalScoreSpan = document.getElementById("finalScore");

    const ctx = gameCanvas.getContext("2d");

    // Game variables
    let ball, paddle, bricks, score, lives, animationId;
    let rightPressed = false;
    let leftPressed = false;

    // Brick properties
    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    function initGame() {
        ball = { 
            x: gameCanvas.width / 2, 
            y: gameCanvas.height - 30, 
            dx: 2, dy: -2, radius: 10 
        };

        paddle = { 
            x: (gameCanvas.width - 75) / 2, 
            y: gameCanvas.height - 10, 
            width: 75, height: 10 
        };

        // Initialize bricks
        bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { 
                    x: c * (brickWidth + brickPadding) + brickOffsetLeft, 
                    y: r * (brickHeight + brickPadding) + brickOffsetTop, 
                    status: 1 
                };
            }
        }

        score = 0;
        lives = 3;
        updateScore();
        updateLives();
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    function updateLives() {
        livesElement.textContent = `Lives: ${lives}`;
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#00dd25";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    ctx.beginPath();
                    ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                    ctx.fillStyle = "#5f2dbd#";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    if (ball.x > b.x && ball.x < b.x + brickWidth &&
                        ball.y > b.y && ball.y < b.y + brickHeight) {
                        ball.dy = -ball.dy;
                        b.status = 0;
                        score++;
                        updateScore();
                        if (score === brickRowCount * brickColumnCount) {
                            alert("YOU WIN, CONGRATULATIONS!");
                            gameOver();
                        }
                    }
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();

        // Ball collision with walls
        if (ball.x + ball.dx > gameCanvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < ball.radius) {
            ball.dy = -ball.dy;
        } else if (ball.y + ball.dy > gameCanvas.height - ball.radius) {
            if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                ball.dy = -ball.dy;
            } else {
                lives--;
                updateLives();
                if (!lives) {
                    gameOver();
                    return;
                } else {
                    ball.x = gameCanvas.width / 2;
                    ball.y = gameCanvas.height - 30;
                    ball.dx = 2;
                    ball.dy = -2;
                    paddle.x = (gameCanvas.width - paddle.width) / 2;
                }
            }
        }

        // Move paddle
        if (rightPressed && paddle.x < gameCanvas.width - paddle.width) {
            paddle.x += 7;
        } else if (leftPressed && paddle.x > 0) {
            paddle.x -= 7;
        }

        ball.x += ball.dx;
        ball.y += ball.dy;

        animationId = requestAnimationFrame(draw);
    }

    function startGame() {
        menu.style.display = "none";
        gameCanvas.style.display = "block";
        gameStats.style.display = "block";
        gameOverID.style.display = "none";
        initGame();
        draw();
    }

    function gameOver() {
        cancelAnimationFrame(animationId);
        gameCanvas.style.display = "none";
        gameStats.style.display = "none";
        gameOverID.style.display = "block";
        finalScoreSpan.textContent = score;
    }

    // Event listeners for movement with Arrow keys & WASD
    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
            rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
            leftPressed = false;
        }
    }

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", startGame);
});
