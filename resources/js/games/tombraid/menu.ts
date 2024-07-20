import Button from 'library/button/button';
import {Resources} from '.';
import {ButtonEvent, ButtonOptions} from 'library/types/button';
import {loadButtonEditor} from './buttonEditor/buttonEditor';
import {loadTextEditor} from './textEditor/textEditor';

const mouseupButtonEditor = (evt: ButtonEvent) => {
    Button.destructAll();

    loadButtonEditor();
};

const mouseupTextEditor = (evt: ButtonEvent) => {
    Button.destructAll();

    loadTextEditor();
};

export const goToMenu = () => {
    const {context, engine, input} = Resources.state;

    // Get resources from a 'resourceID'
    // Change state of resource from store creator to match certain ID's, make  generic typescript module

    Button.create(context, engine, input, buttonEditor);
    Button.create(context, engine, input, textEditor);
};

const buttonEditor: ButtonOptions = {
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
    mouseup: mouseupButtonEditor,
};

const textEditor: ButtonOptions = {
    type: 'fillStrokeRound',
    x: innerWidth * 0.5,
    y: innerHeight * 0.4,
    w: innerWidth * 0.6,
    h: innerHeight * 0.1,
    r: 20,
    lw: 5,
    stroke: '#00f',
    hoverFill: '#222',
    id: 'textEditor',
    text: 'Text Editor',
    font: '36px monospace',
    mouseup: mouseupTextEditor,
};
