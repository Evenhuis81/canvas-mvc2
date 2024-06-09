/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import {createSquare} from './shapes';
import {resources} from './store';
import {vec, vector} from './vector';
import type {Square} from './shapes/types';
import type {Vector} from './types/vector';

const squares: Square[] = [];
const permaSquares: Square[] = [];

export type DemoProperties = {
    target: Vector;
    sqToRemoveByID: number[];
    sqID: number;
    count: number;
    countIncrease: number;
    threshold: number;
};

const demoProperties: DemoProperties = {
    target: vector(),
    sqToRemoveByID: [],
    sqID: 0,
    count: 0,
    countIncrease: 5,
    threshold: 0,
};

export default {
    createDemoUpdate: (storeID: string) => {
        const {context: ctx} = resources.state[storeID];
        const {width, height} = ctx.canvas;
        demoProperties.target.x = width / 2;
        demoProperties.target.y = height / 2;

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
                    demoProperties.sqToRemoveByID.push(sq.id);

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

                    if (sq.blinked === animate.perma.maxBlink && permaSquares.length < 20) {
                        addPermaSquare(sq);
                        sq.blinked = 0;

                        if (permaSquares.length === 20) permaSqFast(permaSquares);
                        // permaSquareAnimateX(permaSquares, target);
                    }
                }
            }

            for (const psq of permaSquares) {
                const {target} = demoProperties;

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

                        if (animate.perma.atY === animate.perma.maxSq) permaSquareAnimateNextPhase(permaSquares);
                    }
                }
            }

            demoProperties.count++;

            if (demoProperties.count > demoProperties.threshold && animate.paused) {
                demoProperties.threshold += demoProperties.countIncrease;
                squares.push(createSquare(width, height));
            }

            // remove squares out of bound of view
            for (let i = 0; i < demoProperties.sqToRemoveByID.length; i++) {
                const indexToRemove = squares.findIndex(square => square.id === demoProperties.sqToRemoveByID[i]);

                squares.splice(indexToRemove, 1);
            }

            demoProperties.sqToRemoveByID.length = 0;
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

                showCollisionCorners(ctx, sq);
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

const permaSquareAnimateNextPhase = (permaSq: Square[]) => {
    // optional at perma animate x / y => make them rotate to a certain degree (neg and pos)

    // console.log();
    animate.perma.atY = 0;
    animate.perma.y = false;
    animate.paused = true;

    for (const sq of permaSq) {
        const rand2D = vec.random();

        sq.vX = rand2D.x * animate.perma.rand2DMult;
        sq.vY = rand2D.y * animate.perma.rand2DMult;
    }
};

const animate = {
    paused: true,
    perma: {
        x: false,
        y: false,
        atX: 0,
        atY: 0,
        rand2DMult: 2,
        maxSq: 50,
        maxBlink: 1,
    },
};

const permaSqFast = (permaSq: Square[]) => {
    for (const ps of permaSq) {
        ps.x = innerWidth / 2;
        ps.y = innerHeight / 2;

        permaSquareAnimateNextPhase(permaSq);
    }
};

export const permaSquareAnimateX = (permaSq: Square[], target: Vector) => {
    animate.perma.x = true;
    animate.paused = false;
    // move all x positions to middle of screen with a certain speed
    for (const ps of permaSq) {
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
