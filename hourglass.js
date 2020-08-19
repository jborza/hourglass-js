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
        if((currentGrains + grainsInThisRow) < grainCount){
            let leftBorder = getLeftBorder(y);
            let rightBorder = getRightBorder(y);
            ctx.fillRect(leftBorder, y, rightBorder-leftBorder, 1);
            currentGrains += grainsInThisRow;
        }
    }
}

function drawGrainsBottom(ctx, grainCount){
    ctx.fillStyle = getGrainStyle();
    //todo memoize
    //calculate amount of full rows
    let currentGrains = 0;
    for(y = HEIGHT; y >= HEIGHT/2; y--){
        const grainsInThisRow = grainsInRow(y);
        //draw full row if we can
        if((currentGrains + grainsInThisRow) < grainCount){
            let leftBorder = getLeftBorder(y);
            let rightBorder = getRightBorder(y);
            ctx.fillRect(leftBorder, y, rightBorder-leftBorder, 1);
            currentGrains += grainsInThisRow;
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
    const grainCountTotal = 4000;
    const grainCountTop = getGrainCountTop();
    const grainCountBottom = grainCountTotal - grainCountTop;
    drawGrainsTop(ctx, grainCountTop);
    drawGrainsBottom(ctx, grainCountBottom);
}

window.onload = draw();