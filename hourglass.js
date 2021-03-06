const WIDTH = 80;
const HEIGHT = 160;
const BOTTOM_HEIGHT = 80;
const TOP_HEIGHT = 80;
const grainCountTotal = 4800;

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
    for (let y = TOP_HEIGHT - 1; y >= 0; y--) {
        const grainsInThisRow = grainsInRow(y);
        //draw full row if we can
        let leftBorder = getLeftBorder(y);
        let rightBorder = getRightBorder(y);
        if ((currentGrains + grainsInThisRow) < grainCount) {
            ctx.fillRect(leftBorder, y, rightBorder - leftBorder, 1);
            currentGrains += grainsInThisRow;
        } else {
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
    //TODO invert getGrainsInPyramid or optimize with a table
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

function getColumnHeights() {
    let columnHeights = [];
    const height = bottomGrains.length;
    //go through columns
    for (let column = 0; column < bottomGrains[0].length; column++) {
        columnHeights[column] = 0; //pessimistic assumption
        //find any column that is more than 2 px taller than the neighbor
        for (let row = 0; row < height; row++) {
            if (bottomGrains[row][column] === 1) {
                columnHeights[column] = height - row;
                break;
            }
        }
    }
    return columnHeights;
}

function dropGrains() {
    //note that we skip bottom-most row as nothing can happen there
    for (let y = BOTTOM_HEIGHT - 2; y >= 0; y--) {
        for (let x = 0; x < WIDTH; x++) {
            //if there's no grain, don't do anything
            if (bottomGrains[y][x] === 0) {
                continue;
            }
            //if there's a space under a grain, let it fall
            else if (bottomGrains[y + 1][x] === 0) {
                bottomGrains[y + 1][x] = 1;
                bottomGrains[y][x] = 0;
            }
            //if there IS a grain underneath - check if we can fall to the left
            else if (y < BOTTOM_HEIGHT - 2) {
                if (x > 0 && bottomGrains[y + 1][x - 1] === 0) {
                    //swap the grains
                    bottomGrains[y + 1][x - 1] = 1;
                    bottomGrains[y][x] = 0;
                } //look to the right
                else if (x < WIDTH - 2 && bottomGrains[y + 1][x + 1] === 0) {
                    //swap the grains
                    bottomGrains[y + 1][x + 1] = 1;
                    bottomGrains[y][x] = 0;
                }
            }
        }
    }
}

function dropGrainToTheSide(columnHeights, column, otherColumn) {
    const height = bottomGrains.length;
    if (columnHeights[column] > columnHeights[otherColumn] + 1) {
        const thisColumnY = height - columnHeights[column];
        const leftColumnY = height - columnHeights[otherColumn] - 1;
        //this grain disappears
        bottomGrains[thisColumnY][column] = 0;
        columnHeights[column] -= 1;
        //to the column on the left and change the heights
        bottomGrains[leftColumnY][otherColumn] = 1;
        columnHeights[otherColumn] += 1;
    }
}

function settleGrains() {
    let columnHeights = getColumnHeights();
    const columnCount = bottomGrains[0].length;
    for (let column = 0; column < columnCount; column++) {
        //check if the grain can fall over to the left
        let otherColumn = column - 1;
        if (column > 0) {
            dropGrainToTheSide(columnHeights, column, otherColumn);
        }
        //check if the grain can fall over to the right
        otherColumn = column + 1;
        if (column < columnCount - 2) {
            dropGrainToTheSide(columnHeights, column, otherColumn);
        }
    }
}

function physicsStep() {
    //first let the grains fall
    dropGrains();

    //then let the grains settle
    //settleGrains();
}

let bottomGrains = initializeBottomGrains();

function initializeBottomGrains() {
    let bottomGrains = [];
    for (let i = 0; i < WIDTH; i++) {
        bottomGrains.push(new Array(HEIGHT / 2).fill(0));
    }
    return bottomGrains;
}

function spawn() {
    bottomGrains[0][WIDTH / 2] = 1;

}

function drawGrainsBottom(ctx) {
    ctx.fillStyle = getGrainStyle();

    for (let y = BOTTOM_HEIGHT - 1; y >= 0; y--) {
        for (let x = 0; x < WIDTH; x++) {
            if (bottomGrains[y][x] === 1) {
                ctx.fillRect(x, y + BOTTOM_HEIGHT, 1, 1);
            }
        }
    }
}

function drawGrainsBottomOld(ctx, grainCount) {
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
    drawGrainsTop(ctx, grainCountTop);
    drawGrainsBottom(ctx);
}

function reset() {
    grains.value = 0;
    draw();
}

var autorefreshCheckbox;

function tick() {
    if (!autorefreshCheckbox.checked)
        return;
    if (grains.valueAsNumber >= grainCountTotal)
        return;
    console.log('tick');
    manualTick();
}

function manualTick() {
    grains.value = grains.valueAsNumber + 1;
    spawn();
    physicsStep();
    spawn();
    physicsStep();
    spawn();
    physicsStep();
    draw();
}

function onload() {
    autorefreshCheckbox = document.getElementById("autorefreshCheckbox");
    grains = document.getElementById("grains");
    setInterval(tick, 1000 / 60);
    draw();
}