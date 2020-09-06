// 10.2 Semi - gradient n - step Sarsa

function argmax(array) {
    let top = -Infinity;
    let indexs = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] > top) {
            indexs = [i]
        } else if (array[i] == top) {
            indexs.append(i);
        }
    }

    return indexs[Math.floor(Math.random() * indexs.length)]
}

function epsilon_greedy(epsilon, weights) {
    if (Math.random() > epsilon) {
        action = argmax(weights)
    } else {
        action = Math.floor(Math.random() * weights.length)
    }
    return action
}

class SarsaAgent {
    agent_start(state) {
        this.last_state = state
        this.last_action = epsilon_greedy(this.epsilon, this.weights)
        return this.last_action
    }
    agent_step(reward, state) {
        let action = epsilon_greedy(this.epsilon, this.weights)
        let action_value = this.weights[action]
        let last_action_value = this.weights[this.last_action]
        let gradient = new Array(this.weights.length).fill(0)
        gradient[this.last_action] = 1
        this.weights = this.weights.map((weight, action) => {
            return weight + this.alpha * (reward + this.gamma * action_value - last_action_value) * gradient[action]
        });
        this.last_state = state;
        this.last_action = action
        return action
    }
    agent_end(reward) {
        let last_action_value = this.weights[this.last_action]
        let gradient = new Array(this.weights.length).fill(0)
        gradient[this.last_action] = 1
        this.weights = this.weights.map((weight, action) => {
            return weight + this.alpha * (reward - last_action_value) * gradient[action]
        });
    }
    constructor(alpha, epsilon, gamma) {
        this.alpha = alpha
        this.epsilon = epsilon
        this.gamma = gamma
        this.weights = [0, 0, 0]
    }
}

const AGENT1 = new SarsaAgent(0.25, 0.1, 0.1);

// 250 ms