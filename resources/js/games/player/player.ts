/* eslint-disable max-lines-per-function */
import {TransformedView} from 'games/library/types/tv';
import {vector} from 'games/library/vector';

const player = {
    pos: vector(3, 3),
    vel: vector(),
    acc: vector(),
    stroke: 'rgba(255, 255, 255, 0)',
    r: 0.25,
    rS: 0, // start of Arc
    rE: Math.PI * 2, // end of Arc
    lw: 3,
    accSpeed: 0.02,
    maxSpeed: 0.5,
    friction: 0.95,
    up: false,
    down: false,
    left: false,
    right: false,
};

const limit = () => {
    const {maxSpeed: max, vel} = player;
    vel.x = Math.min(max, Math.max(-max, vel.x));
    vel.y = Math.min(max, Math.max(-max, vel.y));
};

const fade = {
    alpha: 0,
    vel: 0,
    maxVel: 1,
    acc: 0.0001,
    phase: 1,
};

export const fadeIn = () => {
    fade.vel += fade.acc;

    fade.alpha += fade.vel;

    if (fade.alpha > 1) {
        fade.alpha = 1;
        fade.phase = 2;
    }

    player.stroke = `rgba(255, 255, 255, ${fade.alpha})`;
};

export const fadeOscillate = () => {
    // oscillaterate alpha between 0.5 and 1
    fade.vel += fade.acc;

    if (fade.vel > fade.maxVel) fade.vel = fade.maxVel;

    fade.alpha += fade.vel;

    player.stroke = `rgba(255, 255, 255, ${(Math.sin(fade.alpha) + 2) / 4 + 0.25})`;
};

const friction = () => {
    player.vel.x *= player.friction;
    player.vel.y *= player.friction;

    if (player.vel.x < 0.01 && player.vel.x > -0.01) player.vel.x = 0;
    if (player.vel.y < 0.01 && player.vel.y > -0.01) player.vel.y = 0;
};

const keyUpDown = (code: string, flag: boolean) => {
    if (code === 'KeyW') player.up = flag;
    if (code === 'KeyS') player.down = flag;
    if (code === 'KeyA') player.left = flag;
    if (code === 'KeyD') player.right = flag;
};

addEventListener('keydown', ({code}) => {
    keyUpDown(code, true);
});

addEventListener('keyup', ({code}) => {
    keyUpDown(code, false);
});

const phase: Record<number, () => void> = {
    0: () => {},
    1: () => fadeIn(),
    2: () => fadeOscillate(),
    3: () => {},
};

export const getPlayer = () => {
    const {pos, vel, acc} = player;

    const createShow = (tv: TransformedView) => ({
        id: 4,
        name: 'player',
        fn: () => {
            phase[fade.phase]();

            tv.strokeCircle({
                x: player.pos.x,
                y: pos.y,
                r: player.r,
                lw: player.lw,
                rS: player.rS,
                rE: player.rE,
                stroke: player.stroke,
            });
        },
    });

    const createUpdate = () => ({
        id: 4,
        name: 'player',
        fn: () => {
            if (player.up) player.acc.y = -player.accSpeed;
            if (player.down) player.acc.y = player.accSpeed;
            if (player.left) player.acc.x = -player.accSpeed;
            if (player.right) player.acc.x = player.accSpeed;

            vel.x += acc.x;
            vel.y += acc.y;

            friction();

            limit();

            pos.x += vel.x;
            pos.y += vel.y;

            acc.x = 0;
            acc.y = 0;
        },
    });

    return {createShow, createUpdate};
};
