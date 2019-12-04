let Minecraft = {};
let board = document.getElementById('gameContainer');
let toolbox = document.getElementById('toolBox');
Minecraft.isHD = false;

Minecraft.createBoard = function() {
    board.innerHTML = "";
    board.style.display = 'block';
    toolBox.style.display = 'block';
    let backgroundClass;
    let numOfRows = 10;

    boxElem = document.querySelector('.box')
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
        wood: 5,
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

Minecraft.getBoxProperty = function(rowNumber) {
    let boxClass;
    switch (rowNumber) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            if (Minecraft.isHD) {
                boxClass = 'skyHD';
                break;
            } else {
                boxClass = 'sky';
                break;
            }
        case 6:
            if (Minecraft.isHD) {
                boxClass = 'grassHD';
                break;
            } else {
                boxClass = 'grass';
                break;
            }
        case 7:
        case 8:
        case 9:
            if (Minecraft.isHD) {
                boxClass = 'groundHD';
                break;
            } else {
                boxClass = 'ground';
                break;
            }
    }
    return boxClass;
}

Minecraft.removeClass = function(box, classname) {
    if (Minecraft.isHD) {
        box.classList.remove(`${classname}HD`)
    } else {
        box.classList.remove(`${classname}`)
    }
}



Minecraft.clickBox = function(e) {
    let eventBox = e.target;
    let resource = eventBox.getAttribute('resource');
    let tool = Minecraft.activeTool.getAttribute('tool')
    if (Minecraft.isRemoveable(eventBox)) {
        if ((resource == 'grass' || resource == 'grassHD') && tool == 'shovel') {
            Minecraft.removeClass(eventBox, 'grass');
            Minecraft.addResource('grass');
            eventBox.setAttribute('resource', 'sky');
        } else if ((resource == 'ground' || resource == 'groundHD') && tool == 'shovel') {
            Minecraft.removeClass(eventBox, 'ground');
            Minecraft.addResource('ground');
            eventBox.setAttribute('resource', 'sky');
        }
    }
    if ((resource == 'wood' || resource == 'woodHD') && tool == 'axe') {
        Minecraft.removeClass(eventBox, 'wood');
        Minecraft.addResource('wood');
        eventBox.setAttribute('resource', 'sky');
    }
    if ((resource == 'stone' || resource == 'stoneHD') && tool == 'pickaxe') {
        Minecraft.removeClass(eventBox, 'stone');
        Minecraft.addResource('stone');
        eventBox.setAttribute('resource', 'sky');
    }
    if (Minecraft.isBuilding) {
        Minecraft.build(eventBox);
    }
}


Minecraft.getRow = function(box) {
    return box.getAttribute('row');
}

Minecraft.getCol = function(box) {
    return box.getAttribute('col');
}

Minecraft.isOpenSpace = function(box) {
    let isOpen = true;
    if (box != "" && box != undefined) {

        if (box.classList.contains('grass') || box.classList.contains('grassHD')) {
            isOpen = false;
        } else if (box.classList.contains('ground') || box.classList.contains('groundHD')) {
            isOpen = false;
        } else if (box.classList.contains('stone') || box.classList.contains('stoneHD')) {
            isOpen = false;
        } else if (box.classList.contains('wood') || box.classList.contains('woodHD')) {
            isOpen = false;
        }
    } else {
        isOpen = false;
    }

    return isOpen;
}

Minecraft.isRemoveable = function(box) {
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

Minecraft.getTopBox = function(currentBox) {
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
Minecraft.getResourcesAround = function(box) {
    let bottom, top, left, right;
    try { bottom = Minecraft.getBottomBox(box).getAttribute('resource') } catch { bottom = "nothing" }
    try { top = Minecraft.getTopBox(box).getAttribute('resource') } catch { top = "nothing" }
    try { left = Minecraft.getLeftBox(box).getAttribute('resource') } catch { left = "nothing" }
    try { right = Minecraft.getRightBox(box).getAttribute('resource') } catch { right = "nothing" }
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
    Minecraft.createThemeChange();
    Minecraft.resetResources();
    Minecraft.home.classList.remove('tool');
    Minecraft.reset.classList.remove('tool');
}
Minecraft.createResources = function () {
    Minecraft.grassResource = Minecraft.tools[0];
    Minecraft.addClass(Minecraft.grassResource, 'grassResource');
    Minecraft.grassResource.setAttribute('resource', 'grass');
    Minecraft.grassResource.setAttribute('title', 'grass');
    Minecraft.groundResource = Minecraft.tools[1];
    Minecraft.addClass(Minecraft.groundResource, 'groundResource');
    Minecraft.groundResource.setAttribute('resource', 'ground');
    Minecraft.groundResource.setAttribute('title', 'ground');
    Minecraft.woodResource = Minecraft.tools[6];
    Minecraft.addClass(Minecraft.woodResource, 'woodResource');
    Minecraft.woodResource.setAttribute('resource', 'wood');
    Minecraft.woodResource.setAttribute('title', 'wood');
    Minecraft.stoneResource = Minecraft.tools[7];
    Minecraft.addClass(Minecraft.stoneResource, 'stoneResource');
    Minecraft.stoneResource.setAttribute('resource', 'stone');
    Minecraft.stoneResource.setAttribute('title', 'stone');
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
    if (e.target.classList.contains('axe') || e.target.classList.contains('axeHD')) {
        Minecraft.addClass(body, 'axeCursor');
    } else if (e.target.classList.contains('pickaxe') || e.target.classList.contains('pickaxeHD')) {
        Minecraft.addClass(body, 'pickaxeCursor');
    } else if (e.target.classList.contains('shovel') || e.target.classList.contains('shovelHD')) {
        Minecraft.addClass(body, 'shovelCursor');
    } else {
        Minecraft.addClass(body, 'hammerCursor');
    }
}

Minecraft.createToolsinToolBox = function () {
    Minecraft.axeTool = Minecraft.tools[3];
    Minecraft.addClass(Minecraft.axeTool, 'axe');
    Minecraft.axeTool.setAttribute('tool', 'axe')
    Minecraft.axeTool.setAttribute('title', 'axe')
    Minecraft.axeTool.addEventListener('click', Minecraft.chooseTool)
    Minecraft.shovelTool = Minecraft.tools[4];
    Minecraft.addClass(Minecraft.shovelTool, 'shovel');
    Minecraft.shovelTool.classList.add('selectedTool');
    Minecraft.shovelTool.setAttribute('tool', 'shovel')
    Minecraft.shovelTool.setAttribute('title', 'shovel')
    Minecraft.shovelTool.addEventListener('click', Minecraft.chooseTool)
    Minecraft.pickaxeTool = Minecraft.tools[5];
    Minecraft.addClass(Minecraft.pickaxeTool, 'pickaxe');
    Minecraft.pickaxeTool.setAttribute('tool', 'pickaxe')
    Minecraft.pickaxeTool.setAttribute('title', 'pickaxe')
    Minecraft.pickaxeTool.addEventListener('click', Minecraft.chooseTool)

    Minecraft.activeTool = Minecraft.shovelTool
}
Minecraft.createToHome = function () {
    Minecraft.home = Minecraft.tools[9];
    Minecraft.home.id = 'homeBtn';
    Minecraft.home.classList.add("homeResetBtn");
    Minecraft.home.innerText = "Home";
    Minecraft.home.addEventListener('click', Minecraft.setIntroScreen);

}
Minecraft.createReset = function () {
    Minecraft.reset = Minecraft.tools[10];
    Minecraft.reset.id = 'resetBtn';
    Minecraft.reset.innerText = "Reset";
    Minecraft.reset.classList.add("homeResetBtn");
    Minecraft.reset.addEventListener('click', Minecraft.start);

}

Minecraft.createThemeChange = function () {
    Minecraft.changeThemeBtn = Minecraft.tools[11];
    Minecraft.changeThemeBtn.id = 'changeThemeBtn';
    Minecraft.changeThemeBtn.innerText = "Theme";
    Minecraft.changeThemeBtn.classList.add('homeResetBtn');
    Minecraft.changeThemeBtn.addEventListener('click', Minecraft.changeTheme)
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
    Minecraft.woodResource.innerText = '5';
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
        case 'grass': case 'grassHD': {
            if ((resources.bottom == 'ground') || (resources.bottom == 'groundHD')) {
                legal = true;
            }
        }
        case 'ground': case 'groundHD': {
            if ((resources.bottom == 'ground') || (resources.bottom == "nothing") || (resources.bottom == 'groundHD')) {
                legal = true;
            }
        }
            break;
        case 'stone': case 'stoneHD': {
            if (resources.bottom == 'stone' || resources.bottom == 'ground' || resources.bottom == 'grass' || resources.bottom == 'stoneHD' || resources.bottom == 'groundHD' || resources.bottom == 'grassHD' || resources.bottom == 'nothing') {
                legal = true;
            }
        }
            break;
        case 'wood': case 'woodHD':
            if (resources.bottom == 'wood' || resources.bottom == 'ground' || resources.bottom == 'grass' || resources.bottom == 'nothing' || resources.bottom == 'woodHD' || resources.bottom == 'groundHD' || resources.bottom == 'grassHD' || resources.bottom == 'stone' || resources.bottom == 'stoneHD') {
                legal = true;
            }
            break;
    }
    if (!legal) {
        return;
    }
    box.setAttribute('resource', Minecraft.currentResource)
    Minecraft.addClass(box,Minecraft.currentResource)
    Minecraft.removeResource(Minecraft.currentResource);
    Minecraft.chosenResource = false;
}
Minecraft.start = function () {
    let body = document.querySelector('body');
    body.className = '';
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

Minecraft.addClass = function (box, classname) {
    if (Minecraft.isHD) {
        box.classList.add(`${classname}HD`)
    } else {
        box.classList.add(`${classname}`)
    }
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

    Minecraft.addClass(firstWood, 'wood');
    firstWood.addEventListener('click', Minecraft.clickBox);
    firstWood.setAttribute('resource', 'wood');
    Minecraft.addClass(secondWood, 'wood');
    secondWood.addEventListener('click', Minecraft.clickBox);
    secondWood.setAttribute('resource', 'wood');
    Minecraft.addClass(thirdWood, 'wood');
    thirdWood.addEventListener('click', Minecraft.clickBox);
    thirdWood.setAttribute('resource', 'wood');
    Minecraft.addClass(middleLeaf, 'leaves');
    Minecraft.addClass(middleRightLeaf, 'leaves');
    Minecraft.addClass(middleLeftLeaf, 'leaves');
    Minecraft.addClass(topLeaf, 'leaves');
    Minecraft.addClass(topRightLeft, 'leaves');
    Minecraft.addClass(topLeftLeft, 'leaves');
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


    Minecraft.addClass(middleCloud, 'cloud');
    Minecraft.addClass(leftCloud, 'cloud');
    Minecraft.addClass(rightCloud, 'cloud');
    Minecraft.addClass(farRightCloud, 'cloud');
    Minecraft.addClass(topCloud, 'cloud');
    Minecraft.addClass(topRightCloud, 'cloud');
    Minecraft.addClass(bottomCloud, 'cloud');
    Minecraft.addClass(bottomRightCloud, 'cloud');
}

Minecraft.addDoubleStone = function (startingBox) {
    let firstStone = startingBox;
    let secondStone = Minecraft.getTopBox(startingBox);

    Minecraft.addClass(firstStone, 'stone');
    firstStone.addEventListener('click', Minecraft.clickBox);
    firstStone.setAttribute('resource', 'stone');
    Minecraft.addClass(secondStone, 'stone');
    secondStone.addEventListener('click', Minecraft.clickBox);
    secondStone.setAttribute('resource', 'stone');
}
Minecraft.addSingleStone = function (startingBox) {
    let firstStone = startingBox;

    Minecraft.addClass(firstStone, 'stone');
    firstStone.setAttribute('resource', 'stone');
    firstStone.addEventListener('click', Minecraft.clickBox);
}

Minecraft.addTreasure = function (location) {
    location.classList.add('treasureBox');
}

Minecraft.changeTheme = function () {
    if (Minecraft.isHD) {
        document.querySelector('body').style.cursor = "url(./img/shovel.cur),auto";
        Minecraft.isHD = false;
    } else {
        Minecraft.isHD = true;
        document.querySelector('body').style.cursor = "url(./img/shovelHD.cur),auto";
    }
    Minecraft.start();
}

Minecraft.setIntroScreen();


