import {resources} from 'library/index';
import type {DrawPhase, Phase, PhaserProperties, UpdatePhases} from './types';
import type {Engine, EngineUpdateEvent} from 'library/types/engine';

export const createPhaser = (libraryID: string | number, id?: string) => {
    // TODO::Make completely stand-alone (for multi-phaser creation), make ID obsolete?
    const props: PhaserProperties = {
        currentPhase: 0,
        phaserID: id || 'default',
        defaultSet: false,
        timer: 0,
        active: [], // phaserID's
        draw: {fn: () => {}},
        removeDraw: true,
        postDraw: undefined,
        statistics: false,
    };

    const {engine} = resources[libraryID];

    const draws: Record<string, DrawPhase> = {};
    const phases: Record<string, UpdatePhases> = {};

    const setDraw = (phaseDraw: DrawPhase, phaserID?: string) => (draws[phaserID ?? 'default'] = phaseDraw);

    const setPhases = (phaseUpdates: UpdatePhases, phaserID?: string) => (phases[phaserID ?? 'default'] = phaseUpdates);

    const setPhase = (phase: Phase, phaserID?: string) => {
        const id = phaserID ?? 'default';

        // Existing array check?
        if (phases[id]) return phases[id].push(phase);

        phases[id] = [phase];

        return;
    };

    const stopPhaser = createStopPhaser(props, engine, props.phaserID);

    const startPhaser = createStartPhaser(props, stopPhaser, draws, phases, engine, props.phaserID);

    return {
        start: startPhaser,
        stop: stopPhaser,
        setDraw,
        setPhases,
        setPhase,
        props,
    };
};

const createStartPhaser =
    (
        props: PhaserProperties,
        stopPhaser: () => void,
        draws: Record<string, DrawPhase>,
        phases: Record<string, UpdatePhases>,
        engine: Engine,
        id?: string,
    ) =>
    () => {
        const phaserID = id ?? 'default';

        const active = props.active.find(act => act === phaserID);
        if (active) return console.log(`Phaser with ID: ${phaserID} already active`);

        const [draw, preDraw, postDraw, removeDraw] = draws[phaserID];

        props.currentPhase = 0;
        props.timer = 0;
        props.active.push(phaserID);
        props.draw = draw;
        props.postDraw = postDraw;
        props.removeDraw = removeDraw;

        if (preDraw) preDraw();

        engine.setDraw(draw);

        if (!phases[phaserID] || !phases[phaserID].length) return console.log('No phases set, but draw is set');

        const [_, phaseUpdate, prePhase, __] = phases[phaserID][0];
        if (prePhase) prePhase();

        const phaserUpdate = createUpdate(engine, props, phases[phaserID], stopPhaser);

        engine.setUpdate(phaserUpdate);

        if (phaseUpdate) engine.setUpdate({id: `phase-${props.currentPhase}`, fn: phaseUpdate});
    };

const createStopPhaser = (props: PhaserProperties, engine: Engine, id?: string) => () => {
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

const createUpdate = (engine: Engine, props: PhaserProperties, phases: Phase[], stopPhaser: Function) => ({
    id: `phases-update-${props.phaserID}`,
    name: `Update phases-${props.phaserID}`,
    fn: (evt: EngineUpdateEvent) => {
        props.timer += evt.timePassed;

        evt.phasePercentage = props.timer / phases[props.currentPhase][0];
        evt.phasePercentageReverse = 1 - evt.phasePercentage;

        // [duration, update fn, preUpdate fn?, 3-postUpdate fn?]
        if (phases[props.currentPhase][0] < props.timer) {
            const currentPhase = phases[props.currentPhase];

            engine.removeUpdate(`phase-${props.currentPhase}`);

            if (currentPhase[3]) currentPhase[3](); // postUpdate

            props.currentPhase++;
            props.timer = 0;
            evt.phasePercentage = 0;
            evt.phasePercentageReverse = 1;

            if (!phases[props.currentPhase] || !phases[props.currentPhase].length) {
                if (props.removeDraw && props.draw.id) engine.removeDraw(props.draw.id);

                stopPhaser(); // removes this update from engine and runs postDraw if set

                return;
            }

            const [_, update, prepare] = phases[props.currentPhase];

            if (prepare) prepare();

            if (update) engine.setUpdate({id: `phase-${props.currentPhase}`, fn: update});

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
