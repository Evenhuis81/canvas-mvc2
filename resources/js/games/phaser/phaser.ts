import type {PhaserDraw, PhaserMethods, PhaserPhase, PhaserProperties, PhaserUpdateEvent} from './types';
import type {Engine, EngineUpdate, EngineUpdateConfig, EngineUpdateEvent} from 'library/types/engine';

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
    draw: PhaserDraw | undefined,
    phases: PhaserPhase[],
    engine: Engine,
    event: PhaserUpdateEvent,
) => PhaserMethods = (props, draw, phases, engine, event) => ({
    startDraw: () => {
        // if (draw[1]) draw[1](); // PreDraw
        // if (draw[0]) engine.setDraw({id: `${id}-draw`, fn: draw[0]});
    },
    stopDraw: () => {
        // if (draw[2]) draw[2](evt); // PostDraw
        // if (draw[3]) engine.removeDraw(`${id}-draw`); // RemoveDraw
    },
    startPhase: phase => {
        // if (phases[phase][2]) phases[phase][2](); // PrePhase
        // if (phases[phase][1]) engine.setUpdate({id: `phase-${phase}`, fn: phases[phase][1]});
    },
    stopPhase: phase => {
        // if (phase[1]) engine.removeUpdate(`phase-${phase}`);
        // if (phase[3]) phase[3](); // PostPhase
    },
    phaserEnd: () => {
        // phaserAtEnd[atEnd]
        // if (atEnd === 'stop') {
        //     engine.removeUpdate(`${id}-main-update`);
        //     if (draw[2]) draw[2](evt); // PostDraw
        //     if (draw[3]) engine.removeDraw(`${id}-draw`); // RemoveDraw
        // }
    },
    resetPhaseProperties: () => {
        props.timer = 0;
        event.phasePercentage = 0;
        event.phasePercentageReverse = 1;
    },
});

export const createPhaser = (engine: Engine) => {
    const props = createProperties();
    const phases: PhaserPhase[] = [];
    let draw: PhaserDraw | undefined;
    const updateEvent = {
        phasePercentage: 0,
        phasePercentageReverse: 1,
    };
    const methods = createMethods(props, draw, phases, engine, updateEvent);

    const setDraw = (phaserDraw: PhaserDraw) => (draw = phaserDraw);

    const setPhase = (phaserPhase: Omit<PhaserPhase, 'id'>) =>
        phases.push(Object.assign(phaserPhase, {id: phases.length}));

    const setPhases = (phaserPhases: Omit<PhaserPhase, 'id'>[]) =>
        phaserPhases.forEach(phase => phases.push(Object.assign(phase, {id: phases.length})));

    const phaserUpdate = createPhaserUpdate(props, methods, phases, updateEvent);

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

        methods.startPhase(props.phase);

        engine.setUpdate(update);
    };

const createPhaserUpdate = (
    props: PhaserProperties,
    methods: PhaserMethods,
    phases: PhaserPhase[],
    event: PhaserUpdateEvent,
) => ({
    id: `${props.id}-main-update`,
    name: `Main Update ${props.id}`,
    fn: (evt: EngineUpdateEvent) => {
        props.timer += evt.timePassed;
        props.totalTime += evt.timePassed;

        event.phasePercentage = props.timer / phases[props.phase].duration;
        event.phasePercentageReverse = 1 - event.phasePercentage;

        if (phases[props.phase].duration < props.timer) {
            methods.stopPhase(props.phase);

            methods.resetPhaseProperties();

            if (!phases[++props.phase]) return methods.phaserEnd();

            methods.startPhase(props.phase);
        }
    },
});

// const createStopPhaser = (props: PhaserProperties, phaserEvent: PhaserEvent, engine: Engine) => () => {
//     if (!props.active) return console.log('phaser is not active!');

//     engine.removeUpdate(`${props.id}-main-update`);

//     props.stopDraw(props.id, props.draw, phaserEvent);

//     // Create reset methods in properties
//     props.timer = 0;
//     props.phase = 0;

//     props.active = false;
// };
