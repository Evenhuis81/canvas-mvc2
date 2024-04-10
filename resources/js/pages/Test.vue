<template>
    <h2>Test Canvas Center Positioning</h2>
    <div id="container">
        <canvas id="canvas" width="640" height="480" />
    </div>
</template>

<style>
#container {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
}

#canvas {
    background-color: #000;
}

h2 {
    position: absolute;
    top: 10px;
    left: 40%;
    transform: translateX(-50%);
}
</style>
