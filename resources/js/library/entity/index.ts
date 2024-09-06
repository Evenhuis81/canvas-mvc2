import {getProperties, uid} from 'library/helpers';
import type {Resources} from 'library/types';
import {resources} from '..';

const createResource = (resources: Resources) => ({
    create: (options: Partial<EntityOptions> = {}) => create(options, resources),
});

const create = (options: Partial<EntityOptions>, {context, engine}: Resources) => {
    const properties = {...getProperties(defaultProperties, options), id: options.id ?? `entity-${uid()}`};

    const draw = createDraw(properties, context);

    const update = createUpdate(properties, {xVel: 0.1, count: 0, max: 60});

    const show = () => {
        if (properties.show) throwError(properties.id, 'show');

        properties.show = true; // internal property

        engine.setShow(draw);
    };

    const hide = () => {
        if (!properties.show) throwError(properties.id, 'hiding');

        engine.removeShow(draw.id);

        properties.show = false;
    };

    const destroy = () => {
        if (properties.show) hide();

        if (!properties.disabled) disable();
    };

    const enable = () => {
        if (!properties.disabled) throwError(properties.id, 'enabled');

        properties.disabled = false;

        engine.setUpdate(update);
    };

    const disable = () => {
        if (properties.disabled) throwError(properties.id, 'disabled');

        engine.removeUpdate(update.id);

        properties.disabled = true;
    };

    if (!properties.disabled) {
        properties.disabled = true;

        enable();
    }
    if (properties.show) {
        properties.show = false;

        show();
    }

    return {id: properties.id, show, hide, destroy, disable, enable};
};

const throwError = (id: string | number = 'noID', action: string = "'noAction'") => {
    throw Error(`entity with id '${id}' already ${action}`);
};

const createUpdate = (properties: EntityOptions, transition: {xVel: number; count: number; max: number}) => ({
    id: properties.id,
    name: `update-${properties.name}`,
    fn: () => {
        properties.x += transition.xVel;

        transition.count++;

        if (transition.count > 60) {
            transition.xVel *= -1;

            transition.count = 0;
        }
    },
});

const createDraw = (properties: EntityOptions, ctx: CanvasRenderingContext2D) => ({
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
        ctx.fillText(properties.text, properties.x, properties.y + 1.5); // TODO::use textAscend / -descent
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
