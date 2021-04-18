var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
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
    constructor(spriteWay, xPosition = (WIDTH / 2), yPosition = -50) {
        super(spriteWay, xPosition, yPosition, 64, 64, 1);
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
    }
    canShoot() {
        this.shootingTimer++;
        if (this.shootingTimer > 100) {
            this.shootingTimer = 0;
        }
        return (this.shootingTimer < 1);
    }
    shoot(i) {
        return new BallEnemy("Textures/green_ball.png", (enemyes[i].shootingPosition.x + enemyes[i].position.x), enemyes[i].shootingPosition.y + enemyes[i].position.y);
    }

}
class Boss extends Model {
    constructor(spriteWay, xPosition = (WIDTH / 2), yPosition = -128) {
        super(spriteWay, xPosition, yPosition, 128, 128, 40);
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
    canShoot() {
        this.shootingTimer++;
        if (this.shootingTimer > 300) {
            this.shootingTimer = 0;
        }
        return (this.shootingTimer < 80);
    }
    shoot(i) {
        return new BallEnemy("Textures/green_ball.png", (enemyes[i].shootingPosition.x + enemyes[i].position.x), enemyes[i].shootingPosition.y + enemyes[i].position.y);
    }
}
class Star extends Model {
    constructor(spriteWay, xPosition, yPosition) {
        super(spriteWay, xPosition - 2, yPosition, 4, 4);
    }
    move(dy) {
        this.position.y += dy;
        if (this.position.y >= 800) {
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
    constructor(spriteWay, xPosition, yPosition) {
        super(spriteWay, xPosition, yPosition, 8, 8);
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
player = new Player("Textures/player_spryte.png", 270, 700)

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
function handleStart(evt) {
    evt.preventDefault();
    console.log("touchstart.");
    var el = document.getElementById("myCanvas");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
    ongoingTouches.push(copyTouch(touches[0]));
    lastx = ongoingTouches[0].pageX;
    lasty = ongoingTouches[0].pageY;
}
function handleMove(evt) {
    evt.preventDefault();
    var el = document.getElementById("myCanvas");
    var ctx = el.getContext("2d");
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
            ongoingTouches.splice(idx, 1);  // remove it; we're done
        }
    }
}
function handleCancel(evt) {
    evt.preventDefault();
    console.log("touchcancel.");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
}
function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;

        if (id == idToFind) {
            return i;
        }
    }
    return -1;    // not found
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
    let star = new Star('Textures/star.png', getRandomInt(600), getRandomInt(800));
    arrayStars.push(star);
}
function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 50; i++) {
        arrayStars[i].move(1);
        arrayStars[i].draw(ctx);
    }
    if (isGameStart && !isGameEnd) {
        if (score % 6 == 5) {
            bossFight = true;
        }
        if (!bossIsCreated && bossFight && enemyes.length == 0) {
            bossIsCreated = true;
            enemyes.push(new Boss("Textures/boss_sprite.png"));
        }
        if (bossIsCreated && enemyes.length == 0) {
            bossIsCreated = false;
            bossFight = false
        }
        if (getRandomInt(100) == 1 && enemyes.length < 5 && !bossFight) {
            enemyes.push(new Enemy('Textures/en1.png'));
        }
        shootTimer += 1;
        for (let i = 0; i < enemyes.length; i++) {
            if (enemyes[i].canShoot()) {
                enemyesShoots.push(enemyes[i].shoot(i));
            }
        }
        if (shootTimer == 35) {
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
            }
            else {
                playerShoots[i].draw(ctx);
            }
        }
        for (let i = 0; i < enemyesShoots.length; i++) {
            if (enemyesShoots[i].move(2)) {
                enemyesShoots.splice(i, 1);
                i--;
            }
            else if (enemyesShoots[i].position.x > player.position.x && enemyesShoots[i].position.x < player.position.x + 64 &&
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
            }
            else {
                enemyesShoots[i].draw(ctx);
            }      
        }                                         
        ctx.fillText(healthBar, 150, 30);
        drawScore()
        drawD();
        //отладка
    }
    if (!isGameStart && !isGameEnd) {
        drawStartMenu();
        if (spacePressed) {
            isGameStart = true;
        }
    } else if (isGameStart && isGameEnd) {
        drawLoseMenu();
        if (spacePressed) {
            isGameEnd = false;
            isGameStart = true;
            score = 0;
        }
    }

    ctx.closePath();
}
setInterval(draw, 10);