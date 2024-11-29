import {resources} from 'library/index';
import {Phase, Phaser, PhaserPhases, SetPhase} from './types';

// const createProps = () => ({
//     time: 0,
//     number: 0,
// end: 4, // make optional, default 0 (or 1)
// shifts: [0],
// TOOD::Pre- and postpare for phase method, tuple 3rd and 4th entry
// });

export const createPhaser = (resourceID: string | number) => {
    const {engine} = resources[resourceID];
    let id = 0;

    // const props = {
    //     time: 0,
    //     number: 0,
    // };

    const phases: Phase = {};

    const setPhase: SetPhase = phase => {
        const update = phase[2];
        const draw = phase[3];

        // [name, timeStart]
        phases[id++] = [phase[0], phase[1], update, draw];
    };

    const update = createUpdate(engine, props);

    const start = () => {
        const noop = () => {};

        engine.setUpdate(update);

        const updateOrDraw = {
            id: props.number,
            name: phases[props.number][0],
            fn: phases[props.number][2] ?? phases[props.number][3] ?? noop,
        };

        if (phases[props.number][2]) engine.setUpdate(updateOrDraw);
        else if (phases[props.number][3]) engine.setDraw(updateOrDraw);
        // engine.setUpdate({
        //     id: props.number,
        //     name: phases[props.number][0],
        //     fn: phases[props.number][2],
        // });
    };

    return Object.assign(props, {start});
};

const createUpdate = (engine: Engine, props: Phaser, phases: PhaserPhases) => ({
    id: 'phases-update',
    name: 'Update phases',
    fn: (evt: UpdateEvent) => {
        props.time += evt.timePassed;

        if (props.shifts[props.number] < props.time) {
            engine.removeUpdate(phases[props.number][0]);

            props.number++;

            // if (phaser.number === phaser.end) {
            if (!phases[props.number + 1]) {
                // engine.removeUpdate('phases-update');

                // engine.removeDraw('demo-circy');
                // engine.removeDraw('stats-circy-phases');

                console.log('phaser ended');

                return;
            }

            engine.setUpdate({
                id: phases[props.number][0],
                fn: phases[props.number][1],
            });
        }
    },
});
