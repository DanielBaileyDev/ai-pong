function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
  
    if (obj instanceof Array) {
      const newArray = [];
      for (let i = 0; i < obj.length; i++) {
        newArray[i] = deepClone(obj[i]);
      }
      return newArray;
    }
  
    if (obj instanceof Object) {
      const newObject = Object.create(Object.getPrototypeOf(obj));
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObject[key] = deepClone(obj[key]);
        }
      }
      return newObject;
    }
  
    return obj;
}

// Neural networks information
class NeuralNetworksInfo {
    constructor(groups, groupSize, remainInGroup, randomNeuralNetworks, adjustAmount, baseNetwork) {
        this.neuralNetworkAmount = groups * groupSize + randomNeuralNetworks;
        this.groups = groups;
        this.groupSize = groupSize;
        this.remainInGroup = remainInGroup;
        this.randomNeuralNetworks = randomNeuralNetworks;
        this.adjustAmount = adjustAmount;
        this.neuralNetworks = new Array(this.neuralNetworkAmount);

        this.createNeuralNetworks(baseNetwork);
    }

    // Create the neural networks with weights and biases
    createNeuralNetworks(baseNetwork) {
        baseNetwork.initialise();

        for(let i = 0; i < this.neuralNetworkAmount; i++){
            let group = Math.ceil((i+1) / this.groupSize);
            baseNetwork.randomise();
            if(group <= this.groups) {
                baseNetwork.group = group;
            } else {
                baseNetwork.group = this.groups + 1;
                baseNetwork.random = true;
            }
            this.neuralNetworks[i] = deepClone(baseNetwork);
        }
    }

    // Get the outputs of a neural network
    getOutputs(index, inputs) {
        let outputs = this.neuralNetworks[index].getOutputs(inputs);
        return outputs;
    }

    // Set a neural networks fitness
    setFitness(index, fitness) {
        this.neuralNetworks[index].fitness = fitness;
    }

    // Get a neural networks fitness
    getFitness(index) {
        return this.neuralNetworks[index].fitness;
    }

    // Reset all neural networks fitness
    resetFitness() {
        for(let i = 0; i < this.neuralNetworkAmount; i++) {
            this.neuralNetworks[i].fitness = 0;
        }
    }

    // Change neural networks
    changeNeuralNetworks() {
        // Organise groups
        for(let i = 0; i < this.groups; i++) {
            let groupStart = i * this.groupSize;
            for(let j = groupStart + 1; j < groupStart + this.groupSize; j++) {
                let remain = groupStart + this.remainInGroup;
                if(j < remain){
                    remain = j;
                }
                for(let k = groupStart; k < this.remainInGroup; k++){
                    if(this.neuralNetworks[j].fitness > this.neuralNetworks[k].fitness) {
                        let temp = this.neuralNetworks[j];
                        this.neuralNetworks[j] = this.neuralNetworks[k]
                        this.neuralNetworks[k] = temp;
                    }
                }
            }
        }

        // Organise random neural networks
        let remainStart = this.groups * this.groupSize;
        for(let i = remainStart + 1; i < remainStart + this.randomNeuralNetworks; i++) {
            let remain = remainStart + this.groups;
            if(i < remain) {
                remain = i;
            }
            for(let j = remainStart; j < remain; j++){
                if(this.neuralNetworks[i].fitness > this.neuralNetworks[j].fitness){
                    let temp = this.neuralNetworks[i];
                    this.neuralNetworks[i] = this.neuralNetworks[j];
                    this.neuralNetworks[j] = temp;
                }
            }
        }

        // Change groups and random neural networks
        let remain = remainStart + this.groups;
        if(remainStart + this.randomNeuralNetworks < remain) {
            remain = remainStart + this.randomNeuralNetworks;
        }
        for(let i = remainStart; i < remain; i++){
            for(let j = 0; j < this.groups; j++){
                let groupStart = j * this.groupSize;
                if(this.neuralNetworks[i].fitness > this.neuralNetworks[groupStart].fitness) {
                    this.neuralNetworks[i].random = false;
                    this.neuralNetworks[groupStart].random = true;
                    let temp = this.neuralNetworks[i];
                    this.neuralNetworks[i] = this.neuralNetworks[groupStart];
                    this.neuralNetworks[groupStart] = temp;
                    for(let k = 1; k < this.groupSize; k++){
                        this.neuralNetworks[groupStart+k] = deepClone(temp);
                        if(k < this.remainInGroup){
                            this.neuralNetworks[groupStart+k].adjust(this.adjustAmount);
                        }
                    }
                }
            }
        }

        // Adjust and randomise weights and biases
        for(let i = 0; i < this.groups; i++) {
            let groupStart = i * this.groupSize;
            for(let j = this.remainInGroup; j < this.groupSize; j++){
                this.neuralNetworks[groupStart + j] = deepClone(this.neuralNetworks[groupStart]);
                this.neuralNetworks[groupStart + j].adjust(this.adjustAmount)
            }
        }

        for(let i = remainStart; i < remainStart + this.randomNeuralNetworks; i++) {
            this.neuralNetworks[i].randomise();
        }  
    }
}

// Neural network
class NeuralNetwork{
    constructor(layers) {
        this.layers = layers;

        this.fitness = 0;
        this.group = 0;
        this.random = false;
    }

    // Creates the weight and bias arrays
    initialise() {
        for(let i = 1; i < this.layers.length; i++) {
            for(let j = 0; j < this.layers[i].values.length; j++){
                this.layers[i].weights.push(Array(this.layers[i-1].values.length).fill(0));
            }
            this.layers[i].biasWeights = Array(this.layers[i].values).fill(0);
        }
    }

    // Randomise the neural network weights and biases
    randomise() {
        for(let i = 1; i < this.layers.length; i++) {
            this.layers[i].randomise();
        }
    }

    // Adjust the neural network weights and biases
    adjust(adjustAmount) {
        for(let i = 1; i < this.layers.length; i++) {
            this.layers[i].adjust(adjustAmount);
        }
    }

    // Get outputs of the neural network
    getOutputs(inputs) {
        this.layers[0].values = inputs;
        for(let i = 1; i < this.layers.length; i++) {
            this.layers[i].resetValues();
            for(let j = 0; j < this.layers[i].weights.length; j++) {
                this.layers[i].values[j] += this.layers[i].bias * this.layers[i].biasWeights[j];
                for(let k = 0; k < this.layers[i].weights[j].length; k++) {
                    this.layers[i].values[j] += this.layers[i-1].values[k] * this.layers[i].weights[j][k];
                }
                if(this.layers[i].activation == "Sigmoid") {
                    this.layers[i].values[j] = this.layers[i].sigmoid(this.layers[i].values[j]);
                } else if(this.layers[i].activation == "Tanh") {
                    this.layers[i].values[j] = this.layers[i].tanh(this.layers[i].values[j]);
                }
                
            }
        }
        let outputs = this.layers[this.layers.length-1].values
        return outputs;
    }
}

// Input layer
class InputLayer{
    constructor(amountOfNodes) {
        this.values = Array(amountOfNodes).fill(0);
    }
}

// Hidden/output layer
class HOLayer{
    constructor(amountOfNodes, activation) {
        this.values = Array(amountOfNodes).fill(0);
        this.activation = activation;
        
        this.weights = [];
        this.biasWeights = []
        this.bias = 0;
    }

    // Randomise the layer weights and biases
    randomise() {
        for(let i = 0 ; i < this.weights.length; i++) {
            this.biasWeights[i] = Math.random() * 2 - 1;
            for(let j = 0 ; j < this.weights[i].length; j++) {
                this.weights[i][j] = Math.random();
            }
        }
    }

    // Adjust the layer weights and biases
    adjust(adjustAmount) {
        for(let i = 0; i < this.weights.length; i++) {
            this.biasWeights[i] += Math.random() * adjustAmount * 2 - adjustAmount;
            if(this.biasWeights[i] > 1) {
                this.biasWeights[i] = 1;
            } else if(this.biasWeights[i] < -1) {
                this.biasWeights[i] = -1;
            }
            for(let j = 0; j < this.weights[i].length; j++) {
                this.weights[i][j] += Math.random() * adjustAmount * 2 - adjustAmount;
                if(this.weights[i][j] > 1) {
                    this.weights[i][j] -= 1;
                } else if(this.weights[i][j] < 0) {
                    this.weights[i][j] = 1 + this.weights[i][j];
                }
            }
        }
    }

    resetValues() {
        for(let i = 0; i < this.values.length; i++){
            this.values[i] = 0;
        }
    }

    // Sigmoid activation function
    sigmoid(value) {
        return 1 / (1 + Math.exp(-value));
    }

    tanh(value) {
        return Math.tanh(value);
    }
}