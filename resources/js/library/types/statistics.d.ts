export type Statistic = {
    id: string | number;
    name: string;
    fn: () => string;
};

export type StatisticResource = {
    libraryID: string | number;
    statistics: Statistic[];
    setDraw: Function;
    removeDraw: Function;
    active: boolean;
    // canvas: HTMLCanvasElement;
    // context: CanvasRenderingContext2D;
    // engine: Engine;
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
