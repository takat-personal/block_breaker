const gameScene = document.getElementById("game");
const gameCanvas = document.getElementById("game_canvas");
const gameCtx = gameCanvas.getContext("2d");

const titleScene = document.getElementById("title");
const titleCanvas = document.getElementById("title_canvas");
const titleCtx = titleCanvas.getContext("2d");

//シーンの切り替え
function changeScene(scene){
    if(scene=="title"){
        titleScene.hidden = false;
        gameScene.hidden = true;
        titleInterval = setInterval(draw4title, 10);
    }else if(scene=="game"){
        titleScene.hidden = true;
        gameScene.hidden = false;
        gameInterval = setInterval(draw, 10);
    }
}

//インターバル用変数
let titleInterval;
let gameInterval;

changeScene("title");

//タイトル画面
function drawTitleBasis(){
    Rounded_Rect(340, 70, 110, 20, 10, "white", "black");
    Rounded_Rect(340, 160, 110, 20, 10, "white", "black");
    Rounded_Rect(340, 250, 110, 20, 10, "white", "black");
    titleCtx.textAlign = "center";
    titleCtx.font = "italic bold 25px sans-serif";
    titleCtx.fillStyle = "black";
    titleCtx.fillText("Block Breaker", 115, 255);
    titleCtx.font = "italic bold 20px sans-serif";
    titleCtx.fillText("Easy", 340, 77);
    titleCtx.fillText("Normal", 340, 167);
    titleCtx.fillText("Hard", 340, 257);
    titleCtx.drawImage(image, 30, 30, 150, 150);
}

//画像読み込み
const image = new Image();
image.src = "";

function Rounded_Rect(cx, cy, w, h, r, fColor, sColor){
    titleCtx.beginPath();
    titleCtx.strokeStyle = sColor;
    titleCtx.fillStyle = fColor;
    titleCtx.moveTo(cx - w, cy - h + r);
    titleCtx.arc(cx - w + r, cy + h - r, r, Math.PI, Math.PI*0.5, true);
    titleCtx.arc(cx + w - r, cy + h - r, r, Math.PI * 0.5, 0, true);
    titleCtx.arc(cx + w -r, cy - h + r, r, 0, Math.PI * 1.5, true);
    titleCtx.arc(cx - w + r, cy - h + r, r, Math.PI * 1.5, Math.PI, true);
    titleCtx.closePath();
    titleCtx.stroke();
    titleCtx.fill();
}

let level = 0;
document.addEventListener('keydown', LevelChange, false);
function LevelChange(e){
    if(e.key === "ArrowDown"){
        level += 1;
        if(level >= 3){
            level = 0;
        }
    }
    if(e.key === "ArrowUp"){
        level -= 1;
        if(level < 0){
            level = 2;
        }
    }
    if(e.key ==="Enter"){
        changeScene("game");
    }
}

function draw4title(){
    titleCtx.clearRect(0,0,titleCanvas.width, titleCanvas.height);
    Rounded_Rect(340, 70 + 90 * level, 120, 30, 10, "#e3c5f0", "#e3c5f0");
    drawTitleBasis();
}

//ボールの設定
function init(){
    wait = true;
    paddleX = (gameCanvas.width - paddleWidth) / 2;
    ball_x = gameCanvas.width/2;
    ball_y = gameCanvas.height - paddleHeight - ballRadius;
    ballColor = 'hsl(200, 100%, 50%)';
    if(level == 0){
        ball_speed = 2;
    }else if(level == 1){
        ball_speed = 3;
    }else{
        ball_speed = 4;
    }
}

//パドルの設定
const paddleHeight = 12;
const paddleWidth = 72;
let paddleX = (gameCanvas.width - paddleWidth) / 2;

//ボールの設定
const ballRadius = 8;
let ballColor = 'hsl(200, 100%, 50%)';

let ball_x = gameCanvas.width/2;
let ball_y = gameCanvas.height - paddleHeight - ballRadius;
let dx = 0;
let dy = 0;

//ボールの速度
let ball_speed = 3;

let theta = 0;
let d_theta = Math.PI / 150;
function BallVector(){
    gameCtx.beginPath();
    gameCtx.setLineDash([2, 5]);
    gameCtx.moveTo(gameCanvas.width/2, gameCanvas.height - paddleHeight - ballRadius);
    gameCtx.lineTo(gameCanvas.width/2 + (Math.sin(theta) * 60), gameCanvas.height - paddleHeight - ballRadius - (Math.cos(theta) * 60));
    gameCtx.strokeStyle = "#0000cd";
    gameCtx.stroke();
    if (theta > Math.PI / 3 || theta < -Math.PI / 3){
        d_theta = -d_theta
    }
    theta += d_theta;
    dx = ball_speed * Math.sin(theta);
    dy = - ball_speed * Math.cos(theta);
}
//待機
let wait = true;
//console.log(wait);

// キーボードの入力
let rightPressed = false;
let leftPressed = false;

//残機
let life = 3;
let livesColor = "#0095DD";
function drawLives(){
    gameCtx.font = "16px Arial"
    gameCtx.fillStyle = livesColor;
    gameCtx.fillText(`Life: ${life}`, gameCanvas.width - 65, 20);
}

//ボール描画
function drawBall(){
    if (!wait){
        ball_x += dx;
        ball_y += dy;
    }
    gameCtx.beginPath();
    gameCtx.arc(ball_x, ball_y, ballRadius, 0, Math.PI*2);
    gameCtx.fillStyle = ballColor;
    gameCtx.fill();
    gameCtx.closePath();
}

function changeBallColor(){
    let hue = Math.floor(Math.random() * 361);
    ballColor = `hsl(${hue}, 100%, 50%)`;
}

//パドル描画
let paddleColor = "blue";
function drawPaddle(){
    gameCtx.beginPath();
    gameCtx.rect(paddleX, gameCanvas.height - paddleHeight, paddleWidth, paddleHeight);
    gameCtx.fillStyle = paddleColor;
    gameCtx.fill();
    gameCtx.closePath();
}
function changePaddleColor(){
    let hue = Math.floor(Math.random()*360);
    paddleColor = `hsl(${hue}, 100%, 50%`;
}

//キー入力を受けとる。
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e){
    if(!wait){
        if (e.key === "Right" || e.key === "ArrowRight"){
            rightPressed = true; 
        }else if (e.key === "left" || e.key === "ArrowLeft"){
            leftPressed = true;
        }
    }
    if (gameScene.hidden == false && e.key === " "){
        wait = false;
    }
}

function keyUpHandler(e){
    if (e.key === "Right" || e.key === "ArrowRight"){
        rightPressed = false; 
    }else if (e.key === "left" || e.key === "ArrowLeft"){
        leftPressed = false;
    }
}

const brickRowCount = 4;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c ++){
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r ++){
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

function drawBricks(){
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1){
                let brickX = (c *(brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r *(brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                gameCtx.beginPath();
                gameCtx.rect(brickX, brickY, brickWidth, brickHeight);
                gameCtx.fillStyle = "#0095DD";
                gameCtx.fill();
                gameCtx.closePath();
            }
        }
    }
}

function collisionDetection(){
    for (let c = 0; c < brickColumnCount; c ++){
        for (let r = 0; r< brickRowCount; r ++){
            const b = bricks[c][r];
            if (b.status == 1){
                if (ball_x > b.x && ball_x < b.x + brickWidth && (Math.abs(ball_y - b.y - brickHeight) <= ballRadius || Math.abs(ball_y - b.y) <= ballRadius)){
                    dy= -dy;
                    b.status = 0;
                    // changeBallColor();
                    score++;
                }else if(ball_y > b.y && ball_y < b.y + brickHeight && (Math.abs(ball_x - b.x) <= ballRadius || Math.abs(ball_x - b.x - brickWidth) <= ballRadius)){
                    dx = -dx;
                    b.status = 0;
                    score++;
                    // changeBallColor();
                }
                if (score === brickRowCount * brickColumnCount){
                        alert("Congratulations!");
                        clearInterval(gameInterval);
                        document.location.reload();
                    }
            }
        }
    }
}

let score = 0;

function drawScore(){
    gameCtx.font = "16px Arial";
    gameCtx.fillStyle = "#0095DD"
    gameCtx.fillText(`Score: ${score}`, 8, 20);
}

function draw(){
    gameCtx.clearRect(0,0,gameCanvas.width, gameCanvas.height);
    //待機中 or プレイ中
    if (wait){
        BallVector();
    }

    drawBall();

    //壁の衝突判定
    if (ball_x + ballRadius> gameCanvas.width|| ball_x - ballRadius< 0){
        dx = -dx;
    }
    if (ball_y - ballRadius < 0){
        dy = -dy;
    }

    //パドルの角の衝突判定
    if (Math.pow(paddleX-ball_x, 2) + Math.pow(gameCanvas.height - paddleHeight, 2) <= Math.pow(ballRadius, 2)){
        dx = -dx;
        dy = -dy;
        ball_y = gameCanvas.height - paddleHeight - 1;
    }

    //パドルの上部の衝突判定
    if (ball_y > gameCanvas.height - paddleHeight){
        if(Math.abs(paddleX - ball_x) <= ballRadius){
            dx = -dx;
            ball_x = paddleX - 1 - ballRadius;
            //console.log('横1');
        }else if(Math.abs(ball_x - paddleX - paddleWidth) <= ballRadius){
            ball_x = paddleX + paddleWidth + 1 + ballRadius;
            dx = -dx;
            //console.log('横2');
        }
    }else if (ball_y + ballRadius > gameCanvas.height - paddleHeight && ball_x + ballRadius > paddleX && ball_x - ballRadius < paddleX + paddleWidth){
        dy = -dy;
        //console.log('上');
        // changePaddleColor();
    }

    drawPaddle();


    if ((ball_y + ballRadius > gameCanvas.height)){
        life -= 1;
        
        if(life <= 0){
            alert(`ゲームオーバー, スコアは${score}点`);
            clearInterval(gameInterval);
            document.location.reload();
        }else{
            if(life == 2){
                livesColor = "#ff8c00";
            }else{
                livesColor = "#ff0000";
            }
            init();
        }
    }

    if (rightPressed){
        paddleX = Math.min(paddleX + 4, gameCanvas.width - paddleWidth -5);
    }else if (leftPressed){
        paddleX = Math.max(paddleX - 4, 5);
    }
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();
    
}