// Create static and dynamic properties
const playerProperties = () => ({
    x: 200,
    y: 150,
    r: 25,
    fill: '#000',
    stroke: '#fff',
    lw: 0,
    lwStep: 0.1,
    transitionEnd: false,
});

export const getPlayer = () => {
    const properties = playerProperties();

    // Fade in, blink few times then static (phase2)
    const transitionStart = () => {
        properties.lw += properties.lwStep;

        if (properties.lw > 7 || properties.lw < 0) properties.lwStep *= -1;
    };

    return {properties, transitionStart};
};
