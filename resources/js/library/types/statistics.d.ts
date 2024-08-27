import {Engine, Show} from './engine';

type Statistic = {
    id: string | number;
    name: string;
    fn: () => string;
};

type StatisticResource = {
    id: string | number;
    statistics: Statistic[];
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    engine: Engine;
    show: Show;
    active: boolean;
};

type StatProperties = {
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
