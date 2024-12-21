import type {PhaserDraw, PhaserEvent, PhaserPhase, PhaserPhases, PhaserProperties} from './types';
import type {Engine, EngineUpdateEvent} from 'library/types/engine';

let idCount = 0;

const createDefaultProperties: () => PhaserProperties = () => ({
    id: `phaser${idCount++}`,
    currentPhase: 0,
    timer: 0,
    active: false,
    atEnd: 'stop',
    draw: [() => {}],
    phases: [],
});

console.log(idCount);

export const createPhaser = (engine: Engine) => {
    const props = createDefaultProperties();
    console.log(idCount);

    const setDraw = (draw: PhaserDraw) => (props.draw = draw);

    const setPhase = (phase: PhaserPhase) => props.phases.push(phase);

    const setPhases = (phases: PhaserPhases) => phases.forEach(phase => phases.push(phase));

    const destroyPhaser = () => console.log('destroy Phaser initiated');

    const stopPhaser = createStopPhaser(props, {destroyPhaser}, engine);

    const startPhaser = createStartPhaser(props, stopPhaser, engine);

    return {
        start: startPhaser,
        stop: stopPhaser,
        setDraw,
        setPhases,
        setPhase,
        props,
    };
};

const createStartPhaser = (props: PhaserProperties, stopPhaser: () => void, engine: Engine) => () => {
    if (props.active) return console.log(`Phaser with ID: ${props.id} already active`);

    const [draw, preDraw, postDraw, removeDraw] = draws[phaserID];

    props.currentPhase = 0;
    props.timer = 0;
    props.draw = draw;
    props.postDraw = postDraw;
    props.removeDraw = removeDraw;
    props.active = true;

    if (preDraw) preDraw();

    engine.setDraw(draw);

    if (!phases[phaserID] || !phases[phaserID].length) return console.log('No phases set, but draw is set');

    const [_, phaseUpdate, prePhase, __] = phases[phaserID][0];
    if (prePhase) prePhase();

    const destroyPhaser = () => {};
    const repeatPhaser = () => {};

    // Create option to start from a certain phase and/or on repeat aswell
    const phaserUpdate = createUpdate(engine, props, phases[phaserID], stopPhaser, repeatPhaser, destroyPhaser);

    engine.setUpdate(phaserUpdate);

    if (phaseUpdate) engine.setUpdate({id: `phase-${props.currentPhase}`, fn: phaseUpdate});
};

const createStopPhaser = (props: PhaserProperties, phaserEvent: PhaserEvent, engine: Engine) => () => {
    if (!props.active) return console.log('phaser is not active!');

    engine.removeUpdate(`phaser-${props.phaserID}-update-`);

    if (props.postDraw) props.postDraw(phaserEvent);

    props.timer = 0;
    props.currentPhase = 0;
    props.timer = 0;

    const index = props.active.findIndex(pID => pID === phaseID);

    if (index === -1) return console.log('current active phaseID not found.');

    props.active.splice(index, 1);
};

const createUpdate = (
    engine: Engine,
    props: PhaserProperties,
    phases: Phase[],
    stopPhaser: Function,
    repeatPhaser: Function,
    destroyPhaser: Function,
) => ({
    id: `phases-update-${props.phaserID}`,
    name: `Update phases-${props.phaserID}`,
    fn: (evt: EngineUpdateEvent) => {
        props.timer += evt.timePassed;

        evt.phasePercentage = props.timer / phases[props.currentPhase][0];
        evt.phasePercentageReverse = 1 - evt.phasePercentage;

        // [duration, update fn?, preUpdate fn?, 3-postUpdate fn?]
        if (phases[props.currentPhase][0] < props.timer) {
            const currentPhase = phases[props.currentPhase];

            engine.removeUpdate(`phase-${props.currentPhase}`);

            if (currentPhase[3]) currentPhase[3](); // postUpdate

            props.currentPhase++;
            props.timer = 0;
            evt.phasePercentage = 0;
            evt.phasePercentageReverse = 1;

            if (!phases[props.currentPhase] || !phases[props.currentPhase].length) {
                if (props.removeDraw && props.draw.id) engine.removeDraw(props.draw.id);

                if (props.atEnd === 'stop') stopPhaser(); // removes this update from engine and runs postDraw if set
                else if (props.atEnd === 'repeat') repeatPhaser();
                else if (props.atEnd === 'destroy') destroyPhaser();

                return;
            }

            const [_, update, prepare] = phases[props.currentPhase];

            if (prepare) prepare();

            if (update) engine.setUpdate({id: `phase-${props.currentPhase}`, fn: update});

            console.log('next phase set');
        }
    },
});

export const createDrawStats = (
    ctx: CanvasRenderingContext2D,
    engine: Engine,
    props: PhaserProperties,
    halfWidth: number,
    height: number,
) => ({
    id: 'stats-circy-phases',
    name: 'Phases Statistics for Circy',
    fn: () => {
        ctx.beginPath();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px monospace';
        ctx.fillStyle = '#fff';

        ctx.fillText(
            `phase: ${props.currentPhase}, timer: ${engine.info.time.last().toFixed(0)}`,
            halfWidth,
            height - 100,
        );

        // ctx.fillText(`shifting phase at: ${phaser.shifts[phaser.number]}ms`, halfWidth, height - 75);

        ctx.fillText(
            `engine updates: ${engine.info.updates.length()}, draws: ${engine.info.draws.length()}`,
            halfWidth,
            height - 50,
        );
    },
});
