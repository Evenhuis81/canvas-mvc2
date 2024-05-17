/* eslint-disable complexity */
import {gameStore, levelStore} from './store';
import {setEvent} from './input';
import {setStatistic} from 'library/statistics';
import {vector} from 'library/canvas';
import type {Vector} from 'games/tombraid/types/game';

type PlayerProperties = {
    pos: Vector;
    vel: Vector;
    acc: Vector;
    w: number;
    h: number;
    accSpeed: number;
    maxSpeed: number;
    friction: number;
    direction: 'none' | 'up' | 'down' | 'left' | 'right';
    posChangeHistory: Vector[];
    lastPos: Vector;
    topLeft: string;
    bottomLeft: string;
    topRight: string;
    xInt: number;
    yInt: number;
};

const player: PlayerProperties = {
    pos: vector(),
    vel: vector(),
    acc: vector(),
    w: 1,
    h: 1,
    accSpeed: 0.04,
    maxSpeed: 0.75,
    friction: 0.95,
    direction: 'none',
    posChangeHistory: Array(10).fill(vector()),
    lastPos: vector(),
    topLeft: '',
    bottomLeft: '',
    topRight: '',
    xInt: 0,
    yInt: 0,
};

const reset = () => {
    player.direction = 'none';
    player.vel.setXY(0, 0);
    player.acc.setXY(0, 0);
};

const collide = {
    up: () => {
        if (player.topLeft === 'X') {
            player.pos.y = player.yInt + 1;
            reset();
        }
    },
    down: () => {
        if (player.bottomLeft === 'X') {
            player.pos.y = player.yInt;
            reset();
        }
    },
    left: () => {
        if (player.topLeft === 'X') {
            player.pos.x = player.xInt + 1;
            reset();
        }
    },
    right: () => {
        if (player.topRight === 'X') {
            player.pos.x = player.xInt;
            reset();
        }
    },
};

const collisionAndResolve = () => {
    if (player.direction === 'none') return;

    const {map: levelMap} = levelStore.state;

    player.yInt = Math.floor(player.pos.y);
    player.xInt = Math.floor(player.pos.x);

    player.topLeft = levelMap[player.yInt][player.xInt];
    player.bottomLeft = levelMap[player.yInt + 1][player.xInt];
    player.topRight = levelMap[player.yInt][player.xInt + 1];

    collide[player.direction]();
};

export const setFriction = () => {
    // make this better
    if (player.direction === 'none') {
        player.vel.mult(player.friction);

        if (player.vel.x < 0.01 && player.vel.x > -0.01) player.vel.x = 0;
        if (player.vel.y < 0.01 && player.vel.y > -0.01) player.vel.y = 0;
    }
};

export const getPlayer = (start: Vector) => {
    player.pos.setXY(start.x, start.y);
    player.lastPos.setXY(start.x, start.y);

    const update = () => {
        player.lastPos.setXY(player.pos.x, player.pos.y);

        player.vel.add(player.acc);

        setFriction();

        player.vel.limit(player.maxSpeed);

        player.pos.add(player.vel);

        collisionAndResolve();

        // integrated in transformed view
        const xChange = player.lastPos.x - player.pos.x;
        const yChange = player.lastPos.y - player.pos.y;

        player.posChangeHistory.shift();
        player.posChangeHistory.push(vector(-xChange, -yChange));

        gameStore.state.tv.offset.x += player.posChangeHistory[0].x;
        gameStore.state.tv.offset.y += player.posChangeHistory[0].y;
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

// const keyListener =
//     (flag: boolean) =>
//     ({code}: KeyboardEvent) => {
//         if (code === 'KeyW') player.up = flag;
//         if (code === 'KeyS') player.down = flag;
//         if (code === 'KeyA') player.left = flag;
//         if (code === 'KeyD') player.right = flag;
//     };

const keydownListener = ({code}: KeyboardEvent) => {
    if (player.direction !== 'none') return;

    if (code === 'KeyW') {
        player.acc.y = -player.accSpeed;

        player.direction = 'up';
    }
    if (code === 'KeyS') {
        player.acc.y = player.accSpeed;

        player.direction = 'down';
    }
    if (code === 'KeyA') {
        player.acc.x = -player.accSpeed;

        player.direction = 'left';
    }
    if (code === 'KeyD') {
        player.acc.x = player.accSpeed;

        player.direction = 'right';
    }
};

// const keyupListener = ({code}: KeyboardEvent) => {
//     if (code === 'KeyW' || code === 'KeyS' || code === 'KeyA' || code === 'KeyD') {
//         player.direction = 'none';
//         player.acc.setXY(0, 0);
//         player.vel.setXY(0, 0);
//     }
// };

setEvent('keydown', keydownListener);
// setEvent('keyup', keyupListener);

// export const direction = {
//     up: () => {
//         // check top
//         // check left
//         // check right
//         player.acc.y = -player.accSpeed;
//     },
//     down: () => {
//         player.acc.y = player.accSpeed;
//     },
//     left: () => {
//         player.acc.x = -player.accSpeed;
//     },
//     right: () => {
//         player.acc.x = player.accSpeed;
//     },
// };
