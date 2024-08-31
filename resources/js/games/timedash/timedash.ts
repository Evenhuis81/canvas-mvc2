import {initialize, resources} from 'library/index';

export default {
    setup: async () => {
        initialize('timedash', {
            containerID: 'timedash-container',
            full: true,
            clear: true,
            contextMenu: true,
            backgroundColor: '#000',
            statistics: {
                // overlay: true,
                // window: true,
                toggleKey: 'KeyH',
            },
        });
        // const {paint} = resources.timedash.sv;
        // paint('rectangle', testRectangle);

        addEventListener('keyup', ({code}) => {
            if (code === 'KeyZ') {
                const source = '/statistics';
                const source2 = '/';
                const target = 'dsank';
                // const options = 'popup, width=300, height=300';

                const handler = window.open(source, target);

                setTimeout(() => window.open(source2, target), 2000);

                // setTimeout(() => handler?.close(), 2000);
                // console.log('no error', handler);

                // if (!handler) {
                //     console.log('error', handler);
                // }
            }
        });
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
