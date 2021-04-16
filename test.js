var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
let WIDTH = canvas.width;
let HEIGHT = canvas.height;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
class Position {
    constructor(xValue, yValue) {
        this.x = xValue;
        this.y = yValue;
    }
}
class Model {
    constructor(TextureM, yPosition, xPosition, size1, size2) {
        this.size1 = size1;
        this.size2 = size2;
        this.textureModel = new Image();
        this.textureModel.src = TextureM;
        this.position = new Position(yPosition, xPosition);
    }
    draw(ctx) {
        ctx.drawImage(this.textureModel, this.position.x, this.position.y, this.size1, this.size2)
    }
}
class Player extends Model {
    textureShot = new Image();
    constructor(textureM, xPosition, yPosition) {
        super(textureM, xPosition, yPosition, 50, 50);
        this.hitBox = [64, 64];
    }
    shoot() {};
    move(dx, dy) {
        if ((this.position.x + dx) < WIDTH && (this.position.x + dx) > 0) {
            this.position.x += dx;
        }
        if ((this.position.y + dy) < HEIGHT && (this.position.y + dy) > 0) {
            this.position.y += dy;
        }
    }
}
class Star extends Model {
    constructor(textureM, xPosition, yPosition) {
        super(textureM, xPosition, yPosition, 4, 4);
    }
    move(dy) {
        this.position.y += dy;
        if (this.position.y >= 800) {
            this.position.y = 0;
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
for (let i = 0; i < 50; i++) {
    let star = new Star('Textures/Star.png', getRandomInt(600), getRandomInt(800));
    arrayStars.push(star);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    ctx.closePath();
}
setInterval(draw, 10);