const WIDTH = 80;
const HEIGHT = 160;

function getLeftBorder(y) {
    if (y < 40)
        return 0;
    else if (y < 80)
        return y - 40;
    else if (y < 120)
        return 120 - y;
    else
        return 0;
}

//TODO inline
function getRightBorder(y) {
    return WIDTH - getLeftBorder(y);
}

function drawBorders(ctx) {
    let glassStyle = '#DCEAF7';
    ctx.fillStyle = glassStyle;
    for (let y = 0; y < HEIGHT; y++) {
        let leftBorder = getLeftBorder(y);
        let rightBorder = getRightBorder(y);
        ctx.fillRect(leftBorder, y, rightBorder - leftBorder, 1);
    }
}

function grainsInRow(y) {
    return (WIDTH - getLeftBorder(y) * 2);
}

function getGrainStyle() {
    return "#775525";
}

function drawGrainsTop(ctx, grainCount) {
    ctx.fillStyle = getGrainStyle();
    //todo memoize
    //calculate amount of full rows
    let currentGrains = 0;
    for (let y = 80; y >= 0; y--) {
        const grainsInThisRow = grainsInRow(y);
        //draw full row if we can
        let leftBorder = getLeftBorder(y);
        let rightBorder = getRightBorder(y);
        if ((currentGrains + grainsInThisRow) < grainCount) {
            ctx.fillRect(leftBorder, y, rightBorder - leftBorder, 1);
            currentGrains += grainsInThisRow;
        }
        else {
            //draw partial row - disappearing from center out
            let remainingGrains = grainCount - currentGrains;
            let leftHalf = remainingGrains / 2;
            ctx.fillRect(leftBorder, y, leftHalf, 1);
            ctx.fillRect(rightBorder - leftHalf, y, leftHalf, 1);
            return;
        }
    }
}

function getGrainsInPyramid(pyramidHeight) {
    let grains = 0;
    for (let h = 1; h < pyramidHeight + 1; h++) {
        grains += (h * 2) - 1;
    }
    return grains;
}

function getPyramidHeight(grains) {
    //TODO invert getGrainsInPyramid
    let grainsInPyramid = 0;
    const PYRAMID_MAX_HEIGHT = 40;
    for (let h = 1; h <= PYRAMID_MAX_HEIGHT; h++) {
        grainsInPyramid += (h * 2) - 1;
        if (grainsInPyramid > grains)
            return h - 1;
    }
    return PYRAMID_MAX_HEIGHT;
}

function getGrainsInPyramidRow(row) {
    return row * 2 - 1;
}

//maybe draw 80% as full grains
function drawGrainsBottom(ctx, grainCount) {
    ctx.fillStyle = getGrainStyle();

    let currentGrains = 0;

    //step 2 - calculate height of the sand triangle limited to 80 px width
    const pyramidHeight = getPyramidHeight(grainCount);
    //if it's higher than 40, build N rows of foundation
    let foundationRows = 0;
    if (grainCount > 1600) {
        //TODO
        const foundationGrains = grainCount - 1600;
        foundationRows = Math.ceil(foundationGrains / WIDTH);
    }
    grainCount -= (foundationRows * WIDTH);
    //draw pyramid from bottom up
    for (let row = 0; row <= pyramidHeight; row++) {
        const grainsInRow = getGrainsInPyramidRow(pyramidHeight - row);
        ctx.fillRect(Math.floor(WIDTH / 2 - grainsInRow / 2), HEIGHT - row - foundationRows, grainsInRow, 1);
    }

    //draw foundation rows
    for (let foundationRow = 0; foundationRow < foundationRows; foundationRow++) {
        ctx.fillRect(0, HEIGHT - foundationRow, WIDTH, 1);
    }


    //step N - sand pillar if there's any sand left above
    ctx.fillRect(WIDTH / 2 - 1, 80, 1, 160);


    //todo memoize
    //calculate amount of full rows

    // for (let y = HEIGHT; y >= HEIGHT / 2; y--) {
    //     const grainsInThisRow = grainsInRow(y);
    //     //draw full row if we can
    //     let leftBorder = getLeftBorder(y);
    //     let rightBorder = getRightBorder(y);
    //     if ((currentGrains + grainsInThisRow) < grainCount) {
    //         ctx.fillRect(leftBorder, y, rightBorder - leftBorder, 1);
    //         currentGrains += grainsInThisRow;
    //     }
    //     else {
    //         //fill partial bottom row growing from outside in
    //         let remainingGrains = grainCount - currentGrains;
    //         ctx.fillRect((WIDTH / 2 - remainingGrains / 2), y, remainingGrains, 1);
    //         return;
    //     }
    // }
}

function getContext() {
    let canvas = document.getElementById("canvas");
    return canvas.getContext("2d");
}

function getGrainCountTop() {
    return grainCountTotal - grains.value;
}

function draw() {
    let ctx = getContext();
    drawBorders(ctx);
    const grainCountTop = getGrainCountTop();
    const grainCountBottom = grainCountTotal - grainCountTop;
    drawGrainsTop(ctx, grainCountTop);
    drawGrainsBottom(ctx, grainCountBottom);
}

function reset() {
    grains.value = 0;
    draw();
}

const grainCountTotal = 4800;
var autorefreshCheckbox;

function tick() {
    if (!autorefreshCheckbox.checked)
        return;
    if (grains.valueAsNumber >= grainCountTotal)
        return;
    console.log('tick');
    grains.value = grains.valueAsNumber + 7;
    draw();
}

function onload() {
    autorefreshCheckbox = document.getElementById("autorefreshCheckbox");
    grains = document.getElementById("grains");
    setInterval(tick, 1000 / 60);
    draw();
}