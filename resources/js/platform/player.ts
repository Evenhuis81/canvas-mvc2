/* eslint-disable complexity */
import {setEvent} from '../tombraid/input';
import {vector} from 'library/canvas';

const player = {
    size: vector(),
    pos: vector(),
    vel: vector(),
    acc: vector(),
    vertAcc: 0.2,
    horiAcc: 0.2,
    maxVelX: 5,
    maxVelY: 10,
    move: {
        grounded: true,
        left: false,
        right: false,
        up: false,
        down: false,
    },
};

export const getPlayer = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const {width: canvasWidth, height: canvasHeight} = canvas;

    player.size.setXY(canvasWidth * 0.05, canvasHeight * 0.1);
    player.pos.setXY(canvasWidth / 2 - player.size.x / 2, canvasHeight / 2 - player.size.y / 2);

    const update = () => {
        player.vel.add(player.acc);
        player.pos.add(player.vel);
    };

    const show = () => {
        context.fillStyle = '#f00';
        context.fillRect(player.pos.x, player.pos.y, player.size.x, player.size.y);
    };

    setEvent('keydown', keydownListener);
    setEvent('keyup', keyupListener);

    return {
        update,
        show,
        pos: player.pos,
        vel: player.vel,
        acc: player.acc,
        size: player.size,
        move: player.move,
    };
};

const keydownListener = ({key}: KeyboardEvent) => {
    const keyLow = key.toLowerCase();

    if (keyLow === 'a' && !player.move.left) {
        player.move.left = true;
        player.acc.x -= player.vertAcc;
    }
    if (keyLow === 'd' && !player.move.right) {
        player.move.right = true;
        player.acc.x += player.vertAcc;
    }
    if (keyLow === 'w' && !player.move.up) {
        player.move.up = true;
        player.acc.y -= player.horiAcc;
    }
    if (keyLow === 's' && !player.move.down) {
        player.move.down = true;
        player.acc.y += player.horiAcc;
    }
};

const keyupListener = ({key}: KeyboardEvent) => {
    const keyLow = key.toLowerCase();

    if (keyLow === 'a' && player.move.left) {
        player.move.left = false;
        player.acc.x += player.vertAcc;
    }
    if (keyLow === 'd' && player.move.right) {
        player.move.right = false;
        player.acc.x -= player.vertAcc;
    }
    if (keyLow === 'w' && player.move.up) {
        player.move.up = false;
        player.acc.y += player.vertAcc;
    }
    if (keyLow === 's' && player.move.down) {
        player.move.down = false;
        player.acc.y -= player.vertAcc;
    }
};

// friction
// if (player.move.grounded && player.acc.x === 0 && player.vel.x > 0) player.vel.x -= player.vertAcc;
// else if (player.move.grounded && player.acc.x === 0 && player.vel.x < 0) player.vel.x += player.vertAcc;
// if (player.move.grounded && player.acc.y === 0 && player.vel.y > 0) player.vel.y -= player.horiAcc;
// else if (player.move.grounded && player.acc.y === 0 && player.vel.y < 0) player.vel.y += player.horiAcc;

// if (Math.abs(player.vel.x) < 0.2) player.vel.x = 0;
// if (Math.abs(player.vel.y) < 0.2) player.vel.y = 0;

// limit velocity
// if (player.vel.x > player.maxVelX) player.vel.x = player.maxVelX;
// else if (player.vel.x < -player.maxVelX) player.vel.x = -player.maxVelX;

// if (player.vel.y > player.maxVelY) player.vel.y = player.maxVelY;
// else if (player.vel.y < -player.maxVelY) player.vel.y = -player.maxVelY;
