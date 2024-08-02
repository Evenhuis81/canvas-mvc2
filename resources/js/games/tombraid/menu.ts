import Button from 'library/button/button';
import {ButtonOptions} from 'library/types/button';
import {loadButtonEditor} from './buttonEditor/buttonEditor';
import {loadTextEditor} from './textEditor/textEditor';

const clickButtonEditor = () => {
    Button.destructAll();

    loadButtonEditor();
};

const clickTextEditor = () => {
    Button.destructAll();

    loadTextEditor();
};

export const goToMenu = () => {
    Button.create('tr', buttonEditor);
    Button.create('tr', textEditor);
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
    // hoverFill: '#222',
    id: 'buttonEditor',
    text: 'Button Editor',
    font: '36px sans-serif',
    click: clickButtonEditor,
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
    // hoverFill: '#222',
    id: 'textEditor',
    text: 'Text Editor',
    font: '36px monospace',
    click: clickTextEditor,
};
