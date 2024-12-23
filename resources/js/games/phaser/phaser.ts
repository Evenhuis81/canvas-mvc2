import type {PhaserDraw, PhaserEvent, PhaserPhase, PhaserPhases, PhaserProperties} from './types';
import type {Engine, EngineUpdate, EngineUpdateEvent} from 'library/types/engine';

let idCount = 0;
const createDefaultProperties: (engine: Engine) => PhaserProperties = engine => ({
    id: `phaser-${idCount++}`,
    phase: 0,
    timer: 0,
    totalTime: 0,
    active: false,
    atEnd: 'stop',
    draw: [() => {}],
    phases: [],
    startDraw: (id, draw) => {
        if (draw[1]) draw[1](); // PreDraw
        engine.setDraw({id: `${id}-draw`, fn: draw[0]});
    },
    stopDraw: (id, draw, evt) => {
        if (draw[2]) draw[2](evt); // PostDraw
        if (draw[3]) engine.removeDraw(`${id}-draw`); // RemoveDraw
    },
    startPhase: (phaseNr, phase) => {
        if (phase[2]) phase[2]; // PrePhase
        if (phase[1]) engine.setUpdate({id: `phase-${phaseNr}`, fn: phase[1]});
    },
    stopPhase: (phaseNr, phase) => {
        if (phase[1]) engine.removeUpdate(`phase-${phaseNr}`);
        if (phase[3]) phase[3](); // PostPhase
    },
    phaserEnd: (id, atEnd, draw, evt) => {
        // phaserAtEnd[atEnd]
        if (atEnd === 'stop') {
            engine.removeUpdate(`${id}-main-update`);

            if (draw[2]) draw[2](evt); // PostDraw
            if (draw[3]) engine.removeDraw(`${id}-draw`); // RemoveDraw
        }
    },
});

const phaserAtEnd = {
    stop: () => {
        //
    },
    repeat: () => {},
    destroy: () => {},
};

export const createPhaser = (engine: Engine) => {
    const props = createDefaultProperties(engine);

    const setDraw = (draw: PhaserDraw) => (props.draw = draw);

    const setPhase = (phase: PhaserPhase) => props.phases.push(phase);

    const setPhases = (phases: PhaserPhases) => phases.forEach(phase => phases.push(phase));

    const destroyPhaser = () => console.log('destroy Phaser initiated');

    // const repeatPhaser = () => console.log('repeat Phaser initiated');

    const phaserEvent = {
        destroyPhaser,
    };

    const phaserUpdate = createPhaserUpdate(props, phaserEvent);

    const startPhaser = createStartPhaser(engine, props, phaserUpdate);

    const stopPhaser = createStopPhaser(props, {destroyPhaser: () => {}}, engine);

    return {
        start: startPhaser,
        stop: stopPhaser,
        // repeat: repeatPhaser,
        // destroy: destroyPhaser,
        setDraw,
        setPhases,
        setPhase,
    };
};

const createStartPhaser = (engine: Engine, props: PhaserProperties, update: EngineUpdate) => () => {
    if (props.active) return console.log(`${props.id} already active`);
    props.active = true;

    props.startDraw(props.id, props.draw);

    props.startPhase(props.phase, props.phases[props.phase]);

    engine.setUpdate(update);
};

const createPhaserUpdate = (props: PhaserProperties, phaserEvent: PhaserEvent) => ({
    id: `${props.id}-main-update`,
    name: `Main Update ${props.id}`,
    fn: (evt: EngineUpdateEvent) => {
        props.timer += evt.timePassed;
        props.totalTime += evt.timePassed;

        evt.phasePercentage = props.timer / props.phases[props.phase][0];
        evt.phasePercentageReverse = 1 - evt.phasePercentage;

        // phase[0] = duration
        if (props.phases[props.phase][0] < props.timer) {
            props.stopPhase(props.phase, props.phases[props.phase]);

            props.timer = 0;
            evt.phasePercentage = 0;
            evt.phasePercentageReverse = 1;

            // phaserEnd.stop: postDraw, removeDraw, remove main update
            if (!props.phases[++props.phase]) return props.phaserEnd(props.id, props.atEnd, props.draw, phaserEvent);

            props.startPhase(props.phase, props.phases[props.phase]);
        }
    },
});

const createStopPhaser = (props: PhaserProperties, phaserEvent: PhaserEvent, engine: Engine) => () => {
    if (!props.active) return console.log('phaser is not active!');

    engine.removeUpdate(`${props.id}-main-update`);

    props.stopDraw(props.id, props.draw, phaserEvent);

    // Create reset methods in properties
    props.timer = 0;
    props.phase = 0;

    props.active = false;
};
