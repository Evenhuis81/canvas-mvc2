import createEntity from 'library/entity';

export const goToMenu = () => {
    const entity = createEntity('tr');

    const button = entity.create({
        text: 'run',
        startType: 'fadein1',
        startSpeed: 3,
        endType: 'fadein1',
        endSpeed: 2,
        mouse: {
            up: () => {
                console.log('mouseup button');
            },
        },
    });
};
