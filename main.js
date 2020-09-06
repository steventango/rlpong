const WIDTH = 500;
const HEIGHT = 500;
const CANVAS = document.getElementById('canvas');
const CTX = canvas.getContext('2d');
CANVAS.width = WIDTH;
CANVAS.height = HEIGHT;

function circle(x, y, r) {
    CTX.beginPath();
    CTX.arc(x, y, r, 0, 2 * Math.PI);
    CTX.fill();
}

const dt = 20
const ball = {
    radius: 10,
    position: V(300, 300),
    velocity: V(0.3, 0.4)
}

const player1 = createPaddle({
    x: 50,
    y0: HEIGHT / 2,
    width: 20,
    height: 80,
    keys: {
        up: 'w',
        down: 's'
    },
    boundY: 50,
    hitSide: 'right'
})

const player2 = createPaddle({
    x: WIDTH - 50,
    y0: HEIGHT / 2,
    width: 20,
    height: 80,
    keys: {
        up: 'ArrowUp',
        down: 'ArrowDown'
    },
    boundY: 50,
    hitSide: 'left'
})

function restart() {
    ball.velocity.set(0, 0)
    ball.position.set(WIDTH / 2, HEIGHT / 2)
    setTimeout(() => {
        ball.velocity.randomize(0.4);
    }, 500)
}

function scorePoint(player) {
    let el
    if (player == 1) {
        el = document.getElementById('player1score');
    } else {
        el = document.getElementById('player2score');
    }

    let score = Number.parseInt(el.innerHTML);
    score += 1;
    el.innerHTML = score;
    restart();
}

function checkEdgeBounce() {
    if (ball.position.y >= HEIGHT - ball.radius) {
        ball.velocity.y *= -1
    }
    if (ball.position.x >= WIDTH - ball.radius) {
        scorePoint(1)
    }
    if (ball.position.y <= ball.radius) {
        ball.velocity.y *= -1
    }
    if (ball.position.x <= ball.radius) {
        scorePoint(2)
    }
}

function clear() {
    CTX.clearRect(0, 0, WIDTH, HEIGHT)
}

function move() {
    ball.position.add(ball.velocity.times(dt));
}

function draw() {
    clear();
    circle(ball.position.x, ball.position.y, ball.radius, ball.color);
    player1.draw(CTX);
    player2.draw(CTX);
}

function frame() {
    player1.move(dt)
    player2.move(dt)
    checkEdgeBounce()
    move()
    player1.checkHit(ball)
    player2.checkHit(ball)
    draw()
    window.requestAnimationFrame(frame);
}

CTX.fillStyle = 'white';
frame()
restart()