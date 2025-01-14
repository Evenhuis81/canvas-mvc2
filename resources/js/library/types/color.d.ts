type RGB = {
    r: number;
    g: number;
    b: number;
};

type RGBA = RGB & {a: number};

// EntityColors (temp)
export type Colors = {
    fill: RGBA;
    stroke: RGBA;
    textFill: RGBA;
};
