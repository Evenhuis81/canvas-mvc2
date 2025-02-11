import {Colors} from './types/color';
import {EntityColors, EntityShapeMap} from './types/entitySketch';

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export const hexToRgb = (hex: string) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) throw Error(`No result from hexToRgb for ${hex}`);

    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    };
};

// export const getSketchRGBAColorsFromHexStringPartial = ({
//     fill,
//     stroke,
//     textFill,
// }: {
//     fill?: string;
//     stroke?: string;
//     textFill?: string;
// }) => ({
//     fill: fill ? {a: 1, ...hexToRgb(fill)} : undefined,
//     stroke: stroke ? {a: 1, ...hexToRgb(stroke)} : undefined,
//     textFill: textFill ? {a: 1, ...hexToRgb(textFill)} : undefined,
// });
