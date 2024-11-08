import {initialize, resources} from 'library/index';
// import {mainMenu} from './menu';

export default {
    setup: async () => {
        initialize('tr', {
            containerID: 'container',
            full: true,
            clear: true,
            backgroundColor: '#000',
            statistics: {
                type: 'popup',
                button: true,
                // code: 'KeyJ',
                // ctrl: true,
                // top: 50,
                // left: 75,
                // width: 400,
                // height: 300,
            },
        });

        // mainMenu();
    },
    run: () => resources.tr.engine.run(),
    runOnce: () => resources.tr.engine.runOnce(),
};
