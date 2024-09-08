import {getProperties, uid} from 'library/helpers';
import {resources} from '..';
import type {Resources} from 'library/types';
import {getInternalEntity} from './properties';

const createResource = (resources: Resources) => ({
    create: (options: Partial<EntityConfig> = {}) => create(options, resources),
});

const create = (options: Partial<EntityConfig>, {context, engine, input}: Resources) => {
    // TODO::Firstly seperate the entity properties from the internal properties (or mixed ones)
    const {click, ...rest} = {...getProperties(defaultProperties, options), id: options.id ?? `entity-${uid()}`};

    // EntityConfig => InternalEntity
    const entity2 = getInternalEntity(config, engine, draw, update);

    // See note update
    const draw = createDraw(config, context);

    // Add update type and use update object to automatically call updatetype (see button)
    const update = updates.noise(config);

    // Events
    const mousedownEvent = (evt: MouseEvent) => {
        if (input.mouse.insideRect(config) && evt.button === 0) {
            // props.pushed = true;
            config.w *= 0.9;
            config.h *= 0.9;

            entity.handlers.down(entity.events);
        }
    };

    addEventListener('mousedown', mousedownEvent);

    // Initializer
    initialize(entity);

    return entity.events;
};

const initialize = (entity: InternalEntity) => {
    if (!entity.disabled) {
        entity.disabled = true;

        entity.events.enable();
    }

    if (entity.show) {
        entity.show = false;

        entity.events.show();
    }
};

// max property is default 60, need for deltaTime, adj is change in property
// make this a createProperties that picks the needed properties for each update respectively
// This could also serve as a originalProperties object
const updateProperties = {
    vel: {
        x: 0,
        y: 0,
    },
    adj: 0.05,
    lw: 0,
    count: 0,
    max: 60,
    angle: 0,
};

const updates = {
    noise: (properties: EntityConfig) => createNoiseUpdate(properties),
};

const createNoiseUpdate = (properties: EntityConfig) => ({
    id: properties.id,
    name: `update-${properties.name}`,
    fn: () => {
        properties.x += updateProperties.adj;

        updateProperties.count++;

        if (updateProperties.count > 60) {
            updateProperties.adj *= -1;

            updateProperties.count = 0;
        }
    },
});

const createDraw = (properties: EntityConfig, ctx: CanvasRenderingContext2D) => ({
    id: properties.id, // entityID
    name: `draw-${properties.name}`,
    fn: () => {
        ctx.fillStyle = properties.fill;
        ctx.strokeStyle = properties.stroke;
        ctx.lineWidth = properties.lw;

        ctx.beginPath();
        ctx.roundRect(
            properties.x - properties.w / 2,
            properties.y - properties.h / 2,
            properties.w,
            properties.h,
            properties.r,
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = properties.textFill;
        ctx.font = `${properties.fontSize}px ${properties.font}`;

        ctx.textAlign = properties.textAlign;
        ctx.textBaseline = properties.textBaseLine;

        ctx.beginPath();
        ctx.fillText(properties.text, properties.x, properties.y + 1.5);
    },
});

const defaultEntityProperties = {
    name: 'noName',
    x: 200,
    y: 299,
    w: 150,
    h: 50,
    lw: 2,
    r: 5,
    stroke: '#f00',
    fill: '#000',
    textFill: '#fff',
    text: 'Entity',
    font: 'monospace',
    fontSize: 16,
    textAlign: 'center',
    textBaseLine: 'middle',
};

// const defaultInternal

export default (resourceID: string | number) => createResource(resources[resourceID]);
