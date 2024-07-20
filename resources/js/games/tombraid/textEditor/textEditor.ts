import button from 'library/button/button';
import {loadFont} from 'library/font/font';
import {resources} from 'library/index';
import {ButtonEvent, ButtonOptions} from 'library/types/button';

export const loadTextEditor = async () => {
    // const detector = getDetector();

    button.create(resources.tr.context, resources.tr.engine, resources.tr.input, loadFontButtonOptions);
    button.create(resources.tr.context, resources.tr.engine, resources.tr.input, loadFontButtonOptions2);
    button.create(resources.tr.context, resources.tr.engine, resources.tr.input, loadFontButtonOptions3);
    button.create(resources.tr.context, resources.tr.engine, resources.tr.input, loadFontButtonOptions4);
    button.create(resources.tr.context, resources.tr.engine, resources.tr.input, loadFontButtonOptions5);
};

const mouseupLoadfont = async (event: ButtonEvent) => {
    const {sv} = resources.tr;

    await loadFont('OpenS', 'OpenSans-VariableFont_wdth,wght.ttf');

    // {x: number; y: number; txt: string; font?: string; fill: string; fontSize?: number};
    resources.tr.engine.setShow({
        fn: () =>
            sv.text({
                x: innerWidth * 0.5,
                y: innerHeight * 0.6,
                txt: 'Loaded Font Example Text OpenS 36',
                font: 'OpenS',
                fontSize: 36,
                fill: '#fff',
            }),
    });
};

const mouseupLoadfont2 = async (event: ButtonEvent) => {
    const {sv} = resources.tr;

    await loadFont('Harmond', 'Harmond-SemiBoldCondensed.otf');

    resources.tr.engine.setShow({
        fn: () =>
            sv.text({
                x: innerWidth * 0.5,
                y: innerHeight * 0.65,
                txt: 'Loaded Font Example Text Harmond-SemiBoldCondensed 36',
                font: 'Harmond',
                fill: '#fff',
                fontSize: 36,
            }),
    });
};

const mouseupLoadfont3 = async (event: ButtonEvent) => {
    const {sv} = resources.tr;

    await loadFont('Harmond2', 'Harmond-SemBdItaCond.otf');

    resources.tr.engine.setShow({
        fn: () =>
            sv.text({
                x: innerWidth * 0.5,
                y: innerHeight * 0.7,
                txt: 'Loaded Font Example Text Harmond-SemBdItaCond 36',
                font: 'Harmond2',
                fill: '#fff',
                fontSize: 36,
            }),
    });
};

const mouseupLoadfont4 = async (event: ButtonEvent) => {
    const {sv} = resources.tr;

    await loadFont('Harmond3', 'Harmond-ExtraBoldExpanded.otf');

    resources.tr.engine.setShow({
        fn: () =>
            sv.text({
                x: innerWidth * 0.5,
                y: innerHeight * 0.75,
                txt: 'Loaded Font Example Text Harmond-ExtraBoldExpanded 36',
                font: 'Harmond3',
                fill: '#fff',
                fontSize: 36,
            }),
    });
};

const mouseupLoadfont5 = async (event: ButtonEvent) => {
    const {sv} = resources.tr;

    await loadFont('Harmond4', 'Harmond-ExtBdItaExp.otf');

    resources.tr.engine.setShow({
        fn: () =>
            sv.text({
                x: innerWidth * 0.5,
                y: innerHeight * 0.8,
                txt: 'Loaded Font Example Text Harmond-ExtBdItaExp 36',
                font: 'Harmond4',
                fill: '#fff',
                fontSize: 36,
            }),
    });
};

const loadFontButtonOptions: ButtonOptions = {
    type: 'fillStrokeRound',
    x: innerWidth * 0.5,
    y: innerHeight * 0.1,
    w: innerWidth * 0.3,
    h: innerHeight * 0.06,
    r: 20,
    lw: 3,
    stroke: '#00f',
    hoverFill: '#222',
    id: 'loadfont',
    text: 'Load Font OpenS 24',
    font: '24px monospace',
    mouseup: mouseupLoadfont,
};

const loadFontButtonOptions2: ButtonOptions = {
    type: 'fillStrokeRound',
    x: innerWidth * 0.5,
    y: innerHeight * 0.2,
    w: innerWidth * 0.3,
    h: innerHeight * 0.06,
    r: 20,
    lw: 3,
    stroke: '#00f',
    hoverFill: '#222',
    id: 'loadfont',
    text: 'Load Font Harm1',
    font: '24px monospace',
    mouseup: mouseupLoadfont2,
};

const loadFontButtonOptions3: ButtonOptions = {
    type: 'fillStrokeRound',
    x: innerWidth * 0.5,
    y: innerHeight * 0.3,
    w: innerWidth * 0.3,
    h: innerHeight * 0.06,
    r: 20,
    lw: 3,
    stroke: '#00f',
    hoverFill: '#222',
    id: 'loadfont',
    text: 'Load Font Harm2',
    font: '24px monospace',
    mouseup: mouseupLoadfont3,
};

const loadFontButtonOptions4: ButtonOptions = {
    type: 'fillStrokeRound',
    x: innerWidth * 0.5,
    y: innerHeight * 0.4,
    w: innerWidth * 0.3,
    h: innerHeight * 0.06,
    r: 20,
    lw: 3,
    stroke: '#00f',
    hoverFill: '#222',
    id: 'loadfont',
    text: 'Load Font Harm3',
    font: '24px monospace',
    mouseup: mouseupLoadfont4,
};

const loadFontButtonOptions5: ButtonOptions = {
    type: 'fillStrokeRound',
    x: innerWidth * 0.5,
    y: innerHeight * 0.5,
    w: innerWidth * 0.3,
    h: innerHeight * 0.06,
    r: 20,
    lw: 3,
    stroke: '#00f',
    hoverFill: '#222',
    id: 'loadfont',
    text: 'Load Font Harm4',
    font: '24px monospace',
    mouseup: mouseupLoadfont5,
};

// Resources.state.engine.setShow({
//     fn: () =>
//         sv.text({
//             x: innerWidth * 0.5,
//             y: innerHeight * 0.55,
//             txt: 'Loaded Font Example Text monospace',
//             font: 'monospace',
//             fill: '#fff',
//         }),
// });

// Resources.state.engine.setShow({
//     fn: () =>
//         sv.text({
//             x: innerWidth * 0.5,
//             y: innerHeight * 0.6,
//             txt: 'Loaded Font Example Text Arial',
//             font: 'Arial',
//             fill: '#fff',
//         }),
// });

// Resources.state.engine.setShow({
//     fn: () =>
//         sv.text({
//             x: innerWidth * 0.5,
//             y: innerHeight * 0.65,
//             txt: 'Loaded Font Example Text serif',
//             font: 'serif',
//             fill: '#fff',
//         }),
// });

// Resources.state.engine.setShow({
//     fn: () =>
//         sv.text({
//             x: innerWidth * 0.5,
//             y: innerHeight * 0.7,
//             txt: 'Loaded Font Example Text sans-serif',
//             font: 'sans-serif',
//             fill: '#fff',
//         }),
// });
