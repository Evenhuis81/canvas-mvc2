import createEntity from 'library/entity';
import {startLevel} from './initiatize';

export const goToMenu = () => {
    const buttons = createLevelButtons(5);

    const entity = createEntity('tr');

    const entities: UserEntity[] = [];

    buttons.forEach(button => entities.push(entity.create(button)));

    // entities.forEach(e => {
    //     e.setHandlers({
    //         up: () => {
    //             console.log('test up handlers entity');
    //         },
    //     });
    // });

    entities[0].setHandlers({
        up: () => {
            console.log('USER INPUT: Up handler');
        },
    });

    // mouse: {
    //     up: () => {
    //         // touch missing
    //         // level1.hide();
    //     },
    // },
    // onEndEnd: () => {
    //     startLevel(1);
    // },
};

const createLevelButtons = (amount: number) => {
    const heightDif = 70;
    const delayDif = 200;

    const base: Partial<EntityConfig> = {
        x: 80,
        y: 50,
        text: 'Entity #1',
        startType: 'fadein1',
        startSpeed: 3,
        endType: 'fadeout1',
        endSpeed: 3,
        showDelay: 0,
    };

    const buttons: (typeof base)[] = [];

    for (let i = 0; i < amount; i++) {
        base.y = 50 + i * heightDif;
        base.text = `Entity #${i + 1}`;
        base.showDelay = delayDif * i;

        buttons.push({...base});
    }

    return buttons;
};
