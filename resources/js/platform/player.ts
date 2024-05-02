/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
export const getPlayer = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const {width: canvasWidth, height: canvasHeight} = canvas;
    const size = {x: canvasWidth * 0.05, y: canvasHeight * 0.1};
    const pos = {x: canvasWidth / 2 - size.x / 2, y: canvasHeight / 2 - size.y / 2};
    const vel = {x: 0, y: 0};
    // const acc = {x: 0, y: 0.2}; // gravity added
    const acc = {x: 0, y: 0}; // without gravity
    const vertAcc = 0.2;
    const horiAcc = 0.2;
    const maxVelX = 5;
    const maxVelY = 10;
    const move = {
        grounded: true,
        left: false,
        right: false,
        up: false,
        down: false,
    };

    const update = () => {
        vel.x += acc.x;
        vel.y += acc.y;

        // friction
        if (move.grounded && acc.x === 0 && vel.x > 0) vel.x -= vertAcc;
        else if (move.grounded && acc.x === 0 && vel.x < 0) vel.x += vertAcc;
        if (move.grounded && acc.y === 0 && vel.y > 0) vel.y -= horiAcc;
        else if (move.grounded && acc.y === 0 && vel.y < 0) vel.y += horiAcc;

        if (Math.abs(vel.x) < 0.2) vel.x = 0;
        if (Math.abs(vel.y) < 0.2) vel.y = 0;

        // limit velocity
        if (vel.x > maxVelX) vel.x = maxVelX;
        else if (vel.x < -maxVelX) vel.x = -maxVelX;

        if (vel.y > maxVelY) vel.y = maxVelY;
        else if (vel.y < -maxVelY) vel.y = -maxVelY;

        pos.x += vel.x;
        pos.y += vel.y;
    };

    const show = () => {
        context.fillStyle = '#f00';
        context.fillRect(pos.x, pos.y, size.x, size.y);
    };

    addEventListener('keydown', ({key}) => {
        const keyLow = key.toLowerCase();

        if (keyLow === 'a' && !move.left) {
            move.left = true;
            acc.x -= vertAcc;
        }
        if (keyLow === 'd' && !move.right) {
            move.right = true;
            acc.x += vertAcc;
        }
        if (keyLow === 'w' && !move.up) {
            move.up = true;
            acc.y -= horiAcc;
        }
        if (keyLow === 's' && !move.down) {
            move.down = true;
            acc.y += horiAcc;
        }
    });

    addEventListener('keyup', ({key}) => {
        const keyLow = key.toLowerCase();

        if (keyLow === 'a' && move.left) {
            move.left = false;
            acc.x += vertAcc;
        }
        if (keyLow === 'd' && move.right) {
            move.right = false;
            acc.x -= vertAcc;
        }
        if (keyLow === 'w' && move.up) {
            move.up = false;
            acc.y += vertAcc;
        }
        if (keyLow === 's' && move.down) {
            move.down = false;
            acc.y -= vertAcc;
        }
    });

    const colliding = () => {
        //
    };

    const notColliding = () => {
        //
    };

    return {update, show, pos, vel, acc, size, move, colliding, notColliding};
};
