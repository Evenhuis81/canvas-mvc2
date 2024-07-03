import button from 'library/button/button';
import {Button, ButtonOptions, ButtonType} from 'library/types/button';
import {resources} from '.';

// TODO::
// 1. Create buttons on the fly with auto-generator that also fills up the screen height and doesn't overflow.
// 2. Calculate heights and widths according to text and innerHeight;
// 3. Make all single use functions without duplicting too much code (ie. different show functions)
// 4. Make this module dynamic and not only bound to demo buttons for future use. (preferably npm package)

const buttonPropsGenerator = (amount: number) => {
    const buttons: ReturnType<typeof getButtonProps>[] = [];

    for (let i = 0; i < amount; i++) {
        const buttonProps = getButtonProps(menuButtonText[i], fonts[i], buttonListener[i]);

        buttons.push(buttonProps);
    }

    return buttons;
};

const fonts = ['16px OpenS', '16px OpenS', '16px OpenS'];

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

// Menu Buttons (root)
const menuButtonText = ['Transformed View', 'Static View', 'Playfield'];
// const menuButtonText = ['Transformed View', 'Transformed View', 'Transformed View'];

// Set all different paint types here for demo buttons
// const tvPaintButtonText = [];
// const nonTvPaintButtonText = [];

let count = 1;

const getButtonProps = (text: string, font: string, listener: (ev: MouseEvent) => void) => ({
    mouseup: listener,
    x: innerWidth / 2,
    y: innerHeight * (count++ * 0.1),
    type: <ButtonType>'fill',
    text,
    fill: '#00a800',
    r: 0,
    lw: 0,
    w: innerWidth * 0.8,
    h: 35,
    font,
});

export default {
    demo: () => {
        const buttons: Button[] = [];

        buttonPropsGenerator(3).forEach((props: ButtonOptions) => buttons.push(button.create(props)));

        buttons.forEach(button => {
            resources.state.engine.setUpdate(button.update);
            resources.state.engine.setShow(button.show);
        });
    },
};
