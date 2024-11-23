import type {CircyTimer, Phaser} from './circy';

export const createUpdate = (engine: Engine, phaser: Phaser, timer: CircyTimer) => ({
    id: 'phases-update',
    name: 'update Phases',
    fn: (evt: UpdateEvent) => {
        timer.time = evt.lastTime;

        if (phaser.shifts[phaser.number] < evt.lastTime) {
            engine.removeUpdate(phases[phaser.number][0]);

            phaser.number++;

            if (phaser.number === phaser.end) {
                engine.removeUpdate('phases-update');

                engine.removeDraw('demo-circy');
                engine.removeDraw('stats-circy-phases');

                console.log('end phases, removed general update');
                console.log(engine.info.draws.ids(), engine.info.updates.ids());

                return;
            }

            // Name property for update needed?
            engine.setUpdate({
                id: phases[phaser.number][0],
                fn: phases[phaser.number][1],
            });
        }
    },
});
