class Paddle {
    constructor(x, y, width, height, color, speedPerSecond) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speedPerSecond;
        
        this.xStart = x;
        this.yStart = y;
    }

    resetPosition() {
        this.x = this.xStart;
        this.y = this.yStart;
    }

    canvasCollision(){
        if(this.y <= 0) {
            this.y = 0;
        } else if(this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
        }
    }

    move(moveUp, moveDown, secondsPassed) {
        if(moveUp) {
            this.y -= this.speed * secondsPassed;
        }

        if(moveDown){
            this.y += this.speed * secondsPassed;
        }
        
        this.canvasCollision();
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}