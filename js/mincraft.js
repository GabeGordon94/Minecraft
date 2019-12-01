let Minecraft = {};
let board = document.getElementById('gameContainer');


Minecraft.createBoard = function () {
    let backgroundClass;
    let numOfRows = 10;
    let numOfCol = 20;
    for (var i = 0; i < numOfRows; i++) {
        console.log('first');
        let newRow = document.createElement('div');
        newRow.className = 'rows';
        backgroundClass = Minecraft.getBoxProperty(i);
        for (var j = 0; j < numOfCol; j++) {
            console.log('second');
            let box = document.createElement('div');
            box.classList.add(backgroundClass);
            box.classList.add('box');
            if (box.classList.contains('grass') || box.classList.contains('ground')) {
                box.addEventListener('click', Minecraft.clickBox);
            }
            newRow.append(box);
        }
        board.appendChild(newRow);
    }
}
Minecraft.getBoxProperty = function (rowNumber) {
    let boxClass;
    switch (rowNumber) {
        case 0: case 1: case 2: case 3: case 4: case 5:
            boxClass = 'sky'
            break;
        case 6:
            boxClass = 'grass';
            break;
        case 7: case 8: case 9:
            boxClass = 'ground';
            break;
    }
    return boxClass;
}

Minecraft.clickBox = function (e) {
    let eventBox=e.target;

    eventBox.classList.remove('grass');
    eventBox.classList.remove('ground');

    alert(e.target.classList);

}


Minecraft.createBoard();