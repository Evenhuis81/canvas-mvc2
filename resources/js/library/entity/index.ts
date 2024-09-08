import {getProperties, uid} from 'library/helpers';
import {resources} from '..';
import type {Resources} from 'library/types';
import {getInternalEntity} from './properties';

const createResource = (resources: Resources) => ({
    create: (options: Partial<EntityConfig> = {}) => create(options, resources),
});

const create = (options: Partial<EntityConfig>, {context, engine}: Resources) => {
    const config = {...getProperties(defaultProperties, options), id: options.id ?? `entity-${uid()}`};

    const draw = createDraw(config, context);
    const update = createUpdate(config);

    // EntityOptions => InternalEntityProperties
    const entity = getInternalEntity(config, engine, draw, update);

    // if (!props.disabled) {
    //     props.disabled = true;

    //     props.events.enable();
    // }

    // if (props.show) {
    //     props.show = false;

    //     props.events.show();
    // }

    // console.log(props.disabled, props.oldProps.disabled);

    // props.disabled = true;

    // console.log(props.disabled, props.oldProps.disabled);

    // return {id: properties.id, ...props.events};
    return entity;
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

const createUpdate = (properties: EntityConfig) => ({
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

const defaultProperties = {
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
    disabled: false,
    show: true,
};

export default (resourceID: string | number) => createResource(resources[resourceID]);
