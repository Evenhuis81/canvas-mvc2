import button from 'library/button/button';
import {Button, ButtonOptions, ButtonType} from 'library/types/button';
import {resources} from '.';

// TODO::
// 1. Create buttons on the fly with auto-generator that also fills up the screen height and doesn't overflow.
// 2. Calculate heights and widths according to text and innerHeight;
// 3. Make all single use functions without duplicting too much code (ie. different show functions)
// 4. Make this module dynamic and not only bound to demo buttons for future use. (preferably npm package)

const buttonPropsGenerator = (amount: number) => {
    const buttons: ReturnType<typeof buttonProps>[] = [];

    for (let i = 0; i < amount; i++) buttons.push(buttonProps(buttonText[i], buttonListener[i]));

    return buttons;
};

const buttonListener = [
    (ev: MouseEvent) => {
        // Start Demo, more buttons each a seperate (tv?) method, like all the shapes and then motion 101, etc
        console.log('button1 listener');
    },

    (ev: MouseEvent) => {
        console.log('button2 listener');
    },

    (ev: MouseEvent) => {
        console.log('button3 listener');
    },
];

// Set all different paint types here for demo buttons
const buttonText = ['Transformed View', 'Static View', 'Playfield'];

let count = 1;

const buttonProps = (text: string, listener: (ev: MouseEvent) => void) => ({
    mouseup: listener,
    x: innerWidth / 10,
    y: innerHeight * (count++ * 0.1),
    type: <ButtonType>'fill',
    text,
    fill: '#00a800',
    r: 0,
    lw: 0,
    w: 150,
    h: 35,
    font: '16px Open Sans',
});

export default {
    demo: () => {
        const buttons: Button[] = [];

        buttonPropsGenerator(3).forEach((props: ButtonOptions) => buttons.push(button.create(props)));

        buttons.forEach(button => resources.state.engine.setShow(button.show));

        // engine.setShow(button1.show);
        // engine.setShow(button2.show);
        // engine.setShow(button3.show);
        // window.log(button1.getTextProperties());
    },
};
