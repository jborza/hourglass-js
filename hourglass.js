const WIDTH = 80;
const HEIGHT = 160;

function getLeftBorder(y){
    return Math.max(0, 120-y);
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
    return (getLeftBorder(y) * 2 - WIDTH);
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

}

function getContext() {
    let canvas = document.getElementById("canvas");
    return canvas.getContext("2d");
}

function draw() {
    let ctx = getContext();
    drawBorders(ctx);
    const grainCount = 900;
    drawGrainsTop(ctx, grainCount);
    drawGrainsBottom(ctx, grainCount);
}

window.onload = draw();