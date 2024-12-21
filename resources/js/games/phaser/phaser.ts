import type {PhaserDraw, PhaserEvent, PhaserPhase, PhaserPhases, PhaserProperties} from './types';
import type {Engine, EngineUpdate, EngineUpdateEvent} from 'library/types/engine';

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

    const repeatPhaser = () => console.log('repeat Phaser initiated');

    const stopPhaser = createStopPhaser(props, {destroyPhaser}, engine);

    const phaserUpdate = createPhaserUpdate(engine, props, stopPhaser, repeatPhaser, destroyPhaser);

    const startPhaser = createStartPhaser(props, phaserUpdate, engine);

    return {
        start: startPhaser,
        stop: stopPhaser,
        destroy: destroyPhaser,
        repeat: repeatPhaser,
        setDraw,
        setPhases,
        setPhase,
    };
};

const createStartPhaser = (props: PhaserProperties, phaserUpdate: EngineUpdate, engine: Engine) => () => {
    if (props.active) return console.log(`${props.id} already active`);

    // reset properties? (timer, currentPhase, ...)
    props.active = true;

    // const [draw, preDraw, postDraw, removeDraw] = props.draw;

    if (props.draw[1]) props.draw[1](); // PreDraw

    engine.setDraw({id: `${props.id}-draw`, fn: props.draw[0]});

    if (!props.phases.length) return console.log('Draw set, no phases set');

    startNextPhase();
};

const startNextPhase = () => {
    // const [_, update, prepare] = phases[props.currentPhase];

    // if (prepare) prepare();

    // if (update) engine.setUpdate({id: `phase-${props.currentPhase}`, fn: update});

    // if (props.phases[0][2]) props.phases[0][2]; // PrePhase

    console.log('next phase set');
};

const createPhaserUpdate = (
    engine: Engine,
    props: PhaserProperties,
    stopPhaser: Function,
    repeatPhaser: Function,
    destroyPhaser: Function,
) => ({
    id: `${props.id}-main-update`,
    name: `Main Update ${props.id}`,
    fn: (evt: EngineUpdateEvent) => {
        props.timer += evt.timePassed;

        evt.phasePercentage = props.timer / props.phases[props.currentPhase][0];
        evt.phasePercentageReverse = 1 - evt.phasePercentage;

        // [duration, update fn?, PrePhase fn?, 3-PostPhase fn?]
        if (props.phases[props.currentPhase][0] < props.timer) {
            const currentPhase = props.phases[props.currentPhase];

            engine.removeUpdate(`phase-${props.currentPhase}`);

            if (currentPhase[3]) currentPhase[3](); // PostPhase

            props.currentPhase++;
            props.timer = 0;
            evt.phasePercentage = 0;
            evt.phasePercentageReverse = 1;

            if (!props.phases[props.currentPhase]) {
                if (props.draw[3]) engine.removeDraw(`${props.id}-draw`);

                phaserEnd[props.atEnd]();

                return;
            }

            startNextPhase();
        }
    },
});

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
