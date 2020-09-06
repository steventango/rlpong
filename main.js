const WIDTH = 800;
const HEIGHT = 800;
const CANVAS = document.getElementById('canvas');
const CTX = canvas.getContext('2d');
CANVAS.width = WIDTH;
CANVAS.height = HEIGHT;

function circle(x, y, r, color) {
    CTX.fillStyle = color;
    CTX.beginPath();
    CTX.arc(x, y, r, 0, 2 * Math.PI);
    CTX.fill();
}

const dt = 20
const ball = {
    radius: 10,
    position: V(300, 300),
    velocity: V(0.3, 0.4),
    color: 'white'
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

// window.addEventListener('mousemove', e => {
//   ball.position.x = e.pageX;
//   ball.position.y = e.pageY;
// })

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
}

function animate() {
    setTimeout(animate, dt)
    frame()
}

animate()
restart()

// 1. Use `requestAnimationFrame` instead of `setTimeout`, and adjust `dt` accordingly
// 2.1. Use separate `canvas` for the paddles and balls
// 2.2. Setting `fillStyle` is expensive to call each frame, so just set it globally.