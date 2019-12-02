// testing github!
let Minecraft = {};
let board = document.getElementById('gameContainer');


Minecraft.createBoard = function () {
    board.style.display = 'block';
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
            if (i == 5 && j == 3) {
                Minecraft.addTree(box);
            }
            if (box.classList.contains('grass') || box.classList.contains('ground')) {
                box.addEventListener('click', Minecraft.clickBox);
            }
            newRow.append(box);
        }
        board.appendChild(newRow);
    }
    Minecraft.resources = {
        wood: 0,
        stone: 0,
        ground: 0,
        grass: 0
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
        if (eventBox.classList.contains('grass')) {
            eventBox.classList.remove('grass');
            Minecraft.updateResources('grass');
        } else if (eventBox.classList.contains('ground')) {
            eventBox.classList.remove('ground');
            Minecraft.updateResources('ground');
        }
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
    } else {
        isOpen = false;
    }

    return isOpen;
}

Minecraft.isRemoveable = function (box) {
   
    let boxRight = Minecraft.getRightBox(box);
    let boxLeft = Minecraft.getLeftBox(box);
    let boxTop = Minecraft.getTopBox(box);
    let boxBottom = Minecraft.getBottomBox(box);

    if (Minecraft.isOpenSpace(boxRight) || Minecraft.isOpenSpace(boxLeft) ||
        Minecraft.isOpenSpace(boxTop) || Minecraft.isOpenSpace(boxBottom)) {
        return true;
    } else {
        return false;
    }

}

Minecraft.getTopBox = function (currentBox) {
    let boxsList = document.getElementsByClassName('box');
    let boxRow = Minecraft.getRow(currentBox);
    let boxCol = Minecraft.getCol(currentBox);

    for (var i = 0; i < boxsList.length; i++) {
        let rowInBoxList = Minecraft.getRow(boxsList[i]);
        let colInBoxList = Minecraft.getCol(boxsList[i]);

        if ((rowInBoxList == boxRow - 1) && (colInBoxList == boxCol)) {
            return boxsList[i];
        }
    }
}
Minecraft.getBottomBox = function (currentBox) {
    let boxsList = document.getElementsByClassName('box');
    let boxRow = Minecraft.getRow(currentBox);
    let boxCol = Minecraft.getCol(currentBox);

    for (var i = 0; i < boxsList.length; i++) {
        let rowInBoxList = Minecraft.getRow(boxsList[i]);
        let colInBoxList = Minecraft.getCol(boxsList[i]);

        if ((rowInBoxList - 1 == boxRow) && (colInBoxList == boxCol)) {
            return boxsList[i];
        }
    }
}
Minecraft.getLeftBox = function (currentBox) {
    let boxsList = document.getElementsByClassName('box');
    let boxRow = Minecraft.getRow(currentBox);
    let boxCol = Minecraft.getCol(currentBox);

    for (var i = 0; i < boxsList.length; i++) {
        let rowInBoxList = Minecraft.getRow(boxsList[i]);
        let colInBoxList = Minecraft.getCol(boxsList[i]);

        if ((rowInBoxList == boxRow) && (colInBoxList == boxCol - 1)) {
            return boxsList[i];
        }
    }
}
Minecraft.getRightBox = function (currentBox) {
    let boxsList = document.getElementsByClassName('box');
    let boxRow = Minecraft.getRow(currentBox);
    let boxCol = Minecraft.getCol(currentBox);

    for (var i = 0; i < boxsList.length; i++) {
        let rowInBoxList = Minecraft.getRow(boxsList[i]);
        let colInBoxList = Minecraft.getCol(boxsList[i]);

        if ((rowInBoxList == boxRow) && (colInBoxList - 1 == boxCol)) {
            return boxsList[i];
        }
    }
}
Minecraft.createRow = function (rowId) {
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
    Minecraft.createResources();
}
Minecraft.createResources = function () {
    //stone, wood,
    Minecraft.grassResource = Minecraft.tools[0];
    Minecraft.grassResource.classList.add('grassResource');
    Minecraft.groundResource = Minecraft.tools[1];
    Minecraft.groundResource.classList.add('groundResource');
    Minecraft.woodResource = Minecraft.tools[6];
    Minecraft.woodResource.classList.add('woodResource');
    Minecraft.stoneResource = Minecraft.tools[7];
    Minecraft.stoneResource.classList.add('stoneResource');
    Minecraft.grassResource.innerText = Minecraft.resources.grass;
    Minecraft.groundResource.innerText = Minecraft.resources.ground;
    Minecraft.woodResource.innerText = Minecraft.resources.wood;
    Minecraft.stoneResource.innerText = Minecraft.resources.stone;

}

Minecraft.updateResources = function (type) {
    Minecraft.resources[type] += 1;
    let typeResource = type + 'Resource';
    Minecraft[typeResource].innerText = Minecraft.resources[type];
}
Minecraft.start = function () {
    Minecraft.createBoard();
    Minecraft.createToolBox();
}

Minecraft.setIntroScreen = function () {
    board.style.display = 'none';
    let showIntro = document.getElementById("tutorialButton");
    let hideButton = document.getElementById('closeTutorial');
    let tutorialWrapper = document.getElementById('tutorialWrapper');
    let newGameButton = document.getElementById('newGameButton');
    let introScreen = document.getElementById('intro')

    showIntro.addEventListener('click', function () {
        tutorialWrapper.style.display = 'flex';
    });
    hideButton.addEventListener('click', function () {
        tutorialWrapper.style.display = "none";
    })
    newGameButton.addEventListener('click', function () {
        introScreen.style.display = "none";
    })
    newGameButton.addEventListener('click', Minecraft.start)

}

Minecraft.addTree = function (startingBox) {
    let firstWood = startingBox;
    let secondWood = Minecraft.getTopBox(firstWood);
    let thirdWood = Minecraft.getTopBox(secondWood);
    let middleLeaf = Minecraft.getTopBox(thirdWood);
    let middleRightLeaf = Minecraft.getRightBox(middleLeaf);
    let middleLeftLeaf = Minecraft.getLeftBox(middleLeaf);
    let topLeaf = Minecraft.getTopBox(middleLeaf);

    firstWood.classList.add('wood');
    secondWood.classList.add('wood');
    thirdWood.classList.add('wood');
    middleLeaf.classList.add('leaves');
    middleRightLeaf.classList.add('leaves');
    middleLeftLeaf.classList.add('leaves');
    topLeaf.classList.add('leaves');
}

Minecraft.setIntroScreen();


