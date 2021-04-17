var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
let WIDTH = canvas.width;
let HEIGHT = canvas.height;
let score = 0;
let healthBar = "❤️❤️❤️"
let arrayStars = [];
let playerShoots = [];
let enemyesShoots = [];
let enemyes = [];
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 20, 30);
}
class Model {
    constructor(spriteWay, xPosition, yPosition, width, height,health) {
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
            x: this.width/2 - 4,
            y: 0,
        }
    }
    move(dx, dy) {
        if ((this.position.x + dx) < WIDTH-64 && (this.position.x + dx) > 0) {
            this.position.x += dx;
        }
        if ((this.position.y + dy) < HEIGHT-64 && (this.position.y + dy) > 0) {
            this.position.y += dy;
        }
    }
}
class Enemy extends Model{
    constructor(spriteWay, xPosition = (WIDTH/2), yPosition = -50) {
        super(spriteWay, xPosition, yPosition, 64, 64,1);
        this.shootingTimer = 0;
        this.vector = {
            xVector: 1,
            yVector: 1,
        }
        this.shootingPosition = {
            x: this.width/2,
            y: this.height,
        }
    }
    move() {
            if(this.position.y < 0){
                this.vector.yVector = 1;
            }
            if (this.position.y>0 && this.position.y< HEIGHT/3){
                this.vector.yVector = 1;
            }else if (getRandomInt(60) == 1){
                this.vector.yVector = -1;
            }
            this.position.y += this.vector.yVector;
            
            this.position.x +=this.vector.xVector;
            if(this.position.x >= WIDTH-this.width || this.position.x<=0){
                this.vector.xVector *= -1;
            }
            if(getRandomInt(120)==1){
                this.vector.xVector *=-1;
            }
        }
        canShoot(){
            this.shootingTimer ++;
            if (this.shootingTimer>100){
                this.shootingTimer=0;
            }
            return (this.shootingTimer <1);
        }
        shoot(i){
            return new BallEnemy("Textures/green_ball.png",(enemyes[i].shootingPosition.x + enemyes[i].position.x),enemyes[i].shootingPosition.y + enemyes[i].position.y);
        }
    
}
class Boss extends Model{
    constructor(spriteWay, xPosition = (WIDTH/2), yPosition = -128) {
        super(spriteWay, xPosition, yPosition, 128, 128,40);
        this.shootingTimer = 0;
        this.vector = {
            xVector: 1,
            yVector: 1,
        }
        this.shootingPosition = {
            x: this.width/2,
            y: this.height,
        }
    }
    move() {
            if(this.position.y < 25){
                this.vector.yVector = 1;
            }
            if (this.position.y< HEIGHT/6){
                this.position.y+=1*this.vector.yVector;
            }else {
                if(getRandomInt(120)==1){
                    this.vector.yVector =-1;
                }
            }
            this.position.x +=this.vector.xVector;
            if(this.position.x >= WIDTH-this.width || this.position.x<=0){
                this.vector.xVector *= -1;
            }
            if(getRandomInt(120)==1){
               this.vector.xVector *=-1;
            }
    }
    canShoot(){
        this.shootingTimer ++;
        if (this.shootingTimer>300){
            this.shootingTimer=0;
        }
        return (this.shootingTimer <80);
    }
    shoot(i){
        return new BallEnemy("Textures/green_ball.png",(enemyes[i].shootingPosition.x + enemyes[i].position.x),enemyes[i].shootingPosition.y + enemyes[i].position.y);
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
for (let i = 0; i < 50; i++) {
    let star = new Star('Textures/star.png', getRandomInt(600), getRandomInt(800));
    arrayStars.push(star);
}
shootTimer = 0;
bossFight = false;
bossIsCreated = false;
dy = 2;
function draw() {;
    if (score%6 == 5){
        bossFight = true;
    }
    if(!bossIsCreated && bossFight && enemyes.length == 0){
        bossIsCreated=true;
        dy = 4;
        enemyes.push(new Boss("Textures/boss_sprite.png"));
    }
    if(bossIsCreated && enemyes.length == 0){
        bossIsCreated = false;
        bossFight = false
    }
    if(getRandomInt(100) == 1 && enemyes.length <5 &&!bossFight){
        enemyes.push(new Enemy('Textures/en1.png'));
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shootTimer+=1;
    for (let i = 0;i<enemyes.length;i++){
        if(enemyes[i].canShoot()){
            enemyesShoots.push(enemyes[i].shoot(i));
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
                    enemyes[en].health--;
                    if(enemyes[en].health <=0){
                        enemyes.splice(en,1);
                        en--
                        score++;
                    }
                    playerShoots.splice(i,1);
                    i--
                    flag = true;
                }
        }
    }
    ctx.beginPath();
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
    for (let i = 0; i < 50; i++) {
        arrayStars[i].move(1);
        arrayStars[i].draw(ctx);
    }
    player.draw(ctx);
    for(let i = 0;i<enemyes.length;i++){
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
        if (enemyesShoots[i].move(dy)){
            enemyesShoots.splice(i,1);
            i--;
        }
        else if (enemyesShoots[i].position.x > player.position.x && enemyesShoots[i].position.x < player.position.x+64 &&
                enemyesShoots[i].position.y > player.position.y+20 && enemyesShoots[i].position.y < player.position.y+64){
                    
                    if(--player.health==0){
                        gameEnding();
                    }
                    healthBar = healthBar.substring(0,healthBar.length-2);
                    enemyesShoots.splice(i,1);
                    i--;
        }
        else
        {
            enemyesShoots[i].draw(ctx);
        }
    }
    ctx.fillText(healthBar, 150, 30);
    drawScore()     
    ctx.closePath();
}
setInterval(draw, 10);