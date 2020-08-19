const WIDTH = 80;
const HEIGHT = 160;

function getLeftBorder(y){
    if(y < 40)
        return 0;
    else if(y < 80)
        return y-40;
    else if(y < 120)
        return 120-y;
    else
        return 0;
}

//TODO inline
function getRightBorder(y){
    return WIDTH - getLeftBorder(y);
}

function drawBorders(ctx) {
    let glassStyle = '#DCEAF7';
    ctx.fillStyle = glassStyle;
    for(y = 0; y < HEIGHT; y++){
        let leftBorder = getLeftBorder(y);
        let rightBorder = getRightBorder(y);
        ctx.fillRect(leftBorder, y, rightBorder-leftBorder, 1);
    }
}

function grainsInRow(y){
    return (WIDTH - getLeftBorder(y) * 2);
}

function getGrainStyle(){
    return "#775525";
}

function drawGrainsTop(ctx, grainCount){
    ctx.fillStyle = getGrainStyle();
    //todo memoize
    //calculate amount of full rows
    let currentGrains = 0;
    for(y = 80; y >= 0; y--){
        const grainsInThisRow = grainsInRow(y);
        //draw full row if we can
        let leftBorder = getLeftBorder(y);
        let rightBorder = getRightBorder(y);
        if((currentGrains + grainsInThisRow) < grainCount){
            ctx.fillRect(leftBorder, y, rightBorder-leftBorder, 1);
            currentGrains += grainsInThisRow;
        }
        else{
            //draw partial row - disappearing from center out
            let remainingGrains = grainCount - currentGrains;
            let leftHalf = remainingGrains / 2;
            ctx.fillRect(leftBorder, y, leftHalf, 1);
            ctx.fillRect(rightBorder-leftHalf, y, leftHalf, 1);
            return;
        }
    }
}

//maybe draw 80% as full grains
function drawGrainsBottom(ctx, grainCount){
    ctx.fillStyle = getGrainStyle();
    //todo memoize
    //calculate amount of full rows
    let currentGrains = 0;
    for(y = HEIGHT; y >= HEIGHT/2; y--){
        const grainsInThisRow = grainsInRow(y);
        //draw full row if we can
        let leftBorder = getLeftBorder(y);
        let rightBorder = getRightBorder(y);
        if((currentGrains + grainsInThisRow) < grainCount){
            ctx.fillRect(leftBorder, y, rightBorder-leftBorder, 1);
            currentGrains += grainsInThisRow;
        }
        else{
            //fill partial bottom row growing from outside in
            let remainingGrains = grainCount - currentGrains;
            ctx.fillRect((WIDTH/2-remainingGrains/2), y, remainingGrains, 1);
            return;
        }
    }
}

function getContext() {
    let canvas = document.getElementById("canvas");
    return canvas.getContext("2d");
}

function getGrainCountTop(){
    let grains = document.getElementById("grains");
    return grains.value;
}

function draw() {
    let ctx = getContext();
    drawBorders(ctx);
    const grainCountTotal = 4800;
    const grainCountTop = getGrainCountTop();
    const grainCountBottom = grainCountTotal - grainCountTop;
    drawGrainsTop(ctx, grainCountTop);
    drawGrainsBottom(ctx, grainCountBottom);
}

window.onload = draw();