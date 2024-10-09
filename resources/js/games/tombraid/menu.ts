import createEntity from 'library/entity';
// import {startLevel} from './initiatize';

export const mainMenu = () => {
    // Copy from tombraid main menu:
    const entity = createEntity('tr');

    const start = entity.create(mainButton);
    const settings = entity.create({...mainButton, y: innerHeight * 0.5, text: 'Settings'});
    const exit = entity.create({...mainButton, y: innerHeight * 0.75, text: 'Exit Game'});

    start.setListener('mouseup', () => {
        start.hide();
        settings.hide();
        exit.hide();
    });

    start.setListener('endTransitionEnd', () => {
        goToLevelSelection();
    });
};

// Make dynamic with calculatedOptions for resize canvas
// Entity Color can't take in regular css names (like 'red')
// Create superfast fadein fadeout (more speeds)
// Create oscillerate animation and / or real noise one

const mainButton: Partial<EntityConfig> = {
    startType: 'fadein1',
    startSpeed: 5,
    endType: 'fadeout1',
    endSpeed: 5,
    x: innerWidth * 0.5,
    y: innerHeight * 0.25,
    w: 400,
    h: 80,
    text: 'Start Game',
    r: 20,
    lw: 10,
    stroke: '#ff9900',
    fill: '#000',
    textFill: '#f00',
    fontSize: 64,
};

export const goToLevelSelection = () => {
    const elementAmount = 30;
    const fadeSpeed = 50;

    // TODO::Put this in resources
    // const entity = createEntity('tr');

    const entities = createLevelSelectEntities(elementAmount, fadeSpeed);

    // entities[0].setListener('mouseup', () => {
    //     for (let i = 0; i < elementAmount; i++) {
    //         setTimeout(() => {
    //             entities[i].hide();
    //         }, i * fadeInSpeed);
    //     }
    // });

    // entities[0].setListener('endTransitionEnd', () => {
    //     startLevel(3);
    // });
};

const createLevelSelectEntities = (amount: number, delayDif: number) => {
    const heightDif = innerHeight / amount - innerHeight * 0.1;
    const widthDif = innerWidth / amount - innerWidth * 0.1;

    const base: Partial<EntityConfig> = {
        x: widthDif,
        y: heightDif,
        text: '',
        startType: 'fadein1',
        startSpeed: 5,
        endType: 'fadeout1',
        endSpeed: 5,
        showDelay: 0,
    };

    const elements: UserEntity[] = [];
    // levelSelectElements.forEach(element => entities.push(entity.create(element)));

    // const buttons: Partial<EntityConfig>[] = [];

    for (let i = 0; i < amount; i++) {
        // const copyBase = {
        //     ...base,
        // }
        // copyBase.y += heightDif;
        // base.text = `#${i + 1}`;
        // base.showDelay = delayDif * i;

        elements.push({...base});
    }

    return elements;
};
