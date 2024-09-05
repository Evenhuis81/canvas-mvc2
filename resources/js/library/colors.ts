export const getColorRGBA = (r: number, g: number, b: number, a: number) => ({r, g, b, a});

export const convertHexStringToRGBA = (colorString: string) => {
    if (colorString[0] !== '#') throw Error('color is not a HexString');

    const indexC: Array<number> = [];

    if (colorString.length === 4) {
        const int = parseInt(colorString[1], 16) + 1;

        console.log(int * 16 - 1);
        // for (let i = 1; i < 5; i++) indexC.push(colorString[i-1].parseInt)
    } else if (colorString.length === 7) {
        // temp
        return colorString;
    }

    const rgba = getColorRGBA(indexC[0], indexC[1], indexC[2], 1);

    return rgba;
};
