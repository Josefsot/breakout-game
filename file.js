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

    // Update canvas size
    gameCanvas.width = 640;
    gameCanvas.height = 480;

    // Game variables
    let balls, paddle, bricks, score, lives, animationId, level;
    let rightPressed = false;
    let leftPressed = false;

    // Brick properties
    const brickWidth = 100;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 50;
    const brickOffsetLeft = 50;

    function initGame() {
        level = 1;
        score = 0;
        lives = 3;
        initLevel();
        updateScore();
        updateLives();
    }

    function initLevel() {
        // Initialize balls
        balls = [
            { x: gameCanvas.width / 2, y: gameCanvas.height - 30, dx: 1.8, dy: -1.8, radius: 10, color: "#00dd25" }
        ];
        if (level > 1) {
            balls.push({ x: gameCanvas.width / 2, y: gameCanvas.height - 50, dx: -1.8, dy: -1.8, radius: 10, color: "#ff6600" });
        }

        // Initialize paddle
        paddle = {
            x: (gameCanvas.width - 100) / 2,
            y: gameCanvas.height - 10,
            width: 100,
            height: 10
        };

        // Initialize bricks
        const brickRowCount = 3 + (level - 1); // Add one row per level
        const brickColumnCount = 5;
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
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    function updateLives() {
        livesElement.textContent = `Lives: ${lives}`;
    }

    function drawBall(ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
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
        for (let c = 0; c < bricks.length; c++) {
            for (let r = 0; r < bricks[c].length; r++) {
                if (bricks[c][r].status === 1) {
                    ctx.beginPath();
                    ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                    ctx.fillStyle = "#5f2dbd";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function collisionDetection() {
        for (let c = 0; c < bricks.length; c++) {
            for (let r = 0; r < bricks[c].length; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    balls.forEach((ball) => {
                        if (
                            ball.x > b.x &&
                            ball.x < b.x + brickWidth &&
                            ball.y > b.y &&
                            ball.y < b.y + brickHeight
                        ) {
                            ball.dy = -ball.dy;
                            b.status = 0;
                            score++;
                            updateScore();

                            // Check if all bricks are cleared
                            if (score === bricks.flat().filter((brick) => brick.status === 1).length) {
                                level++;
                                initLevel();
                            }
                        }
                    });
                }
            }
        }
    }

    // Load the background image
    const backgroundImage = new Image();
    backgroundImage.src = "Images/breakoutspritepic.png"; // Update the path to your image

    function drawBackground() {
        ctx.drawImage(backgroundImage, 0, 0, gameCanvas.width, gameCanvas.height);
    }

    function draw() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw the background
        drawBackground();

        // Draw game elements
        drawBricks();
        balls.forEach(drawBall);
        drawPaddle();
        collisionDetection();

        // Ball collision with walls and paddle
        balls.forEach((ball) => {
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
                        initLevel();
                    }
                }
            }

            ball.x += ball.dx;
            ball.y += ball.dy;
        });

        // Move paddle
        if (rightPressed && paddle.x < gameCanvas.width - paddle.width) {
            paddle.x += 7;
        } else if (leftPressed && paddle.x > 0) {
            paddle.x -= 7;
        }

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
