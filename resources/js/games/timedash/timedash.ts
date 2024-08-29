import {initialize, resources} from 'library/index';

export default {
    setup: async () => {
        initialize('timedash', {
            containerID: 'timedash-container',
            full: true,
            clear: true,
            bg: '#000',
            statistics: {
                overlay: true,
                toggleKey: 'KeyH',
            },
        });

        const {paint} = resources.timedash.sv;

        // paint('textFillStroke', testTextFillStroke);
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};

const testTextFillStroke = {
    txt: 'test text',
    x: innerWidth / 2,
    y: innerHeight / 2,
    fill: 'red',
    stroke: 'blue',
    lw: 12,
    font: 'monospace',
    fontSize: 96,
};
