import {initialize, resources} from 'library/index';
// import {getPlayer} from './player';
// import {getPlayer} from './player';
// import button from 'library/button/button';
import getEntity from 'library/entity';
import {convertHexStringToRGBA} from 'library/colors';

export default {
    setup: async () => {
        const {
            // sv: {paint},
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

        const entity = getEntity('timedash');

        const example1 = entity.create();

        setTimeout(() => {
            example1.destroy();
        }, 5000);

        convertHexStringToRGBA('#f00');

        // setTimeout(() => {
        //     example1.disable();
        // }, 4000);

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
