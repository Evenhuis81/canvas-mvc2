import {Levels} from 'types/level';

// Legenda
// X = solid block all sides
// S = player start position
// . = empty space
// T = trap floor

export const getLevelMap = (id: number) => levels[id];

const levels: Levels = {
    1: [
        ['X', 'X', 'X', 'X', 'X'],
        ['X', 'S', '.', '.', 'X'],
        ['X', '.', '.', '.', 'X'],
        ['X', '.', '.', '.', 'X'],
        ['X', 'X', 'X', 'X', 'X'],
    ],
    2: [
        ['X', '.', 'X', '.', 'X'],
        ['X', 'S', '.', '.', 'X'],
        ['X', 'X', 'X', '.', 'X'],
        ['X', 'T', '.', '.', 'X'],
        ['X', 'X', 'X', 'X', 'X'],
    ],
};
