import {addProp} from 'library/helpers';

// This method handles way too much, abstract and`divide
export const getInternalEntity: (
    engine: Engine,
    draw: Required<Draw>,
    update: Required<Update>,
    sketch: EntitySketch,
    id: number | string,
    name: string,
    disabled: boolean,
    show: boolean,
) => InternalEntity = (engine, draw, update, sketch, id, name, disabled, show, click) => {
    const properties = {id, name, disabled, show, entity: sketch};

    const events = createEntityEvents(properties, engine, draw, update);

    addProp(properties, 'events', events);

    return properties;
};

export const createEntityEvents = (
    props: Omit<InternalEntity, 'events' | 'handlers'>,
    engine: Engine,
    draw: Required<Draw>,
    update: Required<Update>,
) => {
    const show = () => {
        if (props.show) throwError(props.id, 'show');

        props.show = true;

        engine.setShow(draw);
    };
    const hide = () => {
        if (!show) throwError(props.id, 'hiding');

        engine.removeShow(draw.id);

        props.show = false;
    };
    const destroy = () => {
        if (props.show) hide();

        if (!props.disabled) disable();
    };
    const enable = () => {
        if (!props.disabled) throwError(props.id, 'enabled');

        props.disabled = false;

        engine.setUpdate(update);
    };
    const disable = () => {
        if (props.disabled) throwError(props.id, 'disabled');

        engine.removeUpdate(update.id);

        props.disabled = true;
    };

    return {show, hide, destroy, enable, disable};
};

export const getHandlers = (handlers?: Partial<EntityHandlers>) => ({
    up: () => {},
    down: () => {},
    ...handlers,
});

const throwError = (id: string | number = 'noID', subject: string = 'subject', action: string = "'noAction'") => {
    throw Error(`${subject} with id '${id}' already ${action}`);
};
