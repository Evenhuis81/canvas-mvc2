import {initialize, resources} from 'library/index';
import {initiatePhase} from './phase';

export default {
    setup: () => {
        initialize('hello', {
            containerID: 'hello-container',
            full: true,
            clear: true,
            backgroundColor: '#000',
        });
    },
    runEngine: () => resources.hello.engine.run(),
    runEngineOnce: () => resources.hello.engine.runOnce(),
    startPhase: (phase: number) => initiatePhase(phase),
};
