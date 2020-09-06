function lineBounce(line, ball) {
    let point1 = line[0]
    let point2 = line[1]
    let lineVector = point2.minus(point1)
    let pointToBall = ball.position.minus(point1)
    let proj = pointToBall.clampedProj(lineVector)
    let displacement = pointToBall.minus(proj)
    let distance = displacement.norm()
    let overlap = ball.radius - distance

    if (distance <= ball.radius) {
        ball.velocity.reflect(displacement)
        displacement.setNorm(overlap)
        ball.position.add(displacement)
    }

    // lineVector.debugDraw(CTX, point1)
    // pointToBall.debugDraw(CTX, point1, 1, false, 'gold')
    // proj.debugDraw(CTX, point1, 1, false, 'aqua')
    // displacement.debugDraw(CTX, point1.plus(proj), 1, false, 'tomato')
}

function createPaddle({ x, y0, width, height, keys, boundY, hitSide }) {

    let y = y0;
    let velocity = 0

    window.addEventListener('keydown', e => {
        let key = e.key;
        if (key === keys.up) {
            velocity = -0.5
        } else if (key === keys.down) {
            velocity = 0.5
        }
    })

    window.addEventListener('keyup', e => {
        let key = e.key;
        if (key === keys.up || key === keys.down) {
            velocity = 0
        }
    })

    function getHitLine() {
        if (hitSide === 'left') {
            return [
                V(x - width / 2, y - height / 2),
                V(x - width / 2, y + height / 2)
            ]
        } else {
            return [
                V(x + width / 2, y - height / 2),
                V(x + width / 2, y + height / 2)
            ]
        }
    }

    function draw(ctx) {
        ctx.fillRect(x - width / 2, y - height / 2, width, height);
    }

    function move(dt) {
        y += velocity * dt
        y = Math.max(y, boundY)
        y = Math.min(y, HEIGHT - boundY)
    }

    function checkHit(ball) {
        hitLine = getHitLine()
        lineBounce(hitLine, ball)
    }

    return {
        move,
        draw,
        checkHit
    }
}