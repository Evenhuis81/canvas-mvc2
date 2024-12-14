import {initialize, resources} from 'library/index';
import {createPhaser} from './phaser';
import {createTriyPhases} from './demo/triy';
import statistics from 'library/statistics';

const libraryID = 'phaser';

export default {
    setup: () => {
        initialize(libraryID, {
            containerID: 'phaser-container',
            full: true,
            clear: true, // Display draw in statistics
            backgroundColor: '#000',
        });

        // Demo module for Phaser
        const circy = getCircy(libraryID);

        circy.run();
    },
    run: () => resources[libraryID].engine.run(),
    runOnce: () => resources[libraryID].engine.runOnce(),
};

const getCircy = (libraryID: string | number) => {
    const {context: ctx, canvas, engine} = resources[libraryID];

    const phaser = createPhaser(libraryID);

    // const drawCircy = createDrawCircy(ctx);
    // const phases = createCircyPhases(canvas, drawCircy);

    const {phaseDraw, updatePhases} = createTriyPhases(canvas, ctx);

    phaser.setDraw(phaseDraw);
    phaser.setUpdates(updatePhases);

    const run = () => {
        statistics.run(libraryID);

        phaser.start();
    };

    // Move this to phaser
    statistics.create(libraryID);
    statistics.setFn(libraryID, () => `Engine draws: ${engine.info.draws.length()}`);
    statistics.setFn(libraryID, () => `Engine updates: ${engine.info.updates.length()}`);
    statistics.setFn(libraryID, () => `Engine draw IDs: ${engine.info.draws.ids()}`);
    statistics.setFn(libraryID, () => `Engine update IDs: ${engine.info.updates.ids()}`);

    return {run};
};
