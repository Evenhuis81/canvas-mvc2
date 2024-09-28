import {initialize, resources} from 'library/index';
import getEntity from 'library/entity';

export default {
    setup: () => {
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

        // entity.create();

        entity.create({
            text: 'Test Example #1',
            w: 200,
            r: 0,
            // showDelay: 1500,
            // show: true,
            // disable: false,
            // animationType: 'noise',
            // = touch- and mousedown (not yet) / needs transition handlers
            // mouse: {
            //     button: 2,
            //     down: () => {
            //         console.log('mouse down USER INPUT');
            //     },
            //     up: () => {
            //         console.log('mouse up USER INPUT');
            //     },
            // },
            // startType: 'fadein1',
            // startSpeed: 1,
            // endType: 'fadeout1',
            // endSpeed: 3,
            // onStartEnd: () => {
            //     console.log('start transition ended USER INPUT');
            // },
            // onEndEnd: () => {
            //     console.log('end transition ended USER INPUT');
            // },
            // hoverType: 'bold',
        });
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
