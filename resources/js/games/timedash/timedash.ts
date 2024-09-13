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

        const example1 = entity.create({
            show: false,
            // = touch- and mousedown (not yet) / needs transition handlers
            mouse: {
                mousedown: () => {
                    console.log('mouse down');
                },
                mouseup: () => {
                    console.log('mouse up');
                },
            },
        });

        setTimeout(() => {
            example1.show();
        }, 2000);
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
