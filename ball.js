class Ball {
    constructor(x, y, radius, color, speedPerSecond) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speedPerSecond;
        
        this.xStart = x;
        this.yStart = y;

        this.xSpeed = speedPerSecond;
        this.ySpeed = speedPerSecond;
        
        this.inPlay = true;
        this.score = 0;

        this.acceleration = 1;
        this.accelerationSpeed = 0.05;
    }

    resetPosition() {
        this.x = this.xStart;
        this.y = this.yStart;
        this.xSpeed = this.speed;
        this.ySpeed = this.speed;
        this.acceleration = 1;
    }

    resetAll() {
        this.resetPosition();
        this.inPlay = true;
        this.score = 0
    }

    increaseScore() {
        this.score += 1;
    }

    canvasCollision(){
        if(this.y - this.radius <= 0) {
            this.y = 0 + this.radius;
            this.ySpeed = -this.ySpeed;
        } else if(this.y + this.radius >= canvas.height) {
            this.y = canvas.height - this.radius;
            this.ySpeed = -this.ySpeed;
        }

        if(this.x - this.radius <= 0) {
            if(isPlayerPlaying || botVersusBot) {
                this.resetPosition();
            } else {
                this.increaseScore();
                this.x = 0 + this.radius;
            }
            this.xSpeed = -this.xSpeed;
        } else if(this.x + this.radius >= canvas.width) {
            if(isPlayerPlaying || botVersusBot) {
                this.resetPosition();
            }
            this.xSpeed = -this.xSpeed;
            this.inPlay = false;
        }
    }

    paddleCollision(x, y, width, height){
        if(this.x - this.radius < x + width &&
            this.x + this.radius > x &&
            this.y - this.radius < y + height &&
            this.y + this.radius > y){

            const collisionSides = {
                top: this.y + this.radius - y,
                bottom: y + height - this.y - this.radius,
                left: this.x + this.radius - x,
                right: x + width - this.x - this.radius,
            };

            const sideCollided = Math.min(collisionSides.top, collisionSides.bottom, collisionSides.left, collisionSides.right);
            switch(sideCollided){
                case collisionSides.top:
                    this.y = y - this.radius;
                    this.ySpeed = -this.ySpeed;
                    break;
                case collisionSides.bottom:
                    this.y = y + height + this.radius;
                    this.ySpeed = -this.ySpeed;
                    break;
                case collisionSides.left:
                    this.x = x - this.radius;
                    this.xSpeed = -this.xSpeed;
                    break;
                case collisionSides.right:
                    this.x = x + width + this.radius;
                    this.xSpeed = -this.xSpeed;
                    break;
                default:
                    break;
            }
        }
    }

    move(secondsPassed) {
        if(ballAcceleration) {
            this.acceleration += this.accelerationSpeed * secondsPassed;
        }
        
        this.x += this.xSpeed * secondsPassed * this.acceleration;
        this.y += this.ySpeed * secondsPassed * this.acceleration;
        this.canvasCollision();
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}