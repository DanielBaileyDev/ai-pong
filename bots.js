function createBots() {
    botPaddles = Array(info.neuralNetworkAmount);
    balls = Array(info.neuralNetworkAmount);
    bestBotIndex = 0;
    secondBestBotIndex = info.groupSize;
    
    for(let i = 0; i < info.neuralNetworkAmount; i++) {
        let randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
        botPaddles[i] = new Paddle(canvas.width - 20 - 20, canvas.height/2 - 75/2, 20, 75, randomColor, 500);
        balls[i] = new Ball(canvas.width/2, canvas.height/2, 10, randomColor, 300);
    }
}

function botMove(index, paddle, paddleBall, timePassed) {
    let moveUp = false;
    let moveDown = false;
    let outputs;

    let yDirection = paddleBall.ySpeed > 0 ? 1 : -1;

    outputs = info.getOutputs(index, [1 - Math.abs(paddleBall.x / canvas.width - (paddle.x + paddle.width/2) / canvas.width),
    paddleBall.y / canvas.height - (paddle.y + paddle.height/2) / canvas.height,
    yDirection]);
    
    if(outputs[0] > 0) {
        moveDown = true;
    } else {
        moveUp = true;
    }

    paddle.move(moveUp, moveDown, timePassed);
}

function showBestBot() {
    botPaddles[bestBotIndex].draw();
    balls[bestBotIndex].draw();
}

function showBestBotGroup() {
    let bestGroupIndex = Math.floor(bestBotIndex / info.groupSize);
    if(bestGroupIndex < info.groups){
        for(let i = bestGroupIndex * info.groupSize; i < bestGroupIndex * info.groupSize + info.groupSize; i++){
            if(balls[i].inPlay){
                botPaddles[i].draw();
                balls[i].draw();
            }
        }
    } else {
        botPaddles[bestBotIndex].draw();
        balls[bestBotIndex].draw();
    }
}

function trainBots(timePassed, showDisplay) {
    let botsEliminated = 0;
    
    for(let i = 0; i < info.neuralNetworkAmount; i++) {
        if(balls[i].inPlay) {
            if(!balls[bestBotIndex].inPlay){
                if(secondBestBotIndex == i){
                    secondBestBotIndex = bestBotIndex;
                }
                bestBotIndex = i;
            }

            if(!balls[secondBestBotIndex].inPlay && i != bestBotIndex){
                secondBestBotIndex = i;
            }

            botMove(i, botPaddles[i], balls[i], timePassed);
        
            balls[i].move(timePassed);
            balls[i].paddleCollision(botPaddles[i].x, botPaddles[i].y, botPaddles[i].width, botPaddles[i].height);

            if(showDisplay){
                botPaddles[i].draw();
                balls[i].draw();
            }

            if(balls[i].score > fitness) {
                fitness = balls[i].score;
                fitnessElement.textContent = "Fitness: " + fitness;
            }
            
            let currentScore = balls[i].score;
            
            if(currentScore >= fitnessLimit && fitnessLimit !== 0) {
                balls[i].inPlay = false;
                botsEliminated += 1;
            }
        }
        else{
            botsEliminated += 1;
        }
    }

    if(!visualTraining){
        if(showBest){
            showBestBot();
        } else if(showBestGroup) {
            showBestBotGroup();
        }
    }

    if(botsEliminated === info.neuralNetworkAmount){
        for(let i = 0; i < info.neuralNetworkAmount; i++) {
            info.setFitness(i, balls[i].score);
            botPaddles[i].resetPosition();
            balls[i].resetAll();
        }

        info.changeNeuralNetworks();

        console.log("Best Fitness: ", info.neuralNetworks[0].fitness);
        bestBotIndex = 0;
        secondBestBotIndex = info.groupSize;

        info.resetFitness();
        
        iteration += 1;
        fitness = 0;
        iterationElement.textContent = "Iteration: " + iteration;
        fitnessElement.textContent = "Fitness: " + fitness;
    }
}