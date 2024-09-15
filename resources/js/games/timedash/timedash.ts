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
                    console.log('mouse down');
                },
                up: () => {
                    console.log('mouse up');
                },
            },
            startType: 'fadein1',
            // endType: 'fadeout1',
            // onStartEnd: () => {
            //     console.log('start transition ended');
            // },
            onEndEnd: () => {
                console.log('end transition ended');
            },
        });
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
