const WIDTH = 500;
const HEIGHT = 500;
const CANVAS = document.getElementById('canvas');
const CTX = canvas.getContext('2d');
const SCORES = [0, 0]
CANVAS.width = WIDTH;
CANVAS.height = HEIGHT;

function circle(x, y, r) {
    CTX.beginPath();
    CTX.arc(x, y, r, 0, 2 * Math.PI);
    CTX.fill();
}

const dt = 20
const BALL = {
    radius: 10,
    position: V(WIDTH / 2, HEIGHT / 2),
    velocity: V(0, 0)
}

const player1 = createPaddle({
    x: 50,
    y0: HEIGHT / 2,
    width: 20,
    height: 80,
    boundY: 50,
    hitSide: 'right',
    human: false
})

const player2 = createPaddle({
    x: WIDTH - 50,
    y0: HEIGHT / 2,
    width: 20,
    height: 80,
    boundY: 50,
    hitSide: 'left',
    human: false
})

let AGENT1interval;

function restart() {
    window.clearInterval(AGENT1interval);
    start();
}

function start() {
    BALL.velocity.set(0, 0)
    BALL.position.set(WIDTH / 2, HEIGHT / 2)
    setTimeout(() => {
        BALL.velocity.randomize(0.3);
        AGENT1.agent_start([BALL.position.x, BALL.position.y, player1.position().y])
        AGENT1interval = window.setInterval(() => {
            player1.action(AGENT1.agent_step(0, [BALL.position.x, BALL.position.y, player1.position().y]));
        }, 250)
    }, 500)
}

function scorePoint(player) {
    if (player == 1) {
        SCORES[0] += 1;
        AGENT1.agent_end(1);
    } else {
        SCORES[1] += 1;
        AGENT1.agent_end(-1);
    }
    document.getElementById('player1score').textContent = SCORES[0]
    document.getElementById('player2score').textContent = SCORES[1]
    restart();
}

function checkEdgeBounce() {
    if (BALL.position.y >= HEIGHT - BALL.radius) {
        BALL.velocity.y *= -1
    }
    if (BALL.position.x >= WIDTH - BALL.radius) {
        scorePoint(1)
    }
    if (BALL.position.y <= BALL.radius) {
        BALL.velocity.y *= -1
    }
    if (BALL.position.x <= BALL.radius) {
        scorePoint(2)
    }
}

function clear() {
    CTX.clearRect(0, 0, WIDTH, HEIGHT)
}

function move() {
    BALL.position.add(BALL.velocity.times(dt));
}

function draw() {
    clear();
    circle(BALL.position.x, BALL.position.y, BALL.radius, BALL.color);
    player1.draw(CTX);
    player2.draw(CTX);
}

function frame() {
    player1.move(dt)
    player2.move(dt)
    checkEdgeBounce()
    move()
    player1.checkHit(BALL)
    player2.checkHit(BALL)
    draw()
    window.requestAnimationFrame(frame);
}

CTX.fillStyle = 'white';
frame()
start()