import {Show} from './engine';

type Statistic = {
    id: number;
    name: string;
    fn: () => string;
};

interface StatisticsResource {
    set: (stat: Statistic) => number;
    show: Show;
}
