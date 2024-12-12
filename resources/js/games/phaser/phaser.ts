import {resources} from 'library/index';

type PhaserProperties = {
    currentPhase: number;
    timer: number;
    active: string[];
    draw: Draw;
    removeDraw: boolean;
    postDraw: Function | undefined;
};

type PreDraw = Function;
type PostDraw = Function;
type RemoveDraw = boolean;
type PrePhase = Function;
type PostPhase = Function;

// [duration, update fn, prepare fn?, postpare fn?]
type Phase = [number, Update['fn'], PrePhase?, PostPhase?];

export type UpdatePhases = {[K in keyof Phase]: Phase[K]}[];

export type DrawPhase = [Draw, PreDraw?, PostDraw?, RemoveDraw?];

// export type PhaseConfig = [Draw, PhasePrepare?, PhasePostpare?, RemoveDraw?, ...UpdatePhases];

// type SetPhaserOld = (phaseConfig: PhaseConfig) => void;
// type SetPhaser = (incPhases: Phases) => void;

export const createPhaser = (resourceID: string | number) => {
    const props: PhaserProperties = {
        currentPhase: 0,
        timer: 0,
        active: [],
        draw: {fn: () => {}},
        removeDraw: true,
        postDraw: undefined,
    };

    const {engine} = resources[resourceID];

    const draws: Record<string, DrawPhase> = {};
    const updates: Record<string, UpdatePhases> = {};

    // Implement identification for multiple draws and phases
    const setDraw = (phaseDraw: DrawPhase) => {
        draws['test'] = phaseDraw;
    };
    const setUpdates = (phaseUpdates: UpdatePhases) => {
        updates['test'] = phaseUpdates;
    };

    const startPhaser = (id?: string) => {
        const phaseID = id ?? 'test';

        // Test return console statement
        const active = props.active.find(act => act === phaseID);
        if (active) return console.log(`Phaser with ID: ${phaseID} already active`);

        const [draw, preDraw, postDraw, removeDraw] = draws[phaseID];

        props.currentPhase = 0;
        props.timer = 0;
        props.active.push(phaseID);
        props.draw = draw;
        props.postDraw = postDraw;

        if (preDraw) preDraw();
        engine.setDraw(draw);

        if (!updates[phaseID]) return console.log('No phases set');

        const phaserUpdate = createUpdate(engine, props, updates[phaseID], stopPhaser);

        engine.setUpdate(phaserUpdate);

        const [duration, phaseUpdate, phasePrepare] = updates[phaseID][0];

        // Set 1st phase (could use a check on its availability)
        if (phasePrepare) phasePrepare();

        engine.setUpdate({id: `phase-${props.currentPhase}`, fn: phaseUpdate});
    };

    const stopPhaser = (id?: string) => {
        // TODO::Cleanup last phaserun?
        if (!props.active) {
            console.log('phaser is not active!');

            return;
        }

        engine.removeUpdate('phases-update');

        if (props.postDraw) props.postDraw();

        props.timer = 0;
        // reset more props

        props.active.findIndex(id);
    };

    return {start: startPhaser, stop: stopPhaser, setDraw, setUpdates};
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

            if (!phases[props.currentPhase]) {
                stopPhaser(); // removes this update from engine

                if (props.removeDraw && props.baseDraw.id) engine.removeDraw(props.baseDraw.id);

                return;
            }

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
