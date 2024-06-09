// type StatisticsNames = ''

type Statistic = {
    id: number;
    name: string; // make this another Union Type?
    fn: () => void;
};

const statistics: Statistic[] = [];

export const setStatistics = (stat: Statistic) => {
    statistics.push(stat);
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

const properties: StatProperties = {
    id: 88,
    name: 'statistics show',
    minY: 100,
    stepY: 20,
    minX: 50,
    text: {
        fontSize: '20px',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontFamilyBackup: 'arial',
        align: 'center',
        baseLine: 'middle',
        fillStyle: '#fff',
    },
};

export default {
    getStatiticsShow: (context: CanvasRenderingContext2D) => ({
        id: properties.id,
        name: properties.name,
        fn: () => {
            for (let i = 0; i < statistics.length; i++) {
                context.beginPath();

                context.fillStyle = properties.text.fillStyle;

                context.font = `${properties.text.fontSize} ${properties.text.fontWeight} ${properties.text.fontFamily} ${properties.text.fontFamilyBackup}`;

                context.textAlign = properties.text.align;

                context.textBaseline = properties.text.baseLine;
            }
        },
    }),
};

// export const setStatistics = () => {};

// export const setStatistics = () => {};

// export const setStatistics = () => {};
