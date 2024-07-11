import {createStore} from 'library/store';
import {getLibraryOptions, initialize} from 'library/index';
import type {ResourcesAndTV} from 'library/types';
// import {setDualView, onResize} from 'library/menu';
// import {getContext2D} from 'library/canvas';
// import {getStatistics} from 'library/statistics';
// import {loadFont} from 'library/font';
// import type {StatisticsResource} from 'library/types/statistics';
// import button from 'library/button/button';

export const devResources = createStore<ResourcesAndTV>();
// export const statistics = createStore<StatisticsResource>();

const options = {
    full: true,
    backgroundColor: '#000',
};

export default {
    setup: async () => {
        const {canvas, context, engine, tv, input} = initialize('container', options);

        devResources.set({canvas, context, engine, tv, input});

        // await loadFont('OpenS', 'OpenSans-VariableFont_wdth,wght.ttf');

        // const canvas2 = setDualView(canvas, 'container');
        // const context2 = getContext2D(canvas2);

        // const stats = getStatistics(context2, canvas2);

        // statistics.set(stats);

        // engine.setShow(statistics.state.show);

        const libOptions = getLibraryOptions(context, engine);

        libOptions.setClear();
        libOptions.setDot();

        initiateStatistics();
    },
    run: () => devResources.state.engine.run(),
    runOnce: () => devResources.state.engine.runOnce(),
};

const initiateStatistics = () => {
    // statistics.state.set({
    //     id: 8,
    //     name: 'player (middle) pos',
    //     fn: () => `player.x: ${player.middlePos.x}, player.y: ${player.middlePos.y}`,
    // });
    // statistics.state.setFn(() => `${tv.scale.x}`);
};
