import {ButtonOptionsRequired, ColorRGBA} from 'library/types/button';

// const stepsObj = {
//     button: 10,
// };

// const hoverProperties = {
//     steps: 10,
// };

export const getTransitions = (color: ButtonOptionsRequired['color']) => {
    console.log(color);

    const on = () => {};
    const off = () => {};

    return {on, off};
};

const colorRGBAMin = (source: ColorRGBA, target: ColorRGBA, steps: number = 10) => {
    const minR = (target.r - source.r) / steps;
    const minG = (target.g - source.g) / steps;
    const minB = (target.b - source.b) / steps;
    const minA = (target.a - source.a) / steps;

    return {r: minR, g: minG, b: minB, a: minA};
};

// Do this according to the number of steps or make a if max / min statement
// Also possible to add or remove different types of updates to the engine to sort this problem
// const hover = (, button: ButtonOptionsRequired, steps = 10) => {
//     if (hoverProperties.steps === 0) return;
//     button.textFill.r += min.r;
//     button.textFill.g += min.g;
//     button.textFill.b += min.b;

//     stepsObj.button--;
// };

// const createOriginalProperties = (source: unknown) => {
//     //
// };

// const hoverOff = ({min}: HoverProperties, button: ButtonOptionsRequired, steps = 10) => {
//     if (stepsObj.button === 10) return;

//     button.textFill.r -= min.r;
//     button.textFill.g -= min.g;
//     button.textFill.b -= min.b;

//     stepsObj.button++;
// };
