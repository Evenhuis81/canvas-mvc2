import createEntity from 'library/entity';
import {startLevel} from './initiatize';

export const goToMenu = () => {
    const buttons = createLevelButtons(5);

    const entity = createEntity('tr');

    const entities: UserEntity[] = [];

    buttons.forEach(button => entities.push(entity.create(button)));

    entities[0].setHandler({
        type: 'mouseup',
        listener: () => {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    entities[i].hide();
                }, i * 200);
            }
        },
    });

    entities[0].setHandler({
        type: 'endTransitionEnd',
        listener: () => {
            startLevel(3);
        },
    });
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
