import {ButtonOptionsRequired} from 'library/types/button';

// const stepsObj = {
//     button: 10,
// };

// const hoverProperties = {
//     steps: 10,
// };

export const getHoverProperties = (color: ButtonOptionsRequired['color']) => {
    console.log(color);
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
