export type RGB = {
    r: number;
    g: number;
    b: number;
};

export type RGBA = RGB & {a: number};

// | EntityColors
export type Colors = {
    fill: RGBA;
    stroke: RGBA;
    textFill: RGBA;
};
