// import button from 'library/button/button';
import {initialize, resources} from 'library/index';
// import {ButtonOptions} from 'library/types/button';

export default {
    setup: async () => {
        initialize('survival', {containerID: 'container', full: true, clear: true, bg: '#000'});

        main();
    },
    run: () => resources.survival.engine.run(),
    runOnce: () => resources.survival.engine.runOnce(),
};

const main = () => {
    const {context, engine} = resources['survival'];

    const update = () => {
        //
    };
    const show = () => {
        for (const a in asteroids) {
            //
        }
    };

    const asteroids: ReturnType<typeof createSpaceObject>[] = [];

    asteroids.push(createSpaceObject(20, 20, 8, -6, 16));

    // engine.setUpdate({fn: update});
    engine.setShow({fn: show});
};

const createSpaceObject = (x = 0, y = 0, dx = 0, dy = 0, size = 0) => ({x, y, dx, dy, size});
