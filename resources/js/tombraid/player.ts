import {gameStore} from './store';
import {setEvent} from './input';
import {setStatistic} from 'library/statistics';
import {vector} from 'library/canvas';
import type {Vector} from 'types/game';

export const getPlayer = (start: Vector) => {
    const pos = vector(start.x, start.y);
    const vel = vector();
    const acc = vector();
    const size = vector(1, 1);
    const accSpeed = 0.01;
    const maxSpeed = 0.1;
    const friction = 0.93;

    const addForce = (force: Vector) => {
        acc.add(force);
    };

    const update = () => {
        if (move.up) acc.y -= accSpeed;
        if (move.down) acc.y += accSpeed;
        if (move.left) acc.x -= accSpeed;
        if (move.right) acc.x += accSpeed;

        vel.add(acc);
        vel.mult(friction);

        vel.limit(maxSpeed);
        pos.add(vel);

        acc.setXY(0, 0);
    };

    const show = () => {
        gameStore.state.tv.fillRect(pos, size, 'red');
    };

    setStatistic(() => `playerX: ${pos.x.toFixed(2)}, playerY: ${pos.y.toFixed(2)}`);
    setStatistic(() => `velX: ${vel.x.toFixed(2)}, velY: ${vel.y.toFixed(2)}`);

    return {update, show, addForce};
};

const move = {
    up: false,
    down: false,
    left: false,
    right: false,
};

const keydownPlayer = ({code}: KeyboardEvent) => {
    if (code === 'KeyW') move.up = true;
    else if (code === 'KeyS') move.down = true;
    else if (code === 'KeyA') move.left = true;
    else if (code === 'KeyD') move.right = true;
};

const keyupPlayer = ({code}: KeyboardEvent) => {
    if (code === 'KeyW') move.up = false;
    else if (code === 'KeyS') move.down = false;
    else if (code === 'KeyA') move.left = false;
    else if (code === 'KeyD') move.right = false;
};

setEvent('keydown', keydownPlayer);
setEvent('keyup', keyupPlayer);
