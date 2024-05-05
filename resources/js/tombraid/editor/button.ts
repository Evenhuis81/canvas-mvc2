import {StrokeRoundRectObj} from 'library/types/tv';
import {gameStore} from '../store';

const button: StrokeRoundRectObj = {
    x: 0,
    y: 0,
    w: 6,
    h: 1,
    r: 1,
    color: 'purple',
};

export const getButton = (txt: string) => {
    const {tv} = gameStore.state;

    const show = () => {
        tv.strokeRoundRect(button);
        tv.text({txt, x: 3, y: 0.5});
    };

    return {show};
};
