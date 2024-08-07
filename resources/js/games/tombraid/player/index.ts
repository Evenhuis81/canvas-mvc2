/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import {levelStore, Resources} from '..';
import {vec, vector} from 'library/vector';
import type {Vector} from 'library/types/vector';
import {TransformedView} from 'library/types/tv';

// TODO::Tasks for player module
// 1. make separate modules getplayer methods / inputs / movement / collisions (whatever methods is getting too large);
// 2. expend animations / use phases;
// 3. create a 'facing' property (which direction is the player actually facing);

type PlayerProperties = {
    posMiddle: Vector; // middle of rect
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
    posMiddle: vector(),
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
    player.vel.x = 0;
    player.vel.y = 0;
    player.acc.x = 0;
    player.acc.y = 0;
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

    // add collision for coinMap
    collide[player.direction]();
};

export const friction = () => {
    player.vel.x *= player.friction;
    player.vel.y *= player.friction;

    if (player.vel.x < 0.01 && player.vel.x > -0.01) player.vel.x = 0;
    if (player.vel.y < 0.01 && player.vel.y > -0.01) player.vel.y = 0;
};

export const getPlayer = () => {
    // TV method to set player in middle of screen

    const {tv} = Resources.state;

    const update = {
        id: 3,
        name: 'player',
        fn: () => {
            // test efficiency
            player.lastPos = {...player.pos};
            vec.add(player.vel, player.acc);

            if (player.movement === 'free') friction(); // only in free mode

            vec.limit(player.vel, -player.maxSpeed, player.maxSpeed);

            player.pos.x += player.vel.x;
            player.pos.y += player.vel.y;

            player.posMiddle.x = player.pos.x + 0.5;
            player.posMiddle.y = player.pos.y + 0.5;

            collisionAndResolve();

            // integrated in transformed view
            const xChange = player.lastPos.x - player.pos.x;
            const yChange = player.lastPos.y - player.pos.y;

            player.posChangeHistory.shift();
            player.posChangeHistory.push(vector(-xChange, -yChange));

            Resources.state.tv.offset.x += player.posChangeHistory[0].x;
            Resources.state.tv.offset.y += player.posChangeHistory[0].y;
        },
    };

    const setPosition = (pos: Vector) => {
        player.pos.x = pos.x;
        player.pos.y = pos.y;
        player.lastPos.x = pos.x;
        player.lastPos.y = pos.y;
    };

    switchMovement.initiate();

    return {update, show: createShowCircle(tv), setPosition, middlePos: player.posMiddle};
};

export const createShowRect = (tv: TransformedView) => ({
    id: 3,
    name: 'player',
    fn: () => {
        tv.fillRect({x: player.pos.x, y: player.pos.y, w: player.w, h: player.h, fill: 'blue'});
    },
});

// This is needed for tv follow method so that the position is actually in the middle and I dont'need +0.5
const createShowCircle = (tv: TransformedView) => ({
    id: 3,
    name: 'player',
    fn: () => {
        tv.fillStrokeCircle({
            x: player.pos.x + 0.5,
            y: player.pos.y + 0.5,
            r: 0.25,
            rS: 0,
            rE: Math.PI * 2,
            fill: 'blue',
            stroke: 'red',
            lw: 3,
        });
    },
});

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
