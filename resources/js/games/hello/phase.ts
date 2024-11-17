import {resources} from 'library/index';
import {getCircy} from './circy';

export const initiatePhase = (phase: number) => {
    phases[phase]();

    const circy = getCircy();

    circy.start();
};

const phases: Record<number, Function> = {
    1: () => {
        // console.log('phase 1 initiatied');
    },
};
