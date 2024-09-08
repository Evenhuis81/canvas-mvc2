import {addProp} from 'library/helpers';

export const getInternalEntity = (
    config: EntityConfig,
    engine: Engine,
    draw: Required<Draw>,
    update: Required<Update>,
) => {
    const {show, disabled, ...entity} = config;

    const properties = {show, disabled, entity: {...entity}};

    const events = createEntityEvents(properties, engine, draw, update);

    addProp(properties, 'events', events);

    return properties;
};

const createEntityEvents = (
    props: Omit<InternalEntity, 'events'>,
    engine: Engine,
    draw: Required<Draw>,
    update: Required<Update>,
) => {
    const show = () => {
        if (props.show) throwError(props.entity.id, 'show');

        props.show = true;

        engine.setShow(draw);
    };
    const hide = () => {
        if (!show) throwError(props.entity.id, 'hiding');

        engine.removeShow(draw.id);

        props.show = false;
    };
    const destroy = () => {
        if (props.show) hide();

        if (!props.disabled) disable();
    };
    const enable = () => {
        if (!props.disabled) throwError(props.entity.id, 'enabled');

        props.disabled = false;

        engine.setUpdate(update);
    };
    const disable = () => {
        if (props.disabled) throwError(props.entity.id, 'disabled');

        engine.removeUpdate(update.id);

        props.disabled = true;
    };

    return {show, hide, destroy, enable, disable};
};

const throwError = (id: string | number = 'noID', subject: string = 'subject', action: string = "'noAction'") => {
    throw Error(`${subject} with id '${id}' already ${action}`);
};
