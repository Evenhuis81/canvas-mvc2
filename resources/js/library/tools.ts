export const clamp = (obj: {value: number; min: number; max: number}) =>
    Math.min(obj.max, Math.max(obj.min, obj.value));

/** Pick a random string from an array and return it */
export const pickString = <T extends string>(str: T[]) => {
    const dice = Math.random();
    const perc = 1 / str.length;

    // for every possible percentage based on the array length, check if the dice is in that range and return it
    for (let i = 0; i < str.length; i++) if (dice < perc * (i + 1)) return str[i];

    // last pick if other percentages fail (to round it up to 1)
    return str[-1];
};

function convertToSRT(inputText: string) {
    const lines = inputText.trim().split('\n');
    let srt = '';
    let counter = 1;

    for (const line of lines) {
        const match = line.match(/^\[(\d{2}:\d{2}(?::\d{2})?\.\d{3}) --> (\d{2}:\d{2}(?::\d{2})?\.\d{3})\]\s*(.*)$/);
        if (match) {
            const start = match[1].replace('.', ',');
            const end = match[2].replace('.', ',');
            const text = match[3];

            srt += `${counter++}\n${start} --> ${end}\n${text}\n\n`;
        }
    }

    return srt.trim();
}
