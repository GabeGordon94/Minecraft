let Minecraft = {};
let board = document.getElementById('gameContainer');


Minecraft.createBoard = function () {
    let backgroundColor;
    for (var i = 0; i < 10; i++) {
        console.log('first');
        let newRow = document.createElement('div');
        newRow.className = 'rows';
        backgroundColor=Minecraft.getBoxProperty(i);
        for (var j = 0; j < 20; j++) {
            console.log('second');
            let box = document.createElement('div');
            box.style.backgroundColor=backgroundColor;
            //box.addEventListener('click', placeholder);//add event listener
            box.className = 'box';
            newRow.append(box);
        }
        board.appendChild(newRow);
    }
}
Minecraft.getBoxProperty=function(rowNumber){
    let color;
    switch (rowNumber) {
        case 0: case 1: case 2:case 3:case 4:case 5:
            color = 'blue';
            break;
        case 6:
            color = 'green';
            break;
        case 7:case 8:case 9:
            color = 'brown';
            break;
    }
    return color;
}


Minecraft.createBoard();