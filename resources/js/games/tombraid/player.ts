/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import {gameStore, levelStore} from './store';
import {setStatistic} from 'library/statistics';
import {vector} from 'library/canvas';
import type {Vector} from 'games/tombraid/types/game';

// TODO::Tasks for player module
// 1. make separate modules getplayer methods / inputs / movement / collisions (whatever methods is getting too large);
// 2. expend animations / use phases;
// 3. create a 'facing' property (which direction is the player actually facing);

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
    bottomRight: string;
    xInt: number;
    yInt: number;
    movement: 'free' | 'strict';
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
    bottomRight: '',
    xInt: 0,
    yInt: 0,
    movement: 'strict',
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
    player.bottomRight = levelMap[player.yInt + 1][player.xInt + 1];

    collide[player.direction]();
};

export const friction = () => {
    player.vel.mult(player.friction);

    if (player.vel.x < 0.01 && player.vel.x > -0.01) player.vel.x = 0;
    if (player.vel.y < 0.01 && player.vel.y > -0.01) player.vel.y = 0;
};

export const getPlayer = (start: Vector) => {
    const {tv} = gameStore.state;
    player.pos.setXY(start.x, start.y);
    player.lastPos.setXY(start.x, start.y);

    const update = () => {
        // make multiple updates for different situations
        player.lastPos.setXY(player.pos.x, player.pos.y);

        player.vel.add(player.acc);

        if (player.movement === 'free') friction(); // only in free mode

        player.vel.limit(player.maxSpeed);

        // Create seperate function for this, which you can call like 'maxSpeed zoom method' or something
        // Make setScale a 'hardcoded' option (not running in every loop)
        if (
            tv.scale.x > 20 &&
            (Math.abs(player.vel.x) === player.maxSpeed || Math.abs(player.vel.y) === player.maxSpeed)
        ) {
            tv.setScaleFactor(0.99);
            tv.zoom(vector(250, 250), 'out');
        } else if (tv.scale.x < 38.48 && player.vel.x === 0 && player.vel.y === 0) {
            tv.setScaleFactor(0.95);
            tv.zoom(vector(250, 250), 'in');
        }

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
        tv.fillRect({x: player.pos.x, y: player.pos.y, w: player.w, h: player.h, fill: 'blue'});
    };

    switchMovement.initiate();

    // bunch these all up outside of a specific module (statistic handler module?)
    setStatistic(() => `playerX: ${player.pos.x.toFixed(2)}, playerY: ${player.pos.y.toFixed(2)}`);
    setStatistic(() => `velX: ${player.vel.x.toFixed(2)}, velY: ${player.vel.y.toFixed(2)}`);

    return {update, show};
};

// Input
const switchMovement = {
    free: () => {
        player.movement = 'strict';
        player.maxSpeed = 0.75; // default
        removeEventListener('keyup', keyupListenerFree);
        removeEventListener('keydown', keydownListenerFree);
        addEventListener('keydown', keydownListenerStrict);
    },
    strict: () => {
        player.movement = 'free';
        player.maxSpeed = 0.05;
        addEventListener('keyup', keyupListenerFree);
        removeEventListener('keydown', keydownListenerStrict);
        addEventListener('keydown', keydownListenerFree);
    },
    initiate: () => {
        addEventListener('keydown', keydownListenerStrict);
    },
};

const keydownListenerStrict = ({code}: KeyboardEvent) => {
    if (code === 'KeyF') return switchMovement[player.movement]();

    if (player.direction !== 'none') return;

    if (code === 'KeyW') {
        player.acc.y = -player.accSpeed;

        player.direction = 'up';
    } else if (code === 'KeyS') {
        player.acc.y = player.accSpeed;

        player.direction = 'down';
    } else if (code === 'KeyA') {
        player.acc.x = -player.accSpeed;

        player.direction = 'left';
    } else if (code === 'KeyD') {
        player.acc.x = player.accSpeed;

        player.direction = 'right';
    }
};

const keydownListenerFree = ({code}: KeyboardEvent) => {
    if (code === 'KeyF') return switchMovement[player.movement]();

    if (code === 'KeyW') player.acc.y = -player.accSpeed;
    if (code === 'KeyS') player.acc.y = player.accSpeed;
    if (code === 'KeyA') player.acc.x = -player.accSpeed;
    if (code === 'KeyD') player.acc.x = player.accSpeed;
};

const keyupListenerFree = ({code}: KeyboardEvent) => {
    if (code === 'KeyW' || code === 'KeyS' || code === 'KeyA' || code === 'KeyD') reset();
};
