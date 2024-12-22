import type {PhaserAtEnd, PhaserDraw, PhaserEvent, PhaserPhase, PhaserPhases, PhaserProperties} from './types';
import type {Engine, EngineUpdate, EngineUpdateEvent} from 'library/types/engine';

let idCount = 0;

const createDefaultProperties: (engine: Engine) => PhaserProperties = engine => ({
    id: `phaser-${idCount++}`,
    phase: 0,
    timer: 0,
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
        engine.removeDraw(`${id}-draw`);
    },
    startPhase: (phaseNr, phase) => {
        if (phase[2]) phase[2]; // PrePhase
        if (phase[1]) engine.setUpdate({id: `phase-${phaseNr}`, fn: phase[1]});
    },
    stopPhase: (phaseNr, phase) => {
        engine.removeUpdate(`phase-${phaseNr}`);
        if (phase[3]) phase[3](); // PostPhase
    },
    phaserEnd: (atEnd) => {
        if (atEnd === 'stop')
        // 'stop' | 'destroy' | 'repeat'
    },
});

console.log(idCount);

export const createPhaser = (engine: Engine) => {
    const props = createDefaultProperties(engine);
    console.log(idCount);

    const setDraw = (draw: PhaserDraw) => (props.draw = draw);

    const setPhase = (phase: PhaserPhase) => props.phases.push(phase);

    const setPhases = (phases: PhaserPhases) => phases.forEach(phase => phases.push(phase));

    const phaserUpdate = createPhaserUpdate(props);

    const startPhaser = createStartPhaser(engine, props, phaserUpdate);

    // const destroyPhaser = () => console.log('destroy Phaser initiated');
    // const repeatPhaser = () => console.log('repeat Phaser initiated');
    // const stopPhaser = createStopPhaser(props, {destroyPhaser}, engine);

    return {
        start: startPhaser,
        // stop: stopPhaser,
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

const createPhaserUpdate = (props: PhaserProperties) => ({
    id: `${props.id}-main-update`,
    name: `Main Update ${props.id}`,
    fn: (evt: EngineUpdateEvent) => {
        props.timer += evt.timePassed;

        evt.phasePercentage = props.timer / props.phases[props.phase][0];
        evt.phasePercentageReverse = 1 - evt.phasePercentage;

        // phase[0] = duration
        if (props.phases[props.phase][0] < props.timer) {
            props.stopPhase(props.phase, props.phases[props.phase]);

            props.timer = 0;
            evt.phasePercentage = 0;
            evt.phasePercentageReverse = 1;

            if (!props.phases[++props.phase]) return props.phaserEnd(props.atEnd);

            props.startPhase(props.phase, props.phases[props.phase]);
        }
    },
});

const createStopPhaser = (props: PhaserProperties, phaserEvent: PhaserEvent, engine: Engine) => () => {
    if (!props.active) return console.log('phaser is not active!');

    engine.removeUpdate(`${props.id}-main-update`);

    if (props.draw[3]) engine.removeDraw(`${props.id}-draw`); // RemoveDraw

    props.timer = 0;
    props.phase = 0;
    props.timer = 0;
};
