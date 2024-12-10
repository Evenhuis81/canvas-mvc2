import {resources} from 'library/index';

type PhaserProperties = {
    currentPhase: number;
    timer: number;
    setIDs: number[];
    active: boolean;
    // end: number; // auto-calucuate
    // shifts: number[]; // seperation from properties / obsolete
    // phases: Record<number, [string, () => void]>; // see shifts
    // start: () => void; see shofts
    // setPhase: SetPhase; // seperate method return (Object assign)
};

// [_ , internalID]
type PhaseInternal = [...PhaseConfig, string];

type PhasePrepare = () => void;
type PhasePostpare = () => void;

// [type, duration, timeStart, draw/update fn, prepare fn?, postpare fn?]
type PhaseConfig = ['draw' | 'update', number, number, Draw['fn'] | Update['fn'], PhasePrepare?, PhasePostpare?];

type Phases = Record<number, PhaseInternal>;

type SetPhase = (phase: PhaseConfig) => void;
type SetPhases = (phases: PhaseConfig[]) => void;

export const createPhaser = (resourceID: string | number) => {
    const props: PhaserProperties = {
        setIDs: [],
        currentPhase: 0,
        timer: 0,
        active: false,
    };
    const {engine} = resources[resourceID];

    const phases: Phases = {};

    let id = 0;
    const setPhases: SetPhases = phasesInc => {
        phasesInc.forEach((phase, index) => {
            const phaseID = `phase-${index}`;

            phases[id++] = [...phase, phaseID];

            props.setIDs.push(id);
        });

        console.log(phases);
    };

    const setPhase: SetPhase = phase => {
        //
    };

    const resetPhases = () => {
        for (let i = 0; i < props.setIDs.length; i++) delete phases[i];
    };

    const phaserBaseUpdate = createUpdate(engine, props, phases);

    const start = () => {
        props.timer = 0;

        if (!Object.keys(phases).length) {
            console.log('no phases set, aborting...');

            return;
        } else if (props.active) {
            console.log('phaser already active');

            return;
        }

        props.active = true;

        engine.setUpdate(phaserBaseUpdate);
    };

    const stop = () => {
        if (!props.active) {
            console.log('phaser is not active!');

            return;
        }

        engine.removeUpdate('phases-update');

        props.active = false;
    };

    return {start, stop, setPhases, resetPhases};
};

const createUpdate = (engine: Engine, props: PhaserProperties, phases: Phases) => ({
    id: 'phases-update',
    name: 'Update phases',
    fn: (evt: UpdateEvent) => {
        props.timer += evt.timePassed;

        if (phases[props.currentPhase][2] < props.timer) {
            engine.removeUpdate(phases[props.currentPhase][4]);

            props.currentPhase++;
            // if (phaser.number === phaser.end) {
            if (!phases[props.currentPhase + 1]) stop(); // removes this update from engine

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
