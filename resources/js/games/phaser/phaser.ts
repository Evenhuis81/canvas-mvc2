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
    startDraw: (id: string, draw: PhaserDraw) => {
        if (draw[1]) draw[1](); // PreDraw
        engine.setDraw({id: `${id}-draw`, fn: draw[0]});
    },
    stopDraw: (id: string, draw: PhaserDraw, evt: PhaserEvent) => {
        if (draw[2]) draw[2](evt); // PostDraw
        engine.removeDraw(`${id}-draw`);
    },
    startPhase: (phase: number) => {
        //
    },
    stopPhase: (phase: number) => {
        //
    },
    endPhases: (atEnd: PhaserAtEnd) => {
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

    // const destroyPhaser = () => console.log('destroy Phaser initiated');

    // const repeatPhaser = () => console.log('repeat Phaser initiated');

    // const stopPhaser = createStopPhaser(props, {destroyPhaser}, engine);

    const startPhaser = createStartPhaser(props);

    // const phaserUpdate = createPhaserUpdate(engine, props, stopPhaser, repeatPhaser, destroyPhaser);

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

const createStartPhaser = (props: PhaserProperties) => () => {
    if (props.active) return console.log(`${props.id} already active`);
    props.active = true;

    props.startDraw(props.id, props.draw);

    props.startPhase(props.phase);
};

//             engine.removeUpdate(`phase-${props.phase}`);
//             if (phase[3]) phase[3](); // PostPhase
//             props.phase++;
//
//                 if (props.draw[3]) engine.removeDraw(`${props.id}-draw`);
//                 phaserEnd[props.atEnd]();
//                 return;
//             }

const startNextPhase = () => {
    // const [_, update, prepare] = phases[props.phase];
    // if (prepare) prepare();
    // if (update) engine.setUpdate({id: `phase-${props.phase}`, fn: update});
    // if (props.phases[0][2]) props.phases[0][2]; // PrePhase
    //             props.timer = 0;
    //             evt.phasePercentage = 0;
    //             evt.phasePercentageReverse = 1;

    console.log('next phase set');
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
            props.stopPhase(props.phase);

            if (!props.phases[++props.phase]) return props.endPhases(props.atEnd);

            props.startPhase(props.phase);
        }
    },
});

// const createStopPhaser = (props: PhaserProperties, phaserEvent: PhaserEvent, engine: Engine) => () => {
//     if (!props.active) return console.log('phaser is not active!');

//     engine.removeUpdate(`phaser-${props.phaserID}-update-`);

//     if (props.postDraw) props.postDraw(phaserEvent);

//     props.timer = 0;
//     props.phase = 0;
//     props.timer = 0;
// };
