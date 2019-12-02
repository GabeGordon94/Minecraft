// testing github!
let Minecraft = {};
let board = document.getElementById('gameContainer');


Minecraft.createBoard = function () {
    let backgroundClass;
    let numOfRows = 10;
    let numOfCol = 20;
    for (var i = 0; i < numOfRows; i++) {
        let newRow = document.createElement('div');
        newRow.className = 'rows';
        backgroundClass = Minecraft.getBoxProperty(i);
        for (var j = 0; j < numOfCol; j++) {
            let box = document.createElement('div');
            box.classList.add(backgroundClass);
            box.classList.add('box');
            box.setAttribute('row', i);
            box.setAttribute('col', j);
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
    let eventBox = e.target;

    if (Minecraft.isRemoveable(eventBox)) {
        eventBox.classList.remove('grass');
        eventBox.classList.remove('ground');
    }

}

Minecraft.getRow = function (box) {
    return box.getAttribute('row');
}

Minecraft.getCol = function (box) {
    return box.getAttribute('col');
}

Minecraft.isOpenSpace = function (box) {
    let isOpen = true;
    console.log(box);
    if (box != "") {

        if (box.classList.contains('grass')) {
            isOpen = false;
        } else if (box.classList.contains('ground')) {
            isOpen = false;
        }
    }else{
        isOpen=false;
    }

    return isOpen;
}

Minecraft.isRemoveable = function (box) {
    //check div at all four sides - one side has to not equal ground or grass
    let boxRow = Minecraft.getRow(box);
    let boxCol = Minecraft.getCol(box);
    let boxsList = document.getElementsByClassName('box');
    let boxRight = "";
    let boxLeft = "";
    let boxTop = "";
    let boxBottom = "";

    for (var i = 0; i < boxsList.length; i++) {
        let currentBoxRow = Minecraft.getRow(boxsList[i]);
        let currentBoxCol = Minecraft.getCol(boxsList[i]);

        if ((currentBoxRow == boxRow - 1) && (currentBoxCol == boxCol)) {
            boxTop = boxsList[i];
        } else if ((currentBoxRow - 1 == boxRow) && (currentBoxCol == boxCol)) {
            boxBottom = boxsList[i];
        } else if ((currentBoxRow == boxRow) && (currentBoxCol == boxCol - 1)) {
            boxLeft = boxsList[i];
        } else if ((currentBoxRow == boxRow) && (currentBoxCol - 1 == boxCol)) {
            boxRight = boxsList[i];
        }
    }

    if (Minecraft.isOpenSpace(boxRight) || Minecraft.isOpenSpace(boxLeft) ||
        Minecraft.isOpenSpace(boxTop) || Minecraft.isOpenSpace(boxBottom)) {
        return true;
    } else {
        return false;
    }

}
Minecraft.createRow = function (rowId){
    for (let i = 0; i < 6; i++) {
        let newDiv = document.createElement('div');
        newDiv.className = 'tool';
        rowId.append(newDiv);
    }
}
Minecraft.createToolBox = function () {
    topToolBox = document.getElementById('top-toolBox');
    bottomToolBox = document.getElementById('bottom-toolBox');
    Minecraft.createRow(topToolBox);
    Minecraft.createRow(bottomToolBox);
    Minecraft.tools = document.getElementsByClassName('tool');
    Minecraft.grassTool = Minecraft.tools[0];
    Minecraft.grassTool.classList.add('grassTool');
    Minecraft.groundTool = Minecraft.tools[1];
    Minecraft.groundTool.classList.add('groundTool');
    Minecraft.grassTool.innerText = "0";
    Minecraft.groundTool.innerText = "0";
}
Minecraft.createToolBox();
Minecraft.createBoard();