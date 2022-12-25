const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//ボールの設定
function init(){
    wait = true;
    paddleX = (canvas.width - paddleWidth) / 2;
    ball_x = canvas.width/2;
    ball_y = canvas.height - paddleHeight - ballRadius;
    ballColor = 'hsl(200, 100%, 50%)';
}

//パドルの設定
const paddleHeight = 12;
const paddleWidth = 72;
let paddleX = (canvas.width - paddleWidth) / 2;

//ボールの設定
const ballRadius = 8;
let ballColor = 'hsl(200, 100%, 50%)';

let ball_x = canvas.width/2;
let ball_y = canvas.height - paddleHeight - ballRadius;
let dx = 0;
let dy = 0;

let ball_speed = 3;

let theta = 0;
let d_theta = Math.PI / 150;
function ballSpeed(){
    ctx.beginPath();
    ctx.setLineDash([2, 5]);
    ctx.moveTo(canvas.width/2, canvas.height - paddleHeight - ballRadius);
    ctx.lineTo(canvas.width/2 + (Math.sin(theta) * 60), canvas.height - paddleHeight - ballRadius - (Math.cos(theta) * 60));
    ctx.strokeStyle = "#0000cd";
    ctx.stroke();
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
    ctx.font = "16px Arial"
    ctx.fillStyle = livesColor;
    ctx.fillText(`Life: ${life}`, canvas.width - 65, 20);
}

//ボール描画
function drawBall(){
    if (!wait){
        ball_x += dx;
        ball_y += dy;
    }
    ctx.beginPath();
    ctx.arc(ball_x, ball_y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function changeBallColor(){
    let hue = Math.floor(Math.random() * 361);
    ballColor = `hsl(${hue}, 100%, 50%)`;
}

//パドル描画
let paddleColor = "blue";
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}
function changePaddleColor(){
    let hue = Math.floor(Math.random()*360);
    paddleColor = `hsl(${hue}, 100%, 50%`;
}

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
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
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
                        document.location.reload();
                        clearInterval(interval);
                    }
            }
        }
    }
}

let score = 0;

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD"
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    //待機中 or プレイ中
    if (wait){
        ballSpeed();
        init();
    }
    drawBall();

    //壁の衝突判定
    if (ball_x + ballRadius> canvas.width|| ball_x - ballRadius< 0){
        dx = -dx;
    }
    if (ball_y - ballRadius < 0){
        dy = -dy;
    }

    //パドルの角の衝突判定
    if (Math.pow(paddleX-ball_x, 2) + Math.pow(canvas.height - paddleHeight, 2) <= Math.pow(ballRadius, 2)){
        dx = -dx;
        dy = -dy;
        ball_y = canvas.height - paddleHeight - 1;
    }

    //パドルの上部の衝突判定
    if (ball_y > canvas.height - paddleHeight){
        if(Math.abs(paddleX - ball_x) <= ballRadius){
            dx = -dx;
            ball_x = paddleX - 1 - ballRadius;
            //console.log('横1');
        }else if(Math.abs(ball_x - paddleX - paddleWidth) <= ballRadius){
            ball_x = paddleX + paddleWidth + 1 + ballRadius;
            dx = -dx;
            //console.log('横2');
        }
    }else if (ball_y + ballRadius > canvas.height - paddleHeight && ball_x + ballRadius > paddleX && ball_x - ballRadius < paddleX + paddleWidth){
        dy = -dy;
        //console.log('上');
        // changePaddleColor();
    }

    drawPaddle();


    if ((ball_y + ballRadius > canvas.height)){
        life -= 1;
        if(life <= 0){
            alert(`ゲームオーバー, スコアは${score}点`);
            document.location.reload();
            clearInterval(interval);
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
        paddleX = Math.min(paddleX + 4, canvas.width - paddleWidth -5);
    }else if (leftPressed){
        paddleX = Math.max(paddleX - 4, 5);
    }
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();
    
}

document.addEventListener("keydown", KeyPressHandler, false);
function KeyPressHandler(e){
    //console.log(wait, e);
    if (e.key === " "){
        wait = false;
    }
}
const interval = setInterval(draw, 10);