import {initialize, resources} from 'library/index';
import createEntity from '../entity/';

export default {
    setup: () => {
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
                // type: 'text',
                type: 'circle',
                // type: 'rect',
                // x: 100,
                // y: 50,
                // fill: '#fa0',
                // stroke: '#00f',
                // x1: 12,
                // y2: 12,
                // w: 100,
                // h: 50,
                radius: 12,
                // radii: 5,
                textFill: '#ff0',
                textAlign: 'center',
                // fontSize: 24,
            },
        });
    },
    run: () => resources.test.engine.run(),
    runOnce: () => resources.test.engine.runOnce(),
};
