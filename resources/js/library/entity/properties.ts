export const getInternalProperties = (
    properties: EntityOptions,
    engine: Engine,
    draw: Required<Draw>,
    update: Required<Update>,
) => {
    const {show, disabled, ...entity} = {...properties};

    const newProps = {entity, show, disabled}; // add Draw & Update?

    const events = createEntityEvents(newProps, engine, draw, update);

    const finalProps = {...newProps, events};

    console.log(newProps.show);

    finalProps.show = true;

    console.log(newProps.show);

    return finalProps;
};

// Test if destructuring properties becomes pass by reference or value
const createEntityEvents = (
    p: Omit<InternalEntityProperties, 'events'>,
    engine: Engine,
    draw: Required<Draw>,
    update: Required<Update>,
) => {
    const show = () => {
        if (p.show) throwError(p.entity.id, 'show');

        p.show = true;

        engine.setShow(draw);
    };
    const hide = () => {
        if (!show) throwError(p.entity.id, 'hiding');

        engine.removeShow(draw.id);

        p.show = false;
    };
    const destroy = () => {
        if (p.show) hide();

        if (!p.disabled) disable();
    };
    const enable = () => {
        if (!p.disabled) throwError(p.entity.id, 'enabled');

        p.disabled = false;

        engine.setUpdate(update);
    };
    const disable = () => {
        if (p.disabled) throwError(p.entity.id, 'disabled');

        engine.removeUpdate(update.id);

        p.disabled = true;
    };

    return {show, hide, destroy, enable, disable};
};

const throwError = (id: string | number = 'noID', subject: string = 'subject', action: string = "'noAction'") => {
    throw Error(`${subject} with id '${id}' already ${action}`);
};
