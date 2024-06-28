export const loadFont = async (name: string, url: string) => {
    // const font = new FontFace(name, `url(${url})`, {
    //     style: 'normal',
    //     weight: '400',
    //     stretch: 'condensed',
    // });

    const font = new FontFace(name, `url(${url})`);

    await font.load();

    document.fonts.add(font);

    // document.body.classList.add('fonts-loaded');

    return {font, name, url};
};
