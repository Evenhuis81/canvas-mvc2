import Button from 'library/button/button';
import {Resources} from '.';
import {ButtonEvent, ButtonOptions} from 'library/types/button';
import {loadButtonEditor} from './buttonEditor/buttonEditor';

const createMouseUpForButtonEditorButton = (evt: ButtonEvent) => {
    // console.log(evt);
    Button.destructAll();

    loadButtonEditor();
};

export const goToMenu = () => {
    const {context, engine, input} = Resources.state;

    // Get resources from a 'resourceID'
    Button.create(context, engine, input, buttonEditorButton);
};

const buttonEditorButton: ButtonOptions = {
    type: 'fillStrokeRound',
    x: innerWidth * 0.5,
    y: innerHeight * 0.2,
    w: innerWidth * 0.6,
    h: innerHeight * 0.1,
    r: 20,
    lw: 5,
    stroke: '#00f',
    hoverFill: '#222',
    id: 'buttonEditor',
    text: 'Button Editor',
    font: '36px sans-serif',
    mouseup: createMouseUpForButtonEditorButton,
};
