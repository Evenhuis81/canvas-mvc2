import type {PhaserDraw, PhaserEvent, PhaserMethods, PhaserPhase, PhaserProperties} from './types';
import type {Engine, EngineUpdate, EngineUpdateConfig, EngineUpdateEvent} from 'library/types/engine';

let idCount = 0;
const createProperties: () => PhaserProperties = () => ({
    id: `phaser-${idCount++}`,
    phase: 0,
    timer: 0,
    totalTime: 0,
    active: false,
    atEnd: 'stop',
    phasePercentage: 0,
    phasePercentageReverse: 1,
});

const createMethods: (
    props: PhaserProperties,
    draw: PhaserDraw | undefined,
    phases: PhaserPhase[],
    engine: Engine,
) => PhaserMethods = (props, draw, phases, engine) => ({
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
        props.phasePercentage = 0;
        props.phasePercentageReverse = 1;
    },
});

export const createPhaser = (engine: Engine) => {
    const props = createProperties();
    const phases: PhaserPhase[] = [];
    let draw: PhaserDraw | undefined;
    const methods = createMethods(props, draw, phases, engine);

    const setDraw = (phaserDraw: PhaserDraw) => (draw = phaserDraw);

    // sort according to duration / startAt and give proper phaseID
    const setPhase = (phaserPhase: Omit<PhaserPhase, 'id'>) =>
        phases.push(Object.assign(phaserPhase, {id: phases.length}));

    const setPhases = (phaserPhases: Omit<PhaserPhase, 'id'>[]) =>
        phaserPhases.forEach(phase => phases.push(Object.assign(phase, {id: phases.length})));

    const phaserEvent = {
        destroyPhaser: () => console.log('destroy Phaser initiated'),
        repeatPhaser: () => console.log('repeat Phaser initiated'),
    };

    const phaserUpdate = createPhaserUpdate(props, methods, phases);

    const startPhaser = createStartPhaser(engine, props, methods, phaserUpdate);
    // const stopPhaser = createStopPhaser(props, {destroyPhaser: () => {}}, engine);

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

const createPhaserUpdate = <K extends 'engine' | 'phaser'>(
    eType: K,
    props: PhaserProperties,
    methods: PhaserMethods,
    phases: PhaserPhase[],
): EngineUpdateConfig<K> => ({
    id: `${props.id}-main-update`,
    name: `Main Update ${props.id}`,
    eventType: eType,
    fn: (evt: EngineUpdateEvent) => {
        props.timer += evt.timePassed;
        props.totalTime += evt.timePassed;

        props.phasePercentage = props.timer / phases[props.phase].duration;
        props.phasePercentageReverse = 1 - props.phasePercentage;

        if (phases[props.phase].duration < props.timer) {
            methods.stopPhase(props.phase);

            methods.resetPhaseProperties();

            // caution, update should stop immediatly on certain phaserEnd options
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
