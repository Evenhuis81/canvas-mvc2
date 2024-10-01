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

        const example1 = entity.create({
            text: '##$$$$ggfg*&&&1',
            w: 200,
            r: 0,
            // showDelay: 1500,
            // show: true,
            // disable: false,
            // animationType: 'noise',
            // animateAtStart: false,
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
            // startSpeed: 3,
            // endType: 'fadeout1',
            // endSpeed: 1,
            // onStartEnd: () => {
            //     console.log('start transition ended USER INPUT');
            //     setTimeout(() => {
            //         console.log('timeout trigger');

            //         example1.hide();
            //     }, 1000);
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
