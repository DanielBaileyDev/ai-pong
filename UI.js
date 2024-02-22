function setFitness() {
    fitnessLimit = fitnessLimitElement.value;
}

function selectMode(mode) {
    trainAI = false;
    isPlayerPlaying = false;
    botVersusBot = false;

    showTrainingElement.disabled = true;

    switch(mode) {
        case "training":
            trainAI = true;
            showTrainingElement.disabled = false;
            break;
        case "player":
            isPlayerPlaying = true;
            break;
        case "bot":
            botVersusBot = true;
            break;
        default:
            break;
    }
    showTraining();
}

function showTraining() {
    visualTraining = showTrainingElement.disabled ? true : showTrainingElement.checked;
    showBotNone.disabled = visualTraining;
    showBotBot.disabled = visualTraining;
    showBotGroup.disabled = visualTraining;
}

function selectShowBot(showBot) {
    showBest = false;
    showBestGroup = false;
    switch(showBot) {
        case "bot":
            showBest = true;
            break;
        case "group":
            showBestGroup = true;
            break;
        default:
            break;
    }
}

function setPreset(preset) {
    iteration = 1;
    fitness = 0;
    iterationElement.textContent = "Iteration: " + iteration;
    fitnessElement.textContent = "Fitness: " + fitness;
    switch(preset) {
        case "preset1":
            showTrainingElement.checked = true;
            info = new NeuralNetworksInfo(3, 2, 1, 4, 0.1, network);
            break;
        case "preset2":
            showTrainingElement.checked = true;
            info = new NeuralNetworksInfo(5, 5, 1, 75, 0.1, network);
            break;
        case "preset3":
            showTrainingElement.checked = false;
            selectShowBot("group");
            showBotGroup.checked = true;
            info = new NeuralNetworksInfo(5, 50, 1, 750, 0.1, network);
            break;
        case "preset4":
            showTrainingElement.checked = false;
            selectShowBot("group");
            showBotGroup.checked = true;
            info = new NeuralNetworksInfo(25, 20, 1, 4500, 0.1, network);
            break;
        default:
            break;
    }
    createBots();
    selectMode("training");
}

function toggleAcceleration() {
    ballAcceleration = ballAccelerationElement.checked;
}