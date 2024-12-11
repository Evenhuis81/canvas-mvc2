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

// type DrawID = string;

// type PhaseInternal = [DrawID, PhaseConfig]; // [internalID, ]

// type Phases = Record<string, PhaseInternal[]>;

type PhasePrepare = () => void;
type PhasePostpare = () => void;

// [duration, update fn, prepare fn?, postpare fn?]
type Phase = [number, Update['fn'], PhasePrepare?, PhasePostpare?];

export type PhaseConfig = [Draw, PhasePrepare?, PhasePostpare?, ...{[K in keyof Phase]: Phase[K]}[]];

type SetPhaser = (phaseConfig: PhaseConfig) => void;

export const createPhaser = (resourceID: string | number) => {
    const props = {
        currentPhase: 0,
        timer: 0,
        active: false,
    };
    const {engine} = resources[resourceID];

    // props.setIDs.push(id);
    // const setPhases: SetPhases = phasesInc => {
    //     phasesInc.forEach((phase, index) => {
    //         const phaseID = `phase-${index}`;

    //         phases['test1'].push([phaseID, ...phase]);
    //     });

    //     console.log(phases);
    // };

    const phaseConfigs: PhaseConfig[] = [];

    // let id = 0;
    const set: SetPhaser = phaseConfig => {
        // const phaseID = `phase-${id++}`;

        phaseConfigs.push(phaseConfig);
    };

    const startPhaser = () => {
        // Test return console statement
        if (!phaseConfigs.length) return console.log('no phases set, aborting...');
        else if (props.active) return console.log('phaser already active');

        props.currentPhase = 0;
        props.timer = 0;
        props.active = true;

        const [baseDraw, prepareDraw, postpareDraw, ...phases] = phaseConfigs[0];

        const phaserBaseUpdate = createUpdate(engine, props, phases, stopPhaser);

        if (prepareDraw) prepareDraw();

        engine.setDraw(baseDraw);
        engine.setUpdate(phaserBaseUpdate);

        const [phaseDuration, phaseUpdate, phasePrepare, phasePostpare] = phases[0];

        // Set 1st phase (could use a check on its availability)
        if (phasePrepare) phasePrepare();

        engine.setUpdate({id: `phase-${props.currentPhase}`, fn: phaseUpdate});
    };

    const stopPhaser = () => {
        // TODO::Cleanup last phaserun?
        if (!props.active) {
            console.log('phaser is not active!');

            return;
        }

        engine.removeUpdate('phases-update');

        // postPare here (phases[0][3])

        // Reset props?
        props.active = false;
    };

    return {start: startPhaser, stop: stopPhaser, set};
};

const createUpdate = (engine: Engine, props: PhaserProperties, phases: Phase[], stopPhaser: Function) => ({
    id: 'phases-update',
    name: 'Update phases',
    fn: (evt: UpdateEvent) => {
        props.timer += evt.timePassed;

        // [duration, update fn, prepare fn?, postpare fn?]
        if (phases[props.currentPhase][0] < props.timer) {
            const currentPhase = phases[props.currentPhase];

            engine.removeUpdate(`phase-${props.currentPhase}`);

            if (currentPhase[3]) currentPhase[3](); // postpare

            props.currentPhase++;
            props.timer = 0;

            if (!phases[props.currentPhase]) return stopPhaser(); // removes this update from engine

            // remove baseDraw?

            const [duration, update, prepare] = phases[props.currentPhase];

            if (prepare) prepare();

            engine.setUpdate({id: `phase-${props.currentPhase}`, fn: update});

            console.log('next phase set');
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
