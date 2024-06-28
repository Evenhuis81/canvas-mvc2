import {resources} from '.';
import button, {ButtonType} from '../button/button';

const {engine} = resources.state;

// TODO::
// 1. Create buttons on the fly with auto-generator that also fills up the screen height and doesn't overflow.
// 2. Calculate heights and widths according to text and innerHeight;
// 3. Make all single use functions without duplicting too much code (ie. different show functions)
// 4. Make this module dynamic and not only bound to demo buttons for future use. (preferably npm package)

const buttonGenerator = (count: number) => {
    if (count > 10) return;

    const buttons = [];

    for (let i = 0; i < count; i++) {
        buttons.push();
    }
};

const button1Listener = (ev: MouseEvent) => {
    // Start Demo, more buttons each a seperate (tv?) method, like all the shapes and then motion 101, etc
    console.log('button1 listener');
};

const button2Listener = (ev: MouseEvent) => {
    console.log('button2 listener');
};

const button3Listener = (ev: MouseEvent) => {
    console.log('button3 listener');
};

// Set all different paint types here for demo buttons
const buttonText = ['Transformed View', 'Static View', 'Playfield'];

let count = 1;

const buttonProps = (text: string) => ({
    mouseup: button1Listener,
    x: innerWidth / 10,
    y: innerHeight * (count++ * 0.1),
    type: <ButtonType>'fill',
    text: '',
    fill: '#00a800',
    r: 0,
    lw: 0,
    w: 150,
    h: 35,
    font: '16px Open Sans',
});

// const button2Props = {
//     mouseup: button2Listener,
//     x: innerWidth / 10,
//     y: innerHeight * 0.2,
//     type: <ButtonType>'stroke',
//     text: 'Stroke Button',
//     fill: '#00a800',
//     r: 0,
//     lw: 0,
//     w: 150,
//     h: 35,
//     font: '16px Open Sans',
// };

// const button3Props = {
//     mouseup: button3Listener,
//     x: innerWidth / 10,
//     y: innerHeight * 0.3,
//     type: <ButtonType>'fillStroke',
//     text: 'FillStroke Button',
//     fill: '#00a800',
//     r: 0,
//     lw: 0,
//     w: 150,
//     h: 35,
//     font: '16px Open Sans',
// };

export default {
    demo: () => {
        // const button1 = button.create(button1Props);
        // const button2 = button.create(button2Props);
        // const button3 = button.create(button3Props);
        // engine.setShow(button1.show);
        // engine.setShow(button2.show);
        // engine.setShow(button3.show);
        // window.log(button1.getTextProperties());
    },
};
