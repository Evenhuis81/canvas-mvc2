import {initialize, resources} from 'library/index';
import getEntity from 'library/entity';

export default {
    setup: async () => {
        initialize('timedash', {
            containerID: 'timedash-container',
            full: true,
            clear: true,
            // contextMenu: true,
            backgroundColor: '#000',
            // statistics: {
            //     toggleKey: 'KeyH',
            // },
        });

        const entity = getEntity('timedash');

        entity.create({
            text: 'Test Example #1',
            show: true,
            // = touch- and mousedown (not yet) / needs transition handlers
            mouse: {
                down: () => {
                    console.log('mouse down USER INPUT');
                },
                up: () => {
                    console.log('mouse up USER INPUT');
                },
            },
            startType: 'fadein1',
            // endType: 'fadeout1',
            // onStartEnd: () => {
            //     console.log('start transition ended USER INPUT');
            // },
            // onEndEnd: () => {
            //     console.log('end transition ended USER INPUT');
            // },
            hoverType: 'bold',
        });
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
