export const getColorRGBA = (r: number, g: number, b: number, a: number) => ({r, g, b, a});

export const convertHexStringToRGBA = (colorString: string) => {
    if (colorString[0] !== '#') throw Error('color is not a HexString');

    const indexC: Array<number> = [];

    if (colorString.length === 4) {
        const hexValues: Array<number> = [];
        const cParsed = colorString.split('#')[1];

        for (let i = 0; i < 3; i++) hexValues.push(parseInt(`0x${cParsed[i]}`) * 17);

        return;
    }

    if (colorString.length === 7) {
        // temp
        return colorString;
    }

    const rgba = getColorRGBA(indexC[0], indexC[1], indexC[2], 1);

    return rgba;
};
