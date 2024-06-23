import {getButton} from 'library/button/button';
import {resources} from '.';
import {Show} from 'library/types/engine';

const {context, engine} = resources.state;

type Button = Show[];

const buttons: Button[] = [];

export default {
    start: () => {
        const button = getButton(context, {click: buttonListener});

        engine.setShow(button.show);
        console.log(button.show.id);

        const rectB = getButton(context, rectButton);
    },
};

const buttonListener = (ev: MouseEvent) => {
    // Start Demo, more buttons each a seperate (tv?) method, like all the shapes and then motion 101, etc

    engine.removeShow(0);
    engine.setShow();
};

const rectButton = {
    x: 50,
    y: 50,
    w: 100,
    h: 50,
    lw: 4,
};

// x?: number;
// y?: number;
// w?: number;
// h?: number;
// lw?: number;
// r?: number;
// stroke?: string;
// fill?: string;
// text?: string;
// textColor?: string;
// font?: string;
// click?: (ev: MouseEvent) => void;
