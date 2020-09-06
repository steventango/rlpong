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
}

function createPaddle({ x, y0, width, height, keys, boundY, hitSide, human }) {
    let y = y0;
    let velocity = 0

    if (human) {
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
    }

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

    function action(action) {
        switch (action) {
            case 0:
                velocity = 0
                break;
            case 1:
                velocity = -0.5
                break;
            case 2:
                velocity = 0.5
                break;
        }
    }

    return {
        move,
        draw,
        checkHit,
        action,
        x,
        y
    }
}