import {resources} from 'library/index';
import {getCircy} from './circy';

export const initiatePhase = (phase: number) => {
    phases[phase]();

    const circy = getCircy();

    resources.hello.engine.setDraw(circy.draw);
    resources.hello.engine.setDraw(circy.drawStats);
    resources.hello.engine.setUpdate(circy.update);
};

const phases: Record<number, Function> = {
    1: () => {
        console.log('phase 1 initiatied');
    },
};
