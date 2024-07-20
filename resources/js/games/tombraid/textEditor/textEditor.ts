import {getDetector, loadFont} from 'library/font/font';

export const loadTextEditor = async () => {
    await loadFont('OpenS', 'OpenSans-VariableFont_wdth,wght.ttf');

    const detector = getDetector();

    console.log(detector.detect('OpenS'));

    const textExample = () => {
        //
    };
};
