/* eslint-disable complexity */
import {gameStore} from './store';
import {setEvent} from './input';
import {setStatistic} from 'library/statistics';
import {vector} from 'library/canvas';
import type {Vector} from 'types/game';

const player = {
    pos: vector(),
    vel: vector(),
    acc: vector(),
    w: 1,
    h: 1,
    accSpeed: 0.01,
    maxSpeed: 0.1,
    moving: false,
};

// const collision = () => {
// get up, down, left and right block from player pos perspective
// const upBlock = functionCall();
// const downBlock = functionCall();
// const leftBlock = functionCall();
// const rightBlock = functionCall();
// };

export const getPlayer = (start: Vector) => {
    const pos = vector(start.x, start.y);

    const update = () => {
        player.vel.add(player.acc);
        player.vel.limit(player.maxSpeed);
        pos.add(player.vel);
        // collision();
    };

    const show = () => {
        gameStore.state.tv.fillRect({x: pos.x, y: pos.y, w: player.w, h: player.h, color: 'blue'});
    };

    setStatistic(() => `playerX: ${pos.x.toFixed(2)}, playerY: ${pos.y.toFixed(2)}`);
    setStatistic(() => `velX: ${player.vel.x.toFixed(2)}, velY: ${player.vel.y.toFixed(2)}`);

    return {update, show};
};

const keydownPlayer = ({code}: KeyboardEvent) => {
    if (player.moving) return;

    if (code === 'KeyW') {
        player.moving = true;
        player.acc.y -= player.accSpeed;
    } else if (code === 'KeyS') {
        player.moving = true;
        player.acc.y += player.accSpeed;
    } else if (code === 'KeyA') {
        player.moving = true;
        player.acc.x -= player.accSpeed;
    } else if (code === 'KeyD') {
        player.moving = true;
        player.acc.x += player.accSpeed;
    }
};

setEvent('keydown', keydownPlayer);
