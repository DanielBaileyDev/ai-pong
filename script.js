const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

const showTrainingElement = document.getElementById("show-training");

const showBotNone = document.getElementById("show-bot1");
const showBotBot = document.getElementById("show-bot2");
const showBotGroup = document.getElementById("show-bot3");

const iterationElement = document.getElementById("iteration");
const fitnessElement = document.getElementById("fitness");

const fitnessLimitElement = document.getElementById('fitness-limit');

const ballAccelerationElement = document.getElementById('acceleration');

let secondsPassed;
let previousTimeStamp;
let fps;

let playerMoveUp = false;
let playerMoveDown = false;

let trainAI = true;
let isPlayerPlaying = false;
let botVersusBot = false;

let visualTraining = false;

let showBest = false;
let showBestGroup = true;

let ballAcceleration = false;

let iteration = 1;
let fitness = 0;
let fitnessLimit = 0;

let p1 = new Paddle(20, canvas.height/2 - 75/2, 20, 75, "white", 500);
let botPaddle = new Paddle(canvas.width - 20 - 20, canvas.height/2 - 75/2, 20, 75, "white", 500);
let ball = new Ball(canvas.width/2, canvas.height/2, 10, "white", 300);

let input = new InputLayer(3);
let output = new HOLayer(1, "tanh");
let network = new NeuralNetwork([input, output]);

let info = new NeuralNetworksInfo(5, 50, 1, 750, 0.1, network);

let botPaddles;
let balls;
let bestBotIndex;
let secondBestBotIndex;

createBots();

function displayFPS(timePassed) {
    fps = Math.round(1 / timePassed);
    context.font = '25px Arial';
    context.fillStyle = 'white';
    context.fillText("FPS: " + fps, 10, 30);
}

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - previousTimeStamp) / 1000;
    if(isNaN(secondsPassed)){
        secondsPassed = 0;
    }
    previousTimeStamp = timeStamp;

    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if(trainAI) {
        trainBots(secondsPassed, visualTraining);
    } else if(isPlayerPlaying || botVersusBot) {
        botMove(bestBotIndex, botPaddle, ball, secondsPassed);

        if(botVersusBot) {
            botMove(secondBestBotIndex, p1, ball, secondsPassed);
        } else {
            p1.move(playerMoveUp, playerMoveDown, secondsPassed);
        }

        ball.move(secondsPassed);

        ball.paddleCollision(p1.x, p1.y, p1.width, p1.height);
        ball.paddleCollision(botPaddle.x, botPaddle.y, botPaddle.width, botPaddle.height);

        p1.draw();
        botPaddle.draw();
        ball.draw();
    }

    displayFPS(secondsPassed);

    requestAnimationFrame(gameLoop);
}

gameLoop();