/* eslint-disable complexity */
import {gameStore} from './store';
import {setEvent} from './input';
import {setStatistic} from 'library/statistics';
import {vector} from 'library/canvas';
import type {Vector} from 'games/tombraid/types/game';

const player = {
    pos: vector(),
    vel: vector(),
    acc: vector(),
    w: 1,
    h: 1,
    accSpeed: 0.01,
    maxSpeed: 0.1,
    friction: 0.94,
    up: false,
    down: false,
    left: false,
    right: false,
};

export const getPlayer = (start: Vector) => {
    player.pos = vector(start.x, start.y);

    const update = () => {
        if (player.up) player.acc.y = -player.accSpeed;
        if (player.down) player.acc.y = player.accSpeed;
        if (player.left) player.acc.x = -player.accSpeed;
        if (player.right) player.acc.x = player.accSpeed;

        // this could be optional (only active when moving)
        player.vel.add(player.acc);

        // friction (make this better)
        if (!player.up && !player.down && !player.left && !player.right) {
            player.vel.mult(0.95);

            if (player.vel.x < 0.01 && player.vel.x > -0.01) player.vel.x = 0;
            if (player.vel.y < 0.01 && player.vel.y > -0.01) player.vel.y = 0;
        }

        player.vel.limit(player.maxSpeed);
        player.pos.add(player.vel);

        player.acc.setXY(0, 0);
    };

    // make createShow
    const show = () => {
        gameStore.state.tv.fillRect({x: player.pos.x, y: player.pos.y, w: player.w, h: player.h, fill: 'blue'});
    };

    // bunch these all up outside of a specific module (statistic handler module?)
    setStatistic(() => `playerX: ${player.pos.x.toFixed(2)}, playerY: ${player.pos.y.toFixed(2)}`);
    setStatistic(() => `velX: ${player.vel.x.toFixed(2)}, velY: ${player.vel.y.toFixed(2)}`);

    return {update, show};
};

const keyListener =
    (flag: boolean) =>
    ({code}: KeyboardEvent) => {
        if (code === 'KeyW') player.up = flag;
        if (code === 'KeyS') player.down = flag;
        if (code === 'KeyA') player.left = flag;
        if (code === 'KeyD') player.right = flag;
    };

setEvent('keydown', keyListener(true));
setEvent('keyup', keyListener(false));
