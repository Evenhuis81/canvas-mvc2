/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import {Vector} from './types/vector';
import {resources} from './store';
import {vector} from './vector';

type Side = 'top' | 'bottom' | 'left' | 'right';
type SQ = {s: number; height: number; width: number};

// unused for now, move to toolbox (= limit on vector)
export const clamp = (obj: {value: number; min: number; max: number}) =>
    Math.min(obj.max, Math.max(obj.min, obj.value));

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

const randomSide = () => {
    const dice = Math.random();

    if (dice < 0.25) return 'top';
    if (dice < 0.5) return 'bottom';
    if (dice < 0.75) return 'left';

    return 'right';
};

let sqId = 0;

const createSquare = (width: number, height: number, side?: Side) => {
    // TODO::Appear randomly on screen aswell within certain bound
    const squareID = sqId;
    sqId++;

    const s = Math.random() * 15 + 15; // between 15 and 30
    const sq = {s, width, height};

    const {x, y, vX, vY} = sideSwitch[side ?? randomSide()](sq);

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

const squares: Square[] = [];
const permaSquares: Square[] = [];

type Square = {
    id: number;
    x: number;
    y: number;
    s: number;
    r: number;
    alpha: number;
    alphaVel: number;
    angle: number;
    angleVel: number;
    red: number;
    green: number;
    blue: number;
    minAlpha: number;
    maxAlpha: number;
    vX: number;
    vY: number;
    blinked: number;
    paused: boolean;
};

export default {
    createDemoUpdate: (storeID: string) => {
        const {context: ctx} = resources.state[storeID];
        const {width, height} = ctx.canvas;
        const target = vector(width / 2, height / 2);

        const sqToRemoveByID: number[] = [];

        let count = 0;
        const countIncrease = 10;
        let threshold = 0;

        addEventListener('keydown', ({code}) => {
            if (code === 'KeyW') squares.push(createSquare(width, height, 'top'));
            if (code === 'KeyS') squares.push(createSquare(width, height, 'bottom'));
            if (code === 'KeyA') squares.push(createSquare(width, height, 'left'));
            if (code === 'KeyD') squares.push(createSquare(width, height, 'right'));
        });

        const name = 'demo update';
        const fn = () => {
            for (let i = 0; i < squares.length; i++) {
                const sq = squares[i];

                sq.x += sq.vX;
                sq.y += sq.vY;

                // collision (outside of screen)
                if (sq.x < -sq.s || sq.x > width || sq.y < -sq.s || sq.y > height) {
                    sqToRemoveByID.push(sq.id);

                    continue;
                }

                sq.angle += sq.angleVel;
                sq.alpha -= sq.alphaVel;

                if (sq.alpha < sq.minAlpha) {
                    sq.alpha = sq.minAlpha;
                    sq.alphaVel *= -1;
                } else if (sq.alpha > sq.maxAlpha) {
                    sq.alpha = sq.maxAlpha;
                    sq.alphaVel *= -1;
                    sq.blinked++;

                    if (sq.blinked === 2 && permaSquares.length < 20) {
                        addPermaSquare(sq);
                        sq.blinked = 0;

                        if (permaSquares.length === 20) permaSquareAnimateX(permaSquares, target);
                    }
                }
            }

            for (const psq of permaSquares) {
                psq.x += psq.vX;
                psq.y += psq.vY;

                if (animate.perma.x && !psq.paused) {
                    const distanceLeftToTarget = Math.abs(target.x - psq.x);

                    if (distanceLeftToTarget < 5) {
                        psq.x = target.x;
                        psq.vX = 0;
                        psq.paused = true;

                        animate.perma.atX++;

                        if (animate.perma.atX === 20) permaSquareAnimateY(permaSquares, target);
                    }
                } else if (animate.perma.y && !psq.paused) {
                    const distanceLeftToTarget = Math.abs(target.y - psq.y);

                    if (distanceLeftToTarget < 5) {
                        psq.y = target.y;
                        psq.vY = 0;
                        psq.paused = true;

                        animate.perma.atY++;

                        if (animate.perma.atY === 20) permaSquareAnimateNextPhase(permaSquares, target);
                    }
                }
            }

            count++;

            if (count > threshold && animate.paused) {
                threshold += countIncrease;
                squares.push(createSquare(width, height));
            }

            // remove squares out of bound of view
            for (let i = 0; i < sqToRemoveByID.length; i++) {
                const indexToRemove = squares.findIndex(square => square.id === sqToRemoveByID[i]);

                squares.splice(indexToRemove, 1);
            }

            sqToRemoveByID.length = 0;
        };

        return {id: 88, name, fn};
    },
    createDemoShow: (storeID: string) => {
        const {context: ctx} = resources.state[storeID];

        const name = 'demo show';
        const fn = () => {
            for (let i = 0; i < squares.length; i++) {
                const sq = squares[i];

                ctx.lineWidth = 2;
                ctx.strokeStyle = `rgba(${sq.red}, ${sq.green}, ${sq.blue}, ${sq.alpha})`;

                const x = sq.x + sq.s / 2;
                const y = sq.y + sq.s / 2;

                ctx.beginPath();

                ctx.save();

                ctx.translate(x, y);
                ctx.rotate(sq.angle);
                ctx.translate(-x, -y);

                ctx.roundRect(sq.x, sq.y, sq.s, sq.s, sq.r);
                ctx.stroke();

                ctx.restore();

                // showCollisionCorners(ctx, sq);
            }

            for (let i = 0; i < permaSquares.length; i++) {
                const sq = permaSquares[i];

                ctx.lineWidth = 2;
                ctx.strokeStyle = `rgba(${sq.red}, ${sq.green}, ${sq.blue}, ${sq.alpha})`;

                const x = sq.x + sq.s / 2;
                const y = sq.y + sq.s / 2;

                ctx.beginPath();

                ctx.save();

                ctx.translate(x, y);
                ctx.rotate(sq.angle);
                ctx.translate(-x, -y);

                ctx.roundRect(sq.x, sq.y, sq.s, sq.s, sq.r);
                ctx.stroke();

                ctx.restore();
            }
        };

        return {id: 88, name, fn};
    },
};

export const showCollisionCorners = (ctx: CanvasRenderingContext2D, sq: Square) => {
    // TL
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(sq.x, sq.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // TR
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(sq.x + sq.s, sq.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // BL
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(sq.x, sq.y + sq.s, 4, 0, Math.PI * 2);
    ctx.fill();

    // BR
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.arc(sq.x + sq.s, sq.y + sq.s, 4, 0, Math.PI * 2);
    ctx.fill();
};

const permaSquareAnimateNextPhase = (permaSq: Square[], target: Vector) => {
    animate.perma.atY = 0;
    animate.perma.y = false;
    animate.paused = true;

    console.log(`permaSquareLastPhase initiating: ${permaSq[0].vX} ${permaSq[0].vY}`, target.x);
};

const animate = {
    paused: true,
    perma: {
        x: false,
        y: false,
        atX: 0,
        atY: 0,
    },
};

const permaSquareAnimateX = (permaSq: Square[], target: Vector) => {
    animate.perma.x = true;
    animate.paused = false;
    // move all x positions to middle of screen with a certain speed
    for (const ps of permaSq) {
        console.log(ps.angle);
        const distanceX = target.x - ps.x;
        ps.vX = distanceX / 90; // = 1.5 second till middle x is reached
    }
};

const permaSquareAnimateY = (permaSq: Square[], target: Vector) => {
    // move all y positions to middle of screen with a certain speed
    for (const sq of permaSq) {
        sq.paused = false;
        const distanceY = target.y - sq.y;
        sq.vY = distanceY / 90; // = 1.5 second till middle y is reached
    }

    animate.perma.atX = 0;
    animate.perma.x = false;
    animate.perma.y = true;
};

const addPermaSquare = (sq: Square) => {
    const newSq = {...sq};
    newSq.vX = 0;
    newSq.vY = 0;
    permaSquares.push(newSq);
};
