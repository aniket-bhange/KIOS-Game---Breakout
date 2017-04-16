var canvas, canvasContex, ballRadius = 20;

window.addEventListener("load", function(event) {
    var x, y, dx = 2, dy = -2, paddleHeight = 10, paddleWidth = 75
    , paddleX, rightPressed = false, leftPressed = false, bricks = [], drawHandler,
    brickRowCount = 4,
    brickColumnCount = 5,
    brickWidth = 50,
    brickHeight = 20,
    brickPadding = 10,
    brickOffsetTop = 30,
    brickOffsetLeft = 13, score=0, timer=0, timerCounter = 10, sec = 1000, magicbric = false
    , bricksPos={}, magicbricTimer = 10000;


    canvas = document.getElementById("myCanvas");
    canvasContex = canvas.getContext("2d");
    canvas.width = screen.width;
    canvas.height = screen.height-30;
    
    x = canvas.width/2;
    y = canvas.height-30;

    paddleX = (canvas.width - paddleWidth)/2;

    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1, color: "#0095DD" };
        }
    }

    function keupHandler (e) {
        if(e.keyCode == 39) {
            rightPressed = false;
        }
        else if(e.keyCode == 37) {
            leftPressed = false;
        }
        collisionDetection();
    }
    function keydownHandler (e) {
        if(e.keyCode == 39) {
            rightPressed = true;
        }
        else if(e.keyCode == 37) {
            leftPressed = true;
        }
        
    }
    document.addEventListener("keyup", keupHandler, false)
    document.addEventListener("keydown", keydownHandler, false)


    function drawBall(){
        canvasContex.beginPath();
        canvasContex.arc(x, y, ballRadius, 0, Math.PI*2, false);
        canvasContex.fillStyle = "green";
        canvasContex.fill();
        canvasContex.closePath();    
    }
    function drawPaddle() {
        canvasContex.beginPath();
        canvasContex.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        canvasContex.fillStyle = "#0095DD";
        canvasContex.fill();
        canvasContex.closePath();
    }
    function drawBricks() {
        for(c=0; c<brickColumnCount; c++) {
            for(r=0; r<brickRowCount; r++) {
                if(bricks[c][r].status == 1) {
                    var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                    var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    canvasContex.beginPath();
                    canvasContex.rect(brickX, brickY, brickWidth, brickHeight);
                    canvasContex.fillStyle = bricks[c][r].color;
                    canvasContex.fill();
                    canvasContex.closePath();
                }
            }
        }
    }
    function getRandom(arr) {
        var x = Math.floor((Math.random() * (arr.length)));
        var y = Math.floor((Math.random() * (arr[x].length)));
        return {value: arr[x][y], x: x, y: y } 
    }
    function drawTimer(){
        if(!magicbric && sec === magicbricTimer){
            magicbric = true;
            bricksPos = getRandom(bricks);
            bricksPos.value.color = "#f00";
            bricks[bricksPos.x][bricksPos.y].magicbric = true;
        }else if(magicbric && sec === (magicbricTimer + 10000)){
            bricks[bricksPos.x][bricksPos.y].color = "#0095DD";
            bricks[bricksPos.x][bricksPos.y].magicbric = false;
            magicbricTimer += 10000;
            magicbric = false;
        }

        if(timerCounter == sec){
            timer += 1;
            sec += 1000;    
        }

        canvasContex.font = "16px Arial";
        canvasContex.fillStyle = "#f00";
        canvasContex.fillText("Timer: "+timer+" Sec", screen.width-100, 20)    
        timerCounter += 10;
    }
    function drawScore() {
        canvasContex.font = "16px Arial";
        canvasContex.fillStyle = "#0095DD";
        canvasContex.fillText("Score: "+score, 8, 20);
    }
    function collisionDetection() {
        for(c=0; c<brickColumnCount; c++) {
            for(r=0; r<brickRowCount; r++) {
                var b = bricks[c][r];
                if(b.status == 1) {
                    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if(b.magicbric){
                            score += 10;
                        }
                        if(score == brickRowCount*brickColumnCount) {
                            alert("YOU WIN, CONGRATULATIONS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function draw () {
        canvasContex.clearRect(0, 0, canvas.width, canvas.height);

        drawBall();
        drawPaddle();
        drawTimer();
        collisionDetection();
        drawScore();
        drawBricks();

        x += dx;
        y += dy;

        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }

        if(y + dy < ballRadius) {
            dy = -dy;
        } else if(y + dy > canvas.height-ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                alert("GAME OVER "+ score);
                clearInterval(drawHandler);
                document.location.reload();
            }
        }

        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        }
    }

    drawHandler = setInterval(draw, 10);
    // setInterval(drawTimer, 1000);
    
})

