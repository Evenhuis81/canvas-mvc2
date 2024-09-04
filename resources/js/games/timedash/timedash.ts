import {initialize, resources} from 'library/index';
// import {getPlayer} from './player';
// import {getPlayer} from './player';
// import button from 'library/button/button';
import entity from 'library/generalEntity';

export default {
    setup: async () => {
        const {
            engine,
            sv: {paint},
        } = initialize('timedash', {
            containerID: 'timedash-container',
            full: true,
            clear: true,
            contextMenu: true,
            backgroundColor: '#000',
            statistics: {
                toggleKey: 'KeyH',
            },
        });

        const example1 = entity.create();
        // const example1 = entity.create(example1Options);
        // const player = getPlayer();

        // engine.setUpdate({fn: player.transitionStart});

        // paint('circle', player.properties);
        // const startButton = button.create('timedash');
        // const player = getPlayer();

        // setTimeout(() => {
        // engine.setUpdate({fn: player.transitionStart});
        // paint('circle', player.properties);
        // }, 250);
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};

const example1Options = {
    x: 300,
    y: 250,
};
