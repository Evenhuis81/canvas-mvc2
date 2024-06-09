import {Side} from './types';
import {pickString} from 'library/tools';

let sqID = 0;

export const createSquare = (width: number, height: number, side?: Side) => {
    // TODO::Either from a random side or a random location on the screen
    const squareID = sqID;
    sqID++;

    const s = Math.random() * 15 + 15; // between 15 and 30
    const sq = {s, width, height};

    const {x, y, vX, vY} = sideSwitch[side ?? pickString<Side>(['top', 'bottom', 'left', 'right'])](sq);

    return {
        id: squareID,
        x,
        y,
        vX,
        vY,
        s,
        r: 5,
        alpha: 0,
        alphaVel: Math.random() * 0.01, // 0.001 - 0.01 ?
        angle: 0,
        angleVel: Math.random() * 0.1 * (Math.random() < 0.5 ? 1 : -1), // 0.01 - 0.1 ? (or negative)
        red: Math.random() * 256,
        green: Math.random() * 256,
        blue: Math.random() * 256,
        minAlpha: Math.random() * 0.5,
        maxAlpha: Math.random() * 0.5 + 0.5,
        blinked: 0,
        paused: false,
    };
};

type SQ = {s: number; height: number; width: number};

const sideSwitch: Record<Side, (sq: SQ) => {x: number; y: number; vX: number; vY: number}> = {
    top: (sq: SQ) => ({
        x: Math.random() * (sq.width * 0.6) + sq.width * 0.2,
        y: -sq.s,
        vX: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
        vY: Math.random() * 0.3 + 1,
    }),
    bottom: (sq: SQ) => ({
        x: Math.random() * (sq.width * 0.6) + sq.width * 0.2,
        y: sq.height,
        vX: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
        vY: -(Math.random() * 0.3 + 1),
    }),
    left: (sq: SQ) => ({
        x: -sq.s,
        y: Math.random() * (sq.height * 0.6) + sq.height * 0.2,
        vX: Math.random() * 0.3 + 1,
        vY: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
    }),
    right: (sq: SQ) => ({
        x: sq.width,
        y: Math.random() * (sq.height * 0.6) + sq.height * 0.2,
        vX: -(Math.random() * 0.3 + 1),
        vY: Math.random() * 0.3 + 1 * (Math.random() < 0.5 ? 1 : -1),
    }),
};
