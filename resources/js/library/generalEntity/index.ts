import {getProperties} from 'library/helpers';
import type {CRUD} from 'library/types';
import {resources} from '..';

const entities: Entity[] = [];

// const entity: Record<keyof CRUD, (options?: Partial<EntityOptions>) => void> = {
const createEntity = () => ({
    create: (options: Partial<EntityOptions> = {}) => create(options),
    read: () => read(),
    update: () => update(),
    destroy: () => destroy(),
});

const create = (options: Partial<EntityOptions>) => {
    const properties = getProperties(defaultEntityProperties, options);
};

const read = () => {
    //
};

const update = () => {
    //
};

const destroy = () => {
    //
};

const defaultEntityProperties = {
    id: 'noID',
    name: 'noName',
    x: 200,
    y: 299,
    w: 150,
    h: 50,
    lw: 2,
    r: 5,
    font: 'monospace',
    fontSize: 16,
    text: 'Entity',
    textFill: '#fff',
    stroke: '#f00',
    fill: '#000',
};

export default (resourceID: string | number) => {
    const entity = createEntity();
    const {engine, context, input} = resources[resourceID];

    const show = createShow(context);

    return entity;
};

const createShow = () => {
    //
};
