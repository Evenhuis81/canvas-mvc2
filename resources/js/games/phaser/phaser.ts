import {resources} from 'library/index';
// import {Phase, Phaser, PhaserPhases, SetPhase} from './types';

// const createProps = () => ({
//     time: 0,
//     number: 0,
// end: 4, // make optional, default 0 (or 1)
// shifts: [0],
// TOOD::Pre- and postpare for phase method, tuple 3rd and 4th entry
// });

type PhaserProperties = {
    currentPhase: number;
    timer: number;
    // phaseID: number;
    // number: number;
    // end: number;
    // shifts: number[];
    // phases: Record<number, [string, () => void]>;
    // start: () => void;
    // setPhase: SetPhase;
};

type PhaseBase = {
    name?: string;
    timeStart: number;
};

type PhaseUpdate = {
    type: 'update';
    fn: Update['fn'];
} & PhaseBase;

type PhaseDraw = {
    type: 'draw';
    fn: Draw['fn'];
} & PhaseBase;

type PhaseConfig = PhaseUpdate | PhaseDraw;

type Phase = [PhaseConfig['type'], PhaseConfig['timeStart'], PhaseConfig['fn']];

type Phases = Record<number, Phase>;

type SetPhase = (phase: PhaseConfig) => number;

export const createPhaser = (resourceID: string | number) => {
    const props = {
        currentPhase: 0,
        timer: 0,
    };
    const {engine} = resources[resourceID];

    const phases: Phases = {};

    let id = 0;
    const setPhase: SetPhase = phase => {
        phases[id++] = [phase.type, phase.timeStart, phase.fn];

        return id;
    };

    const update = createUpdate(engine, props, phases);

    const start = () => {
        if (!Object.keys(phases).length) {
            console.log('no phases set, aborting...');

            return;
        }
    };

    return {start, setPhase};
};

const createUpdate = (engine: Engine, props: PhaserProperties, phases: Phases) => ({
    id: 'phases-update',
    name: 'Update phases',
    fn: (evt: UpdateEvent) => {
        // props.timer += evt.timePassed;
        // if (props.shifts[props.number] < props.time) {
        //     engine.removeUpdate(phases[props.number][0]);
        //     props.number++;
        // if (phaser.number === phaser.end) {
        // if (!phases[props.number + 1]) {
        // engine.removeUpdate('phases-update');
        // engine.removeDraw('demo-circy');
        // engine.removeDraw('stats-circy-phases');
        // console.log('phaser ended');
        // return;
        // }
        // engine.setUpdate({
        //     id: phases[props.number][0],
        //     fn: phases[props.number][1],
        // });
        // }
    },
});

// engine.setUpdate(update);

// const noop = () => {};
// const updateOrDraw = {
//     id: props.number,
//     name: phases[props.number][0],
//     fn: phases[props.number][2] ?? phases[props.number][3] ?? noop,
// };
// if (phases[props.number][2]) engine.setUpdate(updateOrDraw);
// else if (phases[props.number][3]) engine.setDraw(updateOrDraw);
// engine.setUpdate({
//     id: props.number,
//     name: phases[props.number][0],
//     fn: phases[props.number][2],
// });

export const createDrawStats = (
    ctx: CanvasRenderingContext2D,
    engine: Engine,
    props: PhaserProperties,
    halfWidth: number,
    height: number,
    // ) => {
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
