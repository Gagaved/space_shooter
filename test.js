var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = 1000;
let WIDTH = canvas.width;
let HEIGHT = canvas.height;
let dx;
let dy;
let scoreRecord = 0;
let score = 0;
let healthBar = "❤️❤️❤️"
let arrayStars = [];
let playerShoots = [];
let enemyesShoots = [];
let enemyes = [];
isGameStart = false;
isGameEnd = false;
shootTimer = 0;
bossFight = false;
bossIsCreated = false;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 20, 30);
}

function drawD() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("dx: " + dx + ' dy:' + dy, 50, 70);
}

function drawStartMenu() {
    ctx.font = "50px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("SCORE RECORD: " + scoreRecord, 80, 130);
    ctx.fillText("Tap *space* to START!", 60, 400);
}

function drawLoseMenu() {
    ctx.font = "50px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("YOU LOSE!", 80, 60);
    ctx.fillText("YOUR SCORE: " + score, 80, 160);
    ctx.fillText("SCORE RECORD: " + scoreRecord, 80, 260);
    ctx.fillText("Tap *space* to START!", 60, 410);
}

function gameEnding() {
    healthBar = "❤️❤️❤️"
    playerShoots = [];
    enemyesShoots = [];
    enemyes = [];
    enemyesT2 = [];
    isGameStart = true;
    isGameEnd = true;
    shootTimer = 0;
    bossFight = false;
    bossIsCreated = false;
}
class Model {
    constructor(spriteWay, xPosition, yPosition, width, height, health) {
        this.health = health;
        this.width = width;
        this.height = height;
        this.spriteImg = new Image();
        this.spriteImg.src = spriteWay;
        this.position = {
            x: xPosition,
            y: yPosition,
        };
    }
    draw(ctx) {
        ctx.drawImage(this.spriteImg, this.position.x, this.position.y, this.width, this.height)
    }
}
class Player extends Model {
    constructor(spriteWay, xPosition, yPosition) {
        super(spriteWay, xPosition, yPosition, 64, 64, 3);
        this.shootingPosition = {
            x: this.width / 2 - 4,
            y: 0,
        }
    }
    move(dx, dy) {
        if ((this.position.x + dx) < WIDTH - 64 && (this.position.x + dx) > 0) {
            this.position.x += dx;
        }
        if ((this.position.y + dy) < HEIGHT - 64 && (this.position.y + dy) > 0) {
            this.position.y += dy;
        }
    }
}
class Enemy extends Model {
    constructor(tier = 1) {

        if (tier == 1) {
            super("Textures/enemy_t1.png", (getRandomInt(WIDTH - 65)), -20, 64, 64, 1);
            this.rapidTime = 1;
            this.periodOfShooting = 100;
            this.ballRadius = 8;
            this.tier = 1;

        }
        if (tier == 2) {
            super("Textures/enemy_t2.png", (getRandomInt(WIDTH - 65)), -20, 64, 64, 3);
            this.rapidTime = 1;
            this.periodOfShooting = 100;
            this.ballRadius = 16;
            this.tier = 2;
        }
        if (tier == 3) {
            super("Textures/enemy_t3.png", (getRandomInt(WIDTH - 65)), -20, 128, 128, 30); //boss 1
            this.rapidTime = 200;
            this.periodOfShooting = 400;
            this.ballRadius = 8;
            this.tier = 3;
        }
        if (tier == 4) {
            super("Textures/enemy_t4.png", (getRandomInt(WIDTH - 65)), -20, 128, 128, 60); //boss 2
            this.rapidTime = 150;
            this.periodOfShooting = 200;
            this.ballRadius = 16;
            this.tier = 4;
        }
        this.spriteBallWay = "Textures/green_ball.png";
        this.shootingTimer = 0;
        this.vector = {
            xVector: 1,
            yVector: 1,
        }
        this.shootingPosition = {
            x: this.width / 2,
            y: this.height,
        }
    }
    move() {
        if (this.tier <= 2) {
            if (this.position.y < 0) {
                this.vector.yVector = 1;
            }
            if (this.position.y > 0 && this.position.y < HEIGHT / 3) {
                this.vector.yVector = 1;
            } else if (getRandomInt(60) == 1) {
                this.vector.yVector = -1;
            }
            this.position.y += this.vector.yVector;

            this.position.x += this.vector.xVector;
            if (this.position.x >= WIDTH - this.width || this.position.x <= 0) {
                this.vector.xVector *= -1;
            }
            if (getRandomInt(120) == 1) {
                this.vector.xVector *= -1;
            }
        } else {
            if (this.position.y < 25) {
                this.vector.yVector = 1;
            }
            if (this.position.y < HEIGHT / 6) {
                this.position.y += 1 * this.vector.yVector;
            } else {
                if (getRandomInt(120) == 1) {
                    this.vector.yVector = -1;
                }
            }
            this.position.x += this.vector.xVector;
            if (this.position.x >= WIDTH - this.width || this.position.x <= 0) {
                this.vector.xVector *= -1;
            }
            if (getRandomInt(120) == 1) {
                this.vector.xVector *= -1;
            }
        }
    }

    shoot() {
        this.shootingTimer++;
        if (this.shootingTimer > this.periodOfShooting) {
            this.shootingTimer = 0;
        }
        if (this.shootingTimer < this.rapidTime) {
            return new BallEnemy((this.shootingPosition.x + this.position.x), this.shootingPosition.y + this.position.y, this.ballRadius);
        }
    }
}
class Star extends Model {
    constructor(spriteWay, xPosition, yPosition) {
        super(spriteWay, xPosition - 2, yPosition, 4, 4);
    }
    move(dy) {
        this.position.y += dy;
        if (this.position.y >= HEIGHT) {
            this.position.y = 0;
        }
    }
}
class BallPlayer extends Model {
    constructor(spriteWay, xPosition, yPosition) {
        super(spriteWay, xPosition, yPosition, 8, 8);
    }
    move(dy) {
        this.position.y += dy;
        if (this.position.y <= 0) {
            return true;
        } else {
            return false;
        }
    }
}
class BallEnemy extends Model {
    constructor(xPosition, yPosition, radius = 8) {
        super("Textures/green_ball.png", xPosition, yPosition, radius, radius);
    }
    move(dy = 2) {
        this.position.y += dy;
        if (this.position.y >= HEIGHT) {
            return true;
        } else {
            return false;
        }
    }
}
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
player = new Player("Textures/player_spryte.png", WIDTH / 2, HEIGHT - 100)

let rightPressed = false;
let leftPressed = false;
let topPressed = false;
let botPressed = false;
let spacePressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var ongoingTouches = [];
canvas.addEventListener("touchstart", handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);
canvas.addEventListener("touchcancel", handleCancel, false);
canvas.addEventListener("touchmove", handleMove, false);

function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
}
lastx = 0;
lasty = 0;
startTap = false;

function handleStart(evt) {
    startTap = true;
    evt.preventDefault();
    var touches = evt.changedTouches;
    ongoingTouches.push(copyTouch(touches[0]));
    lastx = ongoingTouches[0].pageX;
    lasty = ongoingTouches[0].pageY;
}

function handleMove(evt) {
    startTap = false;
    evt.preventDefault();
    var touches = evt.changedTouches;
    moveTouch = touches[0];
    if (moveTouch.pageX - dx > 20 || moveTouch.pageX - dx < -20) {
        console.log('danger');
    }
    dx = -lastx + moveTouch.pageX;
    dy = -lasty + moveTouch.pageY;
    player.move(dx, dy);
    lastx = moveTouch.pageX;
    lasty = moveTouch.pageY;
}

function handleEnd(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            ongoingTouches.splice(idx, 1); // remove it; we're done
        }
    }
}

function handleCancel(evt) {
    evt.preventDefault();
    console.log("touchcancel.");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1); // remove it; we're done
    }
}

function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;

        if (id == idToFind) {
            return i;
        }
    }
    return -1; // not found
}

function keyDownHandler(e) {
    if (e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "ArrowLeft") {
        leftPressed = true;
    } else if (e.key == "ArrowUp") {
        topPressed = true;
    } else if (e.key == "ArrowDown") {
        botPressed = true;
    } else if (e.key == ' ') {
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "ArrowLeft") {
        leftPressed = false;
    } else if (e.key == "ArrowUp") {
        topPressed = false;
    } else if (e.key == "ArrowDown") {
        botPressed = false;
    } else if (e.key == ' ') {
        spacePressed = false;
    }
}
for (let i = 0; i < 50; i++) {
    let star = new Star('Textures/star.png', getRandomInt(WIDTH), getRandomInt(HEIGHT));
    arrayStars.push(star);
}
let GAMESTAGE = 1;

function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 50; i++) {
        arrayStars[i].move(1);
        arrayStars[i].draw(ctx);
    }
    if (isGameStart && !isGameEnd) {
        if (score % 15 == 14) {
            bossFight = true;
        }
        if (!bossIsCreated && bossFight && enemyes.length == 0) {
            bossIsCreated = true;
            if (GAMESTAGE == 1) {
                enemyes.push(new Enemy(3));
                GAMESTAGE++;
            } else {
                enemyes.push(new Enemy(4))
            }
        }
        if (bossIsCreated && enemyes.length == 0) {
            bossIsCreated = false;
            bossFight = false
            score += 100;
        }

        if (getRandomInt(100) == 1 && enemyes.length < 5 && !bossFight) {
            if (score < 15) {
                enemyes.push(new Enemy(1));
            } else {
                enemyes.push(new Enemy(2));
            }
        }
        for (let i = 0; i < enemyes.length; i++) {
            let newShotBall = enemyes[i].shoot();
            if (newShotBall != undefined) {
                enemyesShoots.push(newShotBall);
            }
        }
        shootTimer += 1; // FIX!
        if (shootTimer == 35) { //FIX!
            shootTimer = 0;
            playerShoots.push(new BallPlayer("Textures/blue_ball.png", (player.shootingPosition.x + player.position.x), (player.shootingPosition.y + player.position.y)))
        }
        let flag;
        for (let i = 0; i < playerShoots.length; i++) {
            flag = false;
            for (let en = 0; en < enemyes.length && !flag; en++) {
                if (playerShoots[i].position.x > enemyes[en].position.x && playerShoots[i].position.x < enemyes[en].position.x + enemyes[en].width && playerShoots[i].position.y > enemyes[en].position.y && playerShoots[i].position.y < enemyes[en].position.y + enemyes[en].height) {
                    enemyes[en].health--;
                    if (enemyes[en].health <= 0) {
                        enemyes.splice(en, 1);
                        en--
                        score++;
                    }
                    playerShoots.splice(i, 1);
                    i--
                    flag = true;
                }
            }
        }
        if (rightPressed) {
            player.move(5, 0);
        }
        if (leftPressed) {
            player.move(-5, 0);
        }
        if (topPressed) {
            player.move(0, -5);
        }
        if (botPressed) {
            player.move(0, 5);
        }
        player.draw(ctx);
        for (let i = 0; i < enemyes.length; i++) {
            enemyes[i].move();
            enemyes[i].draw(ctx);
        }
        for (let i = 0; i < playerShoots.length; i++) {
            if (playerShoots[i].move(-7)) {
                playerShoots.splice(i, 1);
                i--;
            } else {
                playerShoots[i].draw(ctx);
            }
        }
        for (let i = 0; i < enemyesShoots.length; i++) {
            if (enemyesShoots[i].move(4)) {
                enemyesShoots.splice(i, 1);
                i--;
            } else if (enemyesShoots[i].position.x > player.position.x && enemyesShoots[i].position.x < player.position.x + 64 &&
                enemyesShoots[i].position.y > player.position.y + 20 && enemyesShoots[i].position.y < player.position.y + 64) {
                healthBar = healthBar.substring(0, healthBar.length - 2);
                enemyesShoots.splice(i, 1);
                i--;
                if (--player.health <= 0) {
                    if (score > scoreRecord) {
                        scoreRecord = score;
                    }
                    gameEnding();
                    player.health = 3;
                    break;
                }
            } else {
                enemyesShoots[i].draw(ctx);
            }
        }
        ctx.fillText(healthBar, 150, 30);
        drawScore()
            //drawD();
    }

    if (!isGameStart && !isGameEnd) {
        drawStartMenu();
        if (spacePressed || startTap) {
            isGameStart = true;
        }
    } else if (isGameStart && isGameEnd) {
        drawLoseMenu();
        if (spacePressed || startTap) {
            isGameEnd = false;
            isGameStart = true;
            score = 0;
        }
        ctx.closePath();
    }
}
setInterval(draw, 10);