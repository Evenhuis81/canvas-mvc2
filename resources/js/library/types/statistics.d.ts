import {BaseID} from '.';

export type Statistic = {
    id: BaseID;
    name: string;
    fn: () => string;
};

export type StatisticResource = {
    libraryID: BaseID;
    statistics: Statistic[];
    setDraw: Function;
    removeDraw: Function;
    active: boolean;
};

export type StatProperties = {
    id: number;
    name: string;
    minY: number;
    stepY: number;
    minX: number;
    text: {
        fontSize: string;
        fontWeight: string;
        fontFamily: string;
        fontFamilyBackup: string;
        align: CanvasTextAlign;
        baseLine: CanvasTextBaseline;
        fillStyle: string;
    };
};
