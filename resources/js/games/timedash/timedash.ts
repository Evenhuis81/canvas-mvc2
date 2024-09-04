import {initialize, resources} from 'library/index';
import {getPlayer} from './player';
// import {getPlayer} from './player';
// import button from 'library/button/button';

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

        const player = getPlayer();

        engine.setUpdate({fn: player.transitionStart});

        paint('circle', player.properties);
        // const startButton = button.create('timedash');
        // const player = getPlayer();

        setTimeout(() => {
            // engine.setUpdate({fn: player.transitionStart});
            // paint('circle', player.properties);
        }, 250);
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
