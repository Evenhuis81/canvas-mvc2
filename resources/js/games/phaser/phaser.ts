import {resources} from 'library/index';

type PhaserProperties = {
    currentPhase: number;
    timer: number;
    active: boolean;
    // setIDs: number[];
    // end: number; // auto-calucuate
    // shifts: number[]; // seperation from properties / obsolete
    // phases: Record<number, [string, () => void]>; // see shifts
    // start: () => void; see shofts
    // setPhase: SetPhase; // seperate method return (Object assign)
};

type PhasePrepare = () => void;
type PhasePostpare = () => void;

// [duration, update fn, prepare fn?, postpare fn?]
type Phase = [number, Update['fn'], PhasePrepare?, PhasePostpare?];

export type PhaseConfig = [Draw, PhasePrepare?, PhasePostpare?, ...{[K in keyof Phase]: Phase[K]}[]];

type DrawID = string;

type PhaseInternal = [DrawID, PhaseConfig]; // [internalID, ]

type Phases = Record<string, PhaseInternal[]>;

// type SetPhase = (phase: PhaseConfig) => void;
// type SetPhases = (phases: PhaseConfig[]) => void;
type SetPhaser = (phaseConfig: PhaseConfig) => void;

export const createPhaser = (resourceID: string | number) => {
    const props = {
        currentPhase: 0,
        timer: 0,
        active: false,
    };
    const {engine} = resources[resourceID];

    // const phases: Phases = {test1: };

    // props.setIDs.push(id);
    // const setPhases: SetPhases = phasesInc => {
    //     phasesInc.forEach((phase, index) => {
    //         const phaseID = `phase-${index}`;

    //         phases['test1'].push([phaseID, ...phase]);
    //     });

    //     console.log(phases);
    // };

    const phases: PhaseConfig[] = [];

    // let id = 0;
    const set: SetPhaser = phaseConfig => {
        // const phaseID = `phase-${id++}`;

        phases.push(phaseConfig);
    };

    const startPhaser = () => {
        // Test return console statement
        if (phases.length) return console.log('no phases set, aborting...');
        else if (props.active) return console.log('phaser already active');

        props.currentPhase = 0;
        props.timer = 0;
        props.active = true;

        const phaserConfig = phases[0];
        if (phaserConfig[1]) phaserConfig[1](); // prepareDraw

        engine.setDraw(phaserConfig[0]);

        // Set 1st phase (could use a check if available)
        const phase1 = phaserConfig[3];

        engine.setUpdate(phaserBaseUpdate);
    };

    const stopPhaser = () => {
        // TODO::Cleanup last phaserun?
        if (!props.active) {
            console.log('phaser is not active!');

            return;
        }

        engine.removeUpdate(phaserBaseUpdate.id);

        // Reset props?
        props.active = false;
    };

    const phaserBaseUpdate = createUpdate(engine, props, phases[0], stopPhaser);

    return {start: startPhaser, stop: stopPhaser, set};
};

const createUpdate = (engine: Engine, props: PhaserProperties, phases: PhaseConfig, stopPhaser: () => void) => ({
    id: 'phases-update',
    name: 'Update phases',
    fn: (evt: UpdateEvent) => {
        // TODO::Create prepare phase (warmup)
        props.timer += evt.timePassed;

        // [0-internalID, 1-type, 2-duration, 3-timeStart, 4-draw/update fn, 5-prepare fn?, 6-postpare fn?]
        if (phases.test1[props.currentPhase][2] < props.timer) {
            const phase = phases.test1[props.currentPhase];
            if (phase[6]) phase[6](); // postpare
            if (phase[1] === 'draw') engine.removeDraw(phase[0]);
            else if (phase[1] === 'update') engine.removeUpdate(phase[0]);
            // Make this recursive for other phases with same duration/timeStart

            props.currentPhase++;
            if (!phases.test[props.currentPhase]) stopPhaser(); // removes this update from engine

            // engine.removeDraw('demo-circy');
            // engine.removeDraw('stats-circy-phases');
            // console.log('phaser ended');
            // return;
            // }
            // engine.setUpdate({
            //     id: phases[props.number][0],
            //     fn: phases[props.number][1],
            // });
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
