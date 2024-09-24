/* eslint-disable max-lines-per-function */
import {initialize, resources} from 'library/index';

export default {
    setup: () => {
        initialize('timedash', {
            containerID: 'timedash-container',
            full: true,
            clear: true,
            contextMenu: true,
            backgroundColor: '#000',
            statistics: {
                // overlay: true,
                // window: true,
                toggleKey: 'KeyH',
            },
        });
        // const aConfig = {
        //     headers: {
        //         // 'x-apikey': '59a7ad19f5a9fa0808f11931',
        //         'Access-Control-Allow-Origin': '*',
        //         // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        //     },
        // };

        const bool = {
            one: true,
            two: false,
        };

        const newBool = {
            one: bool.one,
        };

        console.log(bool.one, newBool.one);

        newBool.one = false;

        console.log(bool.one, newBool.one);

        // const asdf = axios.get(
        //     'https://eropics.to/2024/08/25/abbywinters-2024-08-13-ryana-stella-c-big-breasted-blondes-dressing-room-x115',
        //     aConfig,
        // );

        // console.log(asdf);

        // const {paint} = resources.timedash.sv;
        // paint('rectangle', testRectangle);

        // addEventListener('keyup', ({code}) => {
        //     if (code === 'KeyZ') {
        //         const source = '/statistics';
        //         const source2 = '/';
        //         const target = 'dsank';
        //         // const options = 'popup, width=300, height=300';

        //         const handler = window.open(source, target);

        //         setTimeout(() => window.open(source2, target), 2000);

        //         // setTimeout(() => handler?.close(), 2000);
        //         // console.log('no error', handler);

        //         // if (!handler) {
        //         //     console.log('error', handler);
        //         // }
        //     }
        // });

        // const base = {x: 0};
        // const basefill = {x: 0, fill: 'asdf'};

        // type FullBass = Bass & Fill;

        // type Bass = {x: number};
        // type Fill = {fill: string};
        // type BassFill = Bass & Partial<Fill>;

        // const getBase = <T extends BassFill>(bass: T): FullBass | undefined => {
        //     if (bass.fill) return Object.assign(bass, {fill: bass.fill});

        //     // const newBass = {...bass};

        //     return undefined;
        // };

        // const newBase = getBase(base);
        // const newBaseFill = getBase(basefill);
    },
    run: () => resources.timedash.engine.run(),
    runOnce: () => resources.timedash.engine.runOnce(),
};
