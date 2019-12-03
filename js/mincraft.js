let Minecraft = {};
let board = document.getElementById('gameContainer');
let toolbox = document.getElementById('toolBox');

Minecraft.createBoard = function () {
    board.innerHTML = "";
    board.style.display = 'block';
    toolBox.style.display = 'block';
    let backgroundClass;
    let numOfRows = 10;

    boxElem = document.querySelector('.box')
    //console.log(boxElem.css);
    let numOfCol = 20;
    let treeSpots = [3, 9, 10, 14, 18]
    let treeRoot = treeSpots[Math.floor(Math.random() * treeSpots.length)]
    let stoneSpots = [1, 5, 6, 7, 12, 13, 16]
    let firstStoneRoot = stoneSpots[Math.floor(Math.random() * stoneSpots.length)]
    let secondStoneRoot = stoneSpots[Math.floor(Math.random() * stoneSpots.length)]
    let thirdStoneRoot = stoneSpots[Math.floor(Math.random() * stoneSpots.length)]
    let cloudPlaceholder;
    let treasurePlaceholderRow = Math.floor(Math.random() * 3) + 7;
    let treasurePlaceholderCol = Math.floor(Math.random() * 20);
    let treasurePlaceholder;
    for (var i = 0; i < numOfRows; i++) {
        let newRow = document.createElement('div');
        newRow.className = 'rows';
        backgroundClass = Minecraft.getBoxProperty(i);
        for (var j = 0; j < numOfCol; j++) {
            let box = document.createElement('div');
            box.classList.add(backgroundClass);
            box.setAttribute('resource', backgroundClass);
            box.classList.add('box');
            box.setAttribute('row', i);
            box.setAttribute('col', j);
            box.addEventListener('click', Minecraft.clickBox)
            if (i == treasurePlaceholderRow && j == treasurePlaceholderCol) {
                treasurePlaceholder = box;
            }
            if (i == 1 && j == 4) {
                cloudPlaceholder = box;
            }
            if (i == 5 && j == treeRoot) {
                Minecraft.addTree(box);
            }
            if (i == 5 && j == firstStoneRoot) {
                Minecraft.addDoubleStone(box)
            }
            if (i == 5 && j == secondStoneRoot && firstStoneRoot != secondStoneRoot) {
                Minecraft.addDoubleStone(box)
            }
            if (i == 5 && j == thirdStoneRoot && thirdStoneRoot != firstStoneRoot && thirdStoneRoot != secondStoneRoot) {
                Minecraft.addSingleStone(box)
            }
            if (box.classList.contains('grass') || box.classList.contains('ground')) {
                box.addEventListener('click', Minecraft.clickBox);
            }
            newRow.append(box);
        }
        board.appendChild(newRow);
    }
    Minecraft.createCloud(cloudPlaceholder);
    Minecraft.addTreasure(treasurePlaceholder);
    Minecraft.resources = {
        wood: 0,
        stone: 0,
        ground: 0,
        grass: 0
    }
    Minecraft.tools = {
        axe: 'wood',
        shovel: ['ground', 'grass'],
        pickaxe: 'stone'
    }

}

Minecraft.getBoxProperty = function (rowNumber) {
    let boxClass;
    switch (rowNumber) {
        case 0: case 1: case 2: case 3: case 4: case 5:
            boxClass = 'sky';
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
    
    let resource = eventBox.getAttribute('resource');
    let tool = Minecraft.activeTool.getAttribute('tool')
    if (Minecraft.isRemoveable(eventBox)) {
        if (resource == 'grass' && tool == 'shovel') {
            eventBox.classList.remove('grass');
            Minecraft.addResource('grass');
            eventBox.setAttribute('resource', 'sky');
        } else if (resource == 'ground' && tool == 'shovel') {
            eventBox.classList.remove('ground');
            Minecraft.addResource('ground');
            eventBox.setAttribute('resource', 'sky');
        }
    }
    if (resource == 'wood' && tool == 'axe') {
        eventBox.classList.remove('wood');
        Minecraft.addResource('wood');
        eventBox.setAttribute('resource', 'sky');
    }
    if (resource == 'stone' && tool == 'pickaxe') {
        eventBox.classList.remove('stone');
        Minecraft.addResource('stone');
        eventBox.setAttribute('resource', 'sky');
    }
    if (Minecraft.isBuilding) {
        Minecraft.build(eventBox);
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
    if (box != "" && box != undefined) {

        if (box.classList.contains('grass')) {
            isOpen = false;
        } else if (box.classList.contains('ground')) {
            isOpen = false;
        } else if (box.classList.contains('stone')) {
            isOpen = false;
        } else if (box.classList.contains('wood')) {
            isOpen = false;
        }
    } else {
        isOpen = false;
    }

    return isOpen;
}

Minecraft.isRemoveable = function (box) {
    if (Minecraft.isBuilding) {
        return false;
    }
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
Minecraft.getResourcesAround = function (box) {
    let bottom, top, left, right;
    try { bottom = Minecraft.getBottomBox(box).getAttribute('resource') }
    catch{ bottom = "nothing" }
    try { top = Minecraft.getTopBox(box).getAttribute('resource') }
    catch{ top = "nothing" }
    try { left = Minecraft.getLeftBox(box).getAttribute('resource') }
    catch{ left = "nothing" }
    try { right = Minecraft.getRightBox(box).getAttribute('resource') }
    catch{ right = "nothing" }
    return {
        top: top,
        bottom: bottom,
        left: left,
        right: right,
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
    topToolBox.innerHTML = '';
    bottomToolBox = document.getElementById('bottom-toolBox');
    bottomToolBox.innerHTML = '';
    Minecraft.createRow(topToolBox);
    Minecraft.createRow(bottomToolBox);
    Minecraft.tools = document.getElementsByClassName('tool');
    Minecraft.createResources();
    Minecraft.createToolsinToolBox();
    Minecraft.createToHome();
    Minecraft.createReset();
    Minecraft.resetResources();
    Minecraft.home.classList.remove('tool');
    Minecraft.reset.classList.remove('tool');
}
Minecraft.createResources = function () {
    Minecraft.grassResource = Minecraft.tools[0];
    Minecraft.grassResource.classList.add('grassResource');
    Minecraft.grassResource.setAttribute('resource', 'grass');
    Minecraft.groundResource = Minecraft.tools[1];
    Minecraft.groundResource.classList.add('groundResource');
    Minecraft.groundResource.setAttribute('resource', 'ground');
    Minecraft.woodResource = Minecraft.tools[6];
    Minecraft.woodResource.classList.add('woodResource');
    Minecraft.woodResource.setAttribute('resource', 'wood');
    Minecraft.stoneResource = Minecraft.tools[7];
    Minecraft.stoneResource.classList.add('stoneResource');
    Minecraft.stoneResource.setAttribute('resource', 'stone');
    Minecraft.grassResource.innerText = Minecraft.resources.grass;
    Minecraft.groundResource.innerText = Minecraft.resources.ground;
    Minecraft.woodResource.innerText = Minecraft.resources.wood;
    Minecraft.stoneResource.innerText = Minecraft.resources.stone;

    Minecraft.tools[0].addEventListener('click', Minecraft.handleBuild)
    Minecraft.tools[1].addEventListener('click', Minecraft.handleBuild)
    Minecraft.tools[6].addEventListener('click', Minecraft.handleBuild)
    Minecraft.tools[7].addEventListener('click', Minecraft.handleBuild)

}

Minecraft.chooseTool = function (e) {
    Minecraft.isBuilding = false;
    Minecraft.activeTool.classList.remove('selectedTool')
    e.target.classList.add('selectedTool')
    Minecraft.activeTool = e.target

    let body = document.querySelector('body');
    body.className = "";
    if (e.target.classList.contains('axe')) {
        body.classList.add('axeCursor');

    } else if (e.target.classList.contains('pickaxe')) {
        body.classList.add('pickaxeCursor');
    } else if (e.target.classList.contains('shovel')) {
        body.classList.add('shovelCursor');
    } else {
        body.classList.add('hammerCursor');
    }
}

Minecraft.createToolsinToolBox = function () {
    Minecraft.axeTool = Minecraft.tools[3];
    Minecraft.axeTool.classList.add('axe');
    Minecraft.axeTool.setAttribute('tool', 'axe')
    Minecraft.axeTool.addEventListener('click', Minecraft.chooseTool)
    Minecraft.shovelTool = Minecraft.tools[4];
    Minecraft.shovelTool.classList.add('shovel', 'selectedTool');
    Minecraft.shovelTool.setAttribute('tool', 'shovel')
    Minecraft.shovelTool.addEventListener('click', Minecraft.chooseTool)
    Minecraft.pickaxeTool = Minecraft.tools[5];
    Minecraft.pickaxeTool.classList.add('pickaxe');
    Minecraft.pickaxeTool.setAttribute('tool', 'pickaxe')
    Minecraft.pickaxeTool.addEventListener('click', Minecraft.chooseTool)

    Minecraft.activeTool = Minecraft.shovelTool
}
Minecraft.createToHome = function () {
    Minecraft.home = Minecraft.tools[10];
    Minecraft.home.id = 'homeBtn';
    Minecraft.home.classList.add("homeResetBtn");
    Minecraft.home.innerText = "Home";
    Minecraft.home.addEventListener('click', Minecraft.setIntroScreen);
    
}
Minecraft.createReset = function () {
    Minecraft.reset = Minecraft.tools[11];
    Minecraft.reset.id = 'resetBtn';
    Minecraft.reset.innerText = "Reset";
    Minecraft.reset.classList.add("homeResetBtn");
    Minecraft.reset.innerText = "Reset";
    Minecraft.reset.addEventListener('click', Minecraft.start);
    
}
Minecraft.handleBuild = function (e) {
    Minecraft.chooseTool(e)
    Minecraft.currentResource = e.target.getAttribute('resource');
    Minecraft.isBuilding = true;
}
Minecraft.addResource = function (type) {
    Minecraft.resources[type] += 1;
    let typeResource = type + 'Resource';
    Minecraft[typeResource].innerText = Minecraft.resources[type];
}

Minecraft.resetResources = function () {
    Minecraft.grassResource.innerText = '0';
    Minecraft.stoneResource.innerText = '0';
    Minecraft.groundResource.innerText = '0';
    Minecraft.woodResource.innerText = '0';
}

Minecraft.removeResource = function (type) {
    if (Minecraft.resources[type] == 0) {
        Minecraft.isBuilding = false;
        return;
    }
    Minecraft.resources[type] -= 1;
    Minecraft.lastResource = type;
    let typeResource = type + 'Resource';
    Minecraft[typeResource].innerText = Minecraft.resources[type];
    Minecraft.chosenResource = true;
}
Minecraft.build = function (box) {
    let legal = false;
    if (box.getAttribute('resource') != 'sky') {
        return;
    } else if (Minecraft.resources[Minecraft.currentResource] == 0) {
        Minecraft.isBuilding = false;
        return;
    }
    let resources = Minecraft.getResourcesAround(box);
    switch (Minecraft.currentResource) {
        case 'grass': {
            if (resources.bottom == 'ground') {
                legal = true;
            }
        }
        case 'ground': {
            if (resources.bottom == 'ground' || resources.bottom == "nothing") {
                legal = true;
            }
        }
            break;
        case 'stone': {
            if (resources.bottom != 'wood') {
                legal = true;
            }
        }
            break;
        case 'wood': if (resources.bottom != 'stone') {
            legal = true;
        }
            break;
    }
    if (!legal) {
        return;
    }
    box.setAttribute('resource', Minecraft.currentResource)
    box.classList.add(Minecraft.currentResource);
    Minecraft.removeResource(Minecraft.currentResource);
    Minecraft.chosenResource = false;
}
Minecraft.start = function () {
    Minecraft.createBoard();
    Minecraft.createToolBox();
}

Minecraft.setIntroScreen = function () {
    board.style.display = 'none';
    toolbox.style.display = 'none';
    let showIntro = document.getElementById("tutorialButton");
    let hideButton = document.getElementById('closeTutorial');
    let tutorialWrapper = document.getElementById('tutorialWrapper');
    let newGameButton = document.getElementById('newGameButton');
    let introScreen = document.getElementById('intro');
    introScreen.style.display = 'flex';

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
    let topRightLeft = Minecraft.getRightBox(topLeaf);
    let topLeftLeft = Minecraft.getLeftBox(topLeaf);

    firstWood.classList.add('wood');
    firstWood.addEventListener('click', Minecraft.clickBox);
    firstWood.setAttribute('resource', 'wood');
    secondWood.classList.add('wood');
    secondWood.addEventListener('click', Minecraft.clickBox);
    secondWood.setAttribute('resource', 'wood');
    thirdWood.classList.add('wood');
    thirdWood.addEventListener('click', Minecraft.clickBox);
    thirdWood.setAttribute('resource', 'wood');
    middleLeaf.classList.add('leaves');
    middleRightLeaf.classList.add('leaves');
    middleLeftLeaf.classList.add('leaves');
    topLeaf.classList.add('leaves');
    topRightLeft.classList.add('leaves');
    topLeftLeft.classList.add('leaves');
}
Minecraft.createCloud = function (startingBox) {
    let middleCloud = startingBox;
    let leftCloud = Minecraft.getLeftBox(middleCloud);
    let rightCloud = Minecraft.getRightBox(middleCloud);
    let farRightCloud = Minecraft.getRightBox(rightCloud);
    let topCloud = Minecraft.getTopBox(middleCloud);
    let topRightCloud = Minecraft.getRightBox(topCloud);
    let bottomCloud = Minecraft.getBottomBox(middleCloud);
    let bottomRightCloud = Minecraft.getRightBox(bottomCloud);

    middleCloud.classList.add('cloud');
    leftCloud.classList.add('cloud');
    rightCloud.classList.add('cloud');
    farRightCloud.classList.add('cloud');
    topCloud.classList.add('cloud');
    topRightCloud.classList.add('cloud');
    bottomCloud.classList.add('cloud');
    bottomRightCloud.classList.add('cloud');

}

Minecraft.addDoubleStone = function (startingBox) {
    let firstStone = startingBox;
    let secondStone = Minecraft.getTopBox(startingBox);

    firstStone.classList.add('stone');
    firstStone.addEventListener('click', Minecraft.clickBox);
    firstStone.setAttribute('resource', 'stone');
    secondStone.classList.add('stone');
    secondStone.addEventListener('click', Minecraft.clickBox);
    secondStone.setAttribute('resource', 'stone');
}
Minecraft.addSingleStone = function (startingBox) {
    let firstStone = startingBox;

    firstStone.classList.add('stone');
    firstStone.setAttribute('resource', 'stone');
    firstStone.addEventListener('click', Minecraft.clickBox);
}

Minecraft.addTreasure = function (location) {
    location.classList.add('treasureBox');
}

Minecraft.setIntroScreen();


