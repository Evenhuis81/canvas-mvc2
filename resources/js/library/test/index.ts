import {initialize, resources} from 'library/index';
import createEntity from '../entity/';

export default {
    setup: async () => {
        initialize('test', {
            containerID: 'test-container',
            full: true,
            clear: true,
            backgroundColor: '#000',
        });

        const entity = createEntity('test');

        const statButton = entity.create({
            // text: 'Entity Sketch Test',
            // sketch: {
            //     type: 'rect',
            //     x: 12,
            // },
            sketch: {
                //     text: 'sadf',
                type: 'circle',
                x: 12,
                y: 12,
                // fill: '#fa0',
                // x1: 12,
                // y2: 12,
                // w: 100,
                // h: 50,
                r: 12,
            },
        });
    },
    run: () => resources.test.engine.run(),
    runOnce: () => resources.test.engine.runOnce(),
};
