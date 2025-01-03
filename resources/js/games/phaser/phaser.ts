import type {PhaserDraw, PhaserMethods, PhaserPhase, PhaserProperties, PhaserUpdateEvent} from './types';
import type {Engine, EngineUpdate, EngineUpdateEvent} from 'library/types/engine';

let idCount = 0;
const createProperties: () => PhaserProperties = () => ({
    id: `phaser-${idCount++}`,
    phase: 0,
    timer: 0,
    totalTime: 0,
    active: false,
    atEnd: 'stop',
});

const createMethods: (
    props: PhaserProperties,
    phaserDraw: PhaserDraw[],
    phases: PhaserPhase[],
    engine: Engine<PhaserUpdateEvent>,
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
    startPhase: phaseNr => {
        const phase = phases[phaseNr];

        if (phase.pre) phase.pre(); // PrePhase

        if (phase.update) engine.setUpdate({id: `phase-${phaseNr}`, fn: phase.update});
    },
    stopPhase: phaseNr => {
        const phase = phases[phaseNr];
        if (phase.update) engine.removeUpdate(`phase-${phaseNr}`);

        if (phase.post) phase.post(); // PostPhase
    },
    phaserEnd: () => {
        // if (atEnd === 'stop') phaserAtEnd[atEnd]
        engine.removeUpdate(`${props.id}-main-update`);

        if (!phaserDraw[0]) return;

        if (phaserDraw[0].post) phaserDraw[0].post(); // PostDraw

        if (phaserDraw[0].remove) engine.removeDraw(`${props.id}-draw`); // RemoveDraw
    },
    resetPhaseProperties: () => {
        props.timer = 0;
        props.totalTime = 0;
        props.phase = 0;
    },
});

export const createPhaser = (engine: Engine<PhaserUpdateEvent>) => {
    const props = createProperties();
    const phases: PhaserPhase[] = [];
    const draws: PhaserDraw[] = [];

    const methods = createMethods(props, draws, phases, engine);

    const setDraw = (phaserDraw: PhaserDraw) => draws.push(phaserDraw);

    const setPhase = (phaserPhase: Omit<PhaserPhase, 'id'>) =>
        phases.push(Object.assign(phaserPhase, {id: phases.length}));

    const setPhases = (phaserPhases: Omit<PhaserPhase, 'id'>[]) =>
        phaserPhases.forEach(phase => phases.push(Object.assign(phase, {id: phases.length})));

    const phaserUpdate = createPhaserUpdate(props, methods, phases);

    const stopPhaser = createStopPhaser(props);
    const startPhaser = createStartPhaser(engine, props, methods, phaserUpdate);

    return {
        start: startPhaser,
        setDraw,
        setPhases,
        setPhase,
    };
};

const createStartPhaser =
    (
        engine: Engine<PhaserUpdateEvent>,
        props: PhaserProperties,
        methods: PhaserMethods,
        update: EngineUpdate<PhaserUpdateEvent>,
    ) =>
    () => {
        if (props.active) return console.log(`${props.id} already active`);

        props.active = true;

        methods.startDraw();

        methods.startPhase(props.phase);

        engine.setUpdate(update);
    };

const createPhaserUpdate = (props: PhaserProperties, methods: PhaserMethods, phases: PhaserPhase[]) => ({
    id: `${props.id}-main-update`,
    name: `Main Update ${props.id}`,
    fn: (evt: EngineUpdateEvent<PhaserUpdateEvent>) => {
        props.timer += evt.timePassed;
        props.totalTime += evt.timePassed;

        evt.phasePercentage = props.timer / phases[props.phase].duration;
        evt.phasePercentageReverse = 1 - evt.phasePercentage;

        if (phases[props.phase].duration < props.timer) {
            methods.stopPhase(props.phase);

            methods.resetPhaseProperties();

            // Find better solution for this reset
            evt.phasePercentage = 0;
            evt.phasePercentageReverse = 1;

            if (!phases[++props.phase]) return methods.phaserEnd();

            methods.startPhase(props.phase);
        }
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
