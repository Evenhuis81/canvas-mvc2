import type {PhaserDraw, PhaserMethods, PhaserPhase, PhaserProperties, PhaserUpdateEvent} from './types';
import type {Engine, EngineUpdate, EngineUpdateEvent} from 'library/types/engine';

let idCount = 0;
const createProperties: () => PhaserProperties = () => ({
    id: `phaser-${idCount++}`,
    timer: 0,
    totalTime: 0,
    active: false,
    atEnd: 'stop',
    phase: {
        id: 0,
        duration: 0,
    },
    event: {
        phasePercentage: 0,
        phasePercentageReverse: 1,
    },
});

const createMethods: (
    props: PhaserProperties,
    phaserDraw: PhaserDraw[],
    phases: PhaserPhase[],
    engine: Engine,
) => PhaserMethods = (props, phaserDraw, phases, engine) => ({
    startDraw: () => {
        if (!phaserDraw[0]) return;

        if (phaserDraw[0].pre) phaserDraw[0].pre(); // PreDraw

        engine.setDraw({id: `${props.id}-draw`, fn: phaserDraw[0].draw});
    },
    stopDraw: () => {
        if (!phaserDraw) return;

        if (phaserDraw[0].pre) phaserDraw[0].pre(); // PostDraw

        if (phaserDraw[0].remove) engine.removeDraw(`${props.id}-draw`); // RemoveDraw
    },
    stopPhase: phaseNr => {
        const phase = phases[phaseNr];
        if (phase.update) engine.removeUpdate(`phase-${phaseNr}`);

        if (phase.post) phase.post(); // PostPhase
    },
    phaserEnd: () => {
        engine.removeUpdate(`${props.id}-main-update`);

        if (!phaserDraw[0]) return;

        if (phaserDraw[0].post) phaserDraw[0].post(); // PostDraw

        if (phaserDraw[0].remove) engine.removeDraw(`${props.id}-draw`); // RemoveDraw

        props.totalTime = 0;
        props.phase = {id: 0, duration: 0};
    },
    resetPhaseProperties: () => {
        props.timer = 0;
        props.event.phasePercentage = 0;
        props.event.phasePercentageReverse = 1;
    },
});

export const createPhaser = (engine: Engine) => {
    const props = createProperties();
    const phases: PhaserPhase[] = [];
    const draws: PhaserDraw[] = [];

    const methods = createMethods(props, draws, phases, engine);

    const setDraw = (phaserDraw: PhaserDraw) => draws.push(phaserDraw);

    const setPhase = (phaserPhase: Omit<PhaserPhase, 'id'>) =>
        phases.push(Object.assign(phaserPhase, {id: phases.length}));

    const setPhases = (phaserPhases: Omit<PhaserPhase, 'id'>[]) =>
        phaserPhases.forEach(phase => phases.push(Object.assign(phase, {id: phases.length})));

    const phaserUpdate = createPhaserUpdate(props, methods);

    // const stopPhaser = createStopPhaser(props);
    const startPhaser = createStartPhaser(engine, props, methods, phaserUpdate);

    return {
        start: startPhaser,
        setDraw,
        setPhases,
        setPhase,
    };
};

const createStartPhaser =
    (engine: Engine, props: PhaserProperties, methods: PhaserMethods, update: EngineUpdate) => () => {
        if (props.active) return console.log(`${props.id} already active`);

        props.active = true;

        methods.startDraw();

        // props.phase = {
        //     id: 0,
        //     duration: 0,
        // }

        // methods.startPhase(props.phase);

        engine.setUpdate(update);
    };

const createPhaserUpdate = (props: PhaserProperties, methods: PhaserMethods) => ({
    id: `${props.id}-main-update`,
    name: `Main Update ${props.id}`,
    fn: (evt: EngineUpdateEvent) => {
        props.timer += evt.timePassed;
        props.totalTime += evt.timePassed;

        props.event.phasePercentage = props.timer / props.phase.duration;
        props.event.phasePercentageReverse = 1 - props.event.phasePercentage;

        if (props.phase.duration < props.timer) {
            // methods.stopPhase(props.phase);

            methods.resetPhaseProperties();

            // Find better solution for this reset
            props.event.phasePercentage = 0;
            props.event.phasePercentageReverse = 1;

            // if (!phases[++props.phase]) return methods.phaserEnd();

            // methods.startPhase(props.phase);
        }

        // New phase will start immediately, test if this is desirable
        // const phase = phases[phaseNr];

        // if (phase.pre) phase.pre(); // PrePhase

        if (props.phase.update) props.phase.update(props.event);
    },
});

const createStopPhaser = (props: PhaserProperties) => () => {
    if (!props.active) return console.log('phaser is not active!');

    //     engine.removeUpdate(`${props.id}-main-update`);

    //     props.stopDraw(props.id, props.draw, phaserEvent);

    //     // Create reset methods in properties
    //     props.timer = 0;
    //     props.phase = 0;

    props.active = false;
};
