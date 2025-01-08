<script setup lang="ts">
import {initialize} from 'library/index';
import {EntityConfig} from 'library/types/entity';

const libraryID = 'timedash';

export default () => {
    const library = initialize(libraryID, {
        containerID: `${libraryID}-container`,
        full: true,
        clear: true,
        backgroundColor: '#000',
        engineStats: true,
    });

    const phaser1 = library.createPhaser();

    const entity1 = library.createEntity(example1);

    console.log(phaser1, entity1);

    return library;
};

const example1: EntityConfig = {
    text: '##$$$$ggfg*&&&1',
    w: 200,
    r: 0,
    // showDelay: 1500,
    // show: false,
    // disable: false,
    // = touch- and mousedown (not yet) / needs transition handlers
    mouse: {
        // button: 2,
        // down: () => {
        //     console.log('mouse down USER INPUT');
        // },
        up: () => {
            // example1.hide();
        },
    },
    startType: 'fadein1',
    startSpeed: 3,
    endType: 'fadeout1',
    endSpeed: 3,
    hoverType: 'bold',
    animationType: 'noise',
    animateAtStart: true,
    // animateAtEnd: true,
    // onStartEnd: () => {
    //     console.log('start transition ended USER INPUT');
    //     setTimeout(() => {
    //         console.log('timeout trigger (hide()');

    //         example1.hide();
    //     }, 1500);
    // },
    // onEndEnd: () => {
    //     console.log('end transition ended USER INPUT');
    // },
};
</script>
