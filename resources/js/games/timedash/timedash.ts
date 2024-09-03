import {initialize, resources} from 'library/index';
import {testRectangle} from './levels/test-objects';
import button from 'library/button/button';

export default {
    setup: async () => {
        const {engine} = initialize('timedash', {
            containerID: 'timedash-container',
            full: true,
            clear: true,
            contextMenu: true,
            backgroundColor: '#000',
            statistics: {
                toggleKey: 'KeyH',
            },
        });

        const player = createPlayer();

        let lwStep = 0.1;

        engine.setUpdate({
            fn: () => {
                player.lw += lwStep;

                if (player.lw > 7 || player.lw < 0) lwStep *= -1;

                // console.log(player.lw);
            },
        });

        const {paint} = resources.timedash.sv;

        paint('circle', player);
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};

const createPlayer = () => ({
    x: 200,
    y: 150,
    r: 25,
    stroke: '#fff',
    lw: 0,
});
