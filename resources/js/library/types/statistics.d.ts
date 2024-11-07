export type StatisticViewType = 'popup' | 'overlay' | 'tab' | 'dual';

export interface StatisticOptions {
    type: StatisticViewType;
    toggleKey?: string; // create default when no toggleKey or button is provided and log/warning to user
    button?: boolean; // expand with options (position, ...)
    width?: number; // width & height | top & left -> autoset type to popup
    height?: number;
    top?: number;
    left?: number;
}

export type Statistic = {
    id: string | number;
    name: string;
    fn: () => string;
};

export type StatisticResource = {
    id: string | number;
    statistics: Statistic[];
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    engine: Engine;
    draw: Draw;
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
