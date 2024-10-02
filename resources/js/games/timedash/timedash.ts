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
            // show: false,
            // disable: false,
            // = touch- and mousedown (not yet) / needs transition handlers
            // mouse: {
            //     button: 2,
            // down: () => {
            //     console.log('mouse down USER INPUT');
            // },
            // up: () => {
            //     example1.hide();
            // },
            // },
            // startType: 'slideInLeft',
            // startSpeed: 3,
            // endType: 'fadeout1',
            // endSpeed: 1,
            // hoverType: 'bold',
            // animationType: 'noise',
            // animateAtStart: true,
            // animateAtEnd: true,
            // onStartEnd: () => {
            //     console.log('start transition ended USER INPUT');
            //     setTimeout(() => {
            //         console.log('timeout trigger (hide()');

            //         example1.hide();
            //     }, 1500);
            // },
            // onEndEnd: () => {
            //     console.log('end transition ended USER INPUT');
            // },
        });
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
