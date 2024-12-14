import {resources} from 'library/index';
import statistics from 'library/statistics';
import type {DrawPhase, Phase, PhaserProperties, UpdatePhases} from './types';
import type {Engine, EngineUpdateEvent} from 'library/types/engine';

export const createPhaser = (libraryID: string | number, id?: string) => {
    const props: PhaserProperties = {
        currentPhase: 0,
        currentPhaseID: id || 'default',
        timer: 0,
        active: [],
        draw: {fn: () => {}},
        removeDraw: true,
        postDraw: undefined,
    };

    const {engine} = resources[libraryID];

    const draws: Record<string, DrawPhase> = {};
    const phases: Record<string, UpdatePhases> = {};

    // Implement identification for multiple draws and phases
    const setDraw = (phaseDraw: DrawPhase, phaseID?: string) => {
        const id = phaseID ?? 'default';

        draws[id] = phaseDraw;
    };

    const setUpdates = (phaseUpdates: UpdatePhases, phaseID?: string) => {
        const id = phaseID ?? 'default';

        phases[id] = phaseUpdates;
    };

    const setPhase = (phase: Phase, phaseID?: string) => {
        const id = phaseID ?? 'default';
    };

    const startPhaser = (id?: string) => {
        const phaseID = id ?? 'default';

        // Test return console statement
        const active = props.active.find(act => act === phaseID);
        if (active) return console.log(`Phaser with ID: ${phaseID} already active`);

        const [draw, preDraw, postDraw, removeDraw] = draws[phaseID];

        props.currentPhase = 0;
        props.timer = 0;
        props.active.push(phaseID);
        props.draw = draw;
        props.postDraw = postDraw;
        props.removeDraw = removeDraw;

        if (preDraw) preDraw();
        engine.setDraw(draw);

        if (!updates[phaseID] || !updates[phaseID].length) return console.log('No phases set, but draw is set');

        const phaserUpdate = createUpdate(engine, props, updates[phaseID], stopPhaser);

        engine.setUpdate(phaserUpdate);

        const [duration, phaseUpdate, prePhase, postPhase] = updates[phaseID][0];

        if (prePhase) prePhase();

        engine.setUpdate({id: `phase-${props.currentPhase}`, fn: phaseUpdate});

        statistics.run(libraryID);
    };

    const stopPhaser = (id?: string) => {
        const phaseID = id ?? 'default';

        // TODO::Cleanup last phaserun?
        const active = props.active.find(act => act === phaseID);
        if (!active) return console.log('phaser is not active!');

        engine.removeUpdate(`phases-update-${phaseID}`);

        if (props.postDraw) props.postDraw();

        props.timer = 0;
        props.currentPhase = 0;
        props.timer = 0;

        const index = props.active.findIndex(pID => pID === phaseID);

        if (index === -1) return console.log('current active phaseID not found.');

        props.active.splice(index, 1);
    };

    // Move this to phaser
    statistics.create(libraryID);
    statistics.setFn(libraryID, () => `Engine draws: ${engine.info.draws.length()}`);
    statistics.setFn(libraryID, () => `Engine updates: ${engine.info.updates.length()}`);
    statistics.setFn(libraryID, () => `Engine draw IDs: ${engine.info.draws.ids()}`);
    statistics.setFn(libraryID, () => `Engine update IDs: ${engine.info.updates.ids()}`);

    return {start: startPhaser, stop: stopPhaser, setDraw, setUpdates};
};

const createUpdate = (engine: Engine, props: PhaserProperties, phases: Phase[], stopPhaser: Function) => ({
    id: `phases-update-${props.currentPhaseID}`,
    name: `Update phases-${props.currentPhaseID}`,
    fn: (evt: EngineUpdateEvent) => {
        props.timer += evt.timePassed;

        // [duration, update fn, preUpdate fn?, 3-postUpdate fn?]
        if (phases[props.currentPhase][0] < props.timer) {
            const currentPhase = phases[props.currentPhase];

            engine.removeUpdate(`phase-${props.currentPhase}`);

            if (currentPhase[3]) currentPhase[3](); // postUpdate

            props.currentPhase++;
            props.timer = 0;

            if (!phases[props.currentPhase] || !phases[props.currentPhase].length) {
                if (props.removeDraw && props.draw.id) engine.removeDraw(props.draw.id);

                stopPhaser(); // removes this update from engine and runs postDraw if set

                return;
            }

            const [_, update, prepare] = phases[props.currentPhase];

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
