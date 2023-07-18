// Board
let board;
let boardWidth = 900;
let boardHeight = 504;
let context;

// Bird
let birdWidth = 34; 
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// Start screen
let startScreen;
let startButton;

// Score board
let scoreBoard;
let finalScore;
let tryAgainButton;

// Pipes
let pipeArray = [];
let pipeWidth = 64; 
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Physics
let velocityX = -2; // Pipes moving left speed
let velocityY = 0; // Bird jump speed
let gravity = 0.3;

let isGameOver = false;
let score = 0;

window.onload = function() {
  

    startScreen = document.getElementById("startScreen");
    startButton = document.getElementById("startButton");
    scoreBoard = document.getElementById("scoreBoard");
    finalScore = document.getElementById("finalScore");
    tryAgainButton = document.getElementById("tryAgainButton");
    startButton.addEventListener("click", startGame);

    startButton.addEventListener("click", startGame);
    tryAgainButton.addEventListener("click", tryAgain);


    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    
    document.addEventListener("keydown", moveBird);
    
};

function update() {
    requestAnimationFrame(update);
    if (isGameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver();
    }

    // Pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 10;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver();
        }
    }

    // Clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Score
    context.fillStyle = "black";
    context.font = "20px sans-serif";
    context.fillText(score, 5, 45);

    if (isGameOver) {
        
        showScoreBoard();
    }
}

function placePipes() {
    if (isGameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (isGameOver) {
        return;
    }

    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        // jump
        velocityY = -6;
    }

}

function detectCollision(a, b) {
    return a.x <= b.x + b.width &&
           a.x + a.width >= b.x &&
           a.y <= b.y + b.height &&
           a.y + a.height >= b.y;
}

function startGame() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    board.style.display = "none";
    startScreen.style.display = "none";
    scoreBoard.style.display = "none";
    board.style.display = "block"; // Show the game canvas
    
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };
    resetGame();
}
function gameOver() {
    isGameOver = true;
    board.style.display = "block";
    scoreBoard.style.display = "block";
    finalScore.textContent = "Final Score: " + score;
}

function tryAgain() {
    scoreBoard.style.display = "none";
    startScreen.style.display = "none"; // Hide the start screen
    board.style.display = "block"; // Show the game canvas
    resetGame();
}


function resetGame() {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    isGameOver = false;
}

function showScoreBoard() {
    scoreBoard.style.display = "block";
    finalScore.textContent = "Final Score: " + score;
}
