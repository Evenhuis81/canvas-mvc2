import Button from 'library/button/button';
import {resources} from 'library/index';
import {ButtonEvent, ButtonOptions} from 'library/types/button';

export const loadButtonEditor = () => {
    const {context, engine, input} = resources.tr;

    Button.create(context, engine, input, createNewButtonOptions);
    // Button.create(context, engine, input, backButton);
};

const mouseupCreateNewButton = ({evt, button}: ButtonEvent) => {
    console.log(evt, button);
    // Button.destruct('buttonEditor');
    // Button.destructAll();

    // loadButtonEditor();
};

const createMouseUpForBackButton = () => () => {
    // Button.destruct('back');
};

const createNewButtonOptions: ButtonOptions = {
    type: 'fillStrokeRound',
    x: innerWidth * 0.5,
    y: innerHeight * 0.9,
    w: innerWidth * 0.4,
    h: innerHeight * 0.08,
    r: 20,
    lw: 5,
    stroke: '#00f',
    id: 'create',
    text: 'Create New',
    font: '36px sans-serif',
    mouseup: mouseupCreateNewButton,
};

const backButton: ButtonOptions = {
    type: 'fillStrokeRound',
    x: innerWidth * 0.1,
    y: innerHeight * 0.1,
    w: 25,
    h: 25,
    r: 25,
    id: 'back',
    text: 'Go Back <-',
    font: '36px monospace',
    mouseup: createMouseUpForBackButton(),
};
