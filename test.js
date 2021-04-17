var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
let WIDTH = canvas.width;
let HEIGHT = canvas.height;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
class Model {
    constructor(spriteWay, yPosition, xPosition, width, height) {
        this.width = width;
        this.height = height;
        this.spriteImg = new Image();
        this.spriteImg.src = spriteWay;
        this.position = {
            x: yPosition,
            y: xPosition,
        };
    }
    draw(ctx) {
        ctx.drawImage(this.spriteImg, this.position.x, this.position.y, this.width, this.height)
    }
}
class Player extends Model {
    constructor(spriteWay, xPosition, yPosition) {
        super(spriteWay, xPosition, yPosition, 64, 64);
        this.hitBox = [64, 64];
        this.shootingPosition = {
            x: this.width/2 - 4,
            y: 0,
        }
    }
    move(dx, dy) {
        if ((this.position.x + dx) < WIDTH && (this.position.x + dx) > 0) {
            this.position.x += dx;
        }
        if ((this.position.y + dy) < HEIGHT && (this.position.y + dy) > 0) {
            this.position.y += dy;
        }
    }
}
class Enemy extends Model{
    constructor(spriteWay, xPosition = (WIDTH/2), yPosition = -50) {
        super(spriteWay, xPosition, yPosition, 50, 50);
        this.shootingTimer = 0;
        this.vector = {
            xVector: 1,
            yVector: 1,
        }
        this.hitBox = [64, 64];
        this.shootingPosition = {
            x: this.width/2 - 4,
            y: this.height,
        }
    }
    move() {
            if(this.position.y < 0){
                this.vector.yVector = 1;
            }
            if (this.position.y< HEIGHT/3){
                this.position.y+=2*this.vector.yVector;
            }else if(this.position.y< HEIGHT/2){
                this.position.y+=1*this.vector.yVector;
            }else{
                 if (getRandomInt(60) == 1){
                    this.vector.yVector *= -1;
                }
                this.position.y+=1*this.vector.yVector;
            }
            this.position.x +=this.vector.xVector;
            if(this.position.x >= WIDTH-this.width || this.position.x<=0){
                this.vector.xVector *= -1;
            }
            if(getRandomInt(60)==1){
                this.vector.xVector *=-1;
            }

    }
}
class Star extends Model {
    constructor(spriteWay, xPosition, yPosition) {
        super(spriteWay, xPosition-2, yPosition, 4, 4);
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
    move(dy){
        this.position.y+=dy;
        this.hitBox = [8,8];
        if (this.position.y <= 0) {
            return true;
        }else{
            return false;
        }
    }
}
class BallEnemy extends Model {
    constructor(spriteWay, xPosition, yPosition) {
        super(spriteWay, xPosition, yPosition, 8, 8);
    }
    move(dy=2){
        this.position.y+=dy;
        if (this.position.y >=HEIGHT) {
            return true;
        }else{
            return false;
        }
    }
}


let rightPressed = false;
let leftPressed = false;
let topPressed = false;
let botPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "ArrowLeft") {
        leftPressed = true;
    } else if (e.key == "ArrowUp") {
        topPressed = true;
    } else if (e.key == "ArrowDown") {
        botPressed = true;
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
    }
}

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
player = new Player("Textures/player_spryte.png", 0, 0)
let arrayStars = [];
let playerShoots = [];
let enemyesShoots = [];
let enemyes = [];
for (let i = 0; i < 50; i++) {
    let star = new Star('Textures/star.png', getRandomInt(600), getRandomInt(800));
    arrayStars.push(star);
}

shootTimer = 0;
function draw() {
    if(getRandomInt(100) == 1 && enemyes.length <5){
        enemyes.push(new Enemy('Textures/en1.png'));
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shootTimer+=1;
    for (let i = 0;i<enemyes.length;i++){
        if(enemyes[i].shootingTimer>=210){
            enemyes[i].shootingTimer=0;
            enemyesShoots.push(new BallEnemy("Textures/green_ball.png",(enemyes[i].shootingPosition.x + enemyes[i].position.x),enemyes[i].shootingPosition.y + enemyes[i].position.y))
        }
    }
    if (shootTimer == 35){
        shootTimer=0;
        playerShoots.push(new BallPlayer("Textures/blue_ball.png",(player.shootingPosition.x + player.position.x),(player.shootingPosition.y+player.position.y)))
    }
    let flag;
    for(let i = 0;i<playerShoots.length;i++){
        flag = false;
        for(let en = 0; en<enemyes.length && !flag;en++){
            if (playerShoots[i].position.x > enemyes[en].position.x && playerShoots[i].position.x < enemyes[en].position.x+enemyes[en].width && playerShoots[i].position.y > enemyes[en].position.y && playerShoots[i].position.y < enemyes[en].position.y+enemyes[en].height){
                    enemyes.splice(en,1);
                    en--
                    playerShoots.splice(i,1);
                    i--
                    flag = true;
                }
        }
    }
    ctx.beginPath();
    if (rightPressed) {
        player.move(7, 0);
    }
    if (leftPressed) {
        player.move(-7, 0);
    }
    if (topPressed) {
        player.move(0, -7);
    }
    if (botPressed) {
        player.move(0, 7);
    }
    for (let i = 0; i < 50; i++) {
        arrayStars[i].move(1);
        arrayStars[i].draw(ctx);
    }
    player.draw(ctx);
    for(let i = 0;i<enemyes.length;i++){
        enemyes[i].shootingTimer++;
        enemyes[i].move();
        enemyes[i].draw(ctx);
    }
    for(let i = 0; i<playerShoots.length;i++){
        if (playerShoots[i].move(-7)){
            playerShoots.splice(i,1);
            i--;
        }
        else
        {
            playerShoots[i].draw(ctx);
        }
    }
    for(let i = 0; i<enemyesShoots.length;i++){
        if (enemyesShoots[i].move()){
            enemyesShoots.splice(i,1);
            i--;
        }
        else
        {
            enemyesShoots[i].draw(ctx);
        }
    }
    
    ctx.closePath();
}
setInterval(draw, 10);