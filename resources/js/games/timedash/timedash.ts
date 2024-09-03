import {initialize, resources} from 'library/index';
import {getPlayer} from './player';

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
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
