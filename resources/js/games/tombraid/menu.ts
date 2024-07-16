import Button from 'library/button/button';
import {Resources} from '.';
import {ButtonOptions} from 'library/types/button';

const createMouseUpForButtonEditorButton = () => () => {
    Button.destruct('buttonEditor');

    //
};

export const goToMenu = () => {
    const {context, engine, input} = Resources.state;

    Button.create(context, engine, input, buttonEditorButton);
};

const buttonEditorButton: ButtonOptions = {
    type: 'fillStrokeRound',
    x: innerWidth * 0.5,
    y: innerHeight * 0.2,
    w: innerWidth * 0.8,
    h: innerHeight * 0.1,
    r: 25,
    id: 'buttonEditor',
    name: 'buttonEditor',
    text: 'Button Editor',
    mouseup: createMouseUpForButtonEditorButton(),
};
