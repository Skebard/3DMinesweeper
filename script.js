//Constants
const MAX_CUBE_SIZE = 150;
const MIN_CUBE_SIZE = 50;
const CUBE_FACES = ["front", "back", "right", "left", "top", "bottom"];
const SMALL_CUBE_SIZE = 50; //the size of the small cubes is defined in the class small-cube-face in the css
const MARGIN_SMALL_CUBE = 2.5;
const ROTATE_INTERVAL = 2;

//HTML elements
let mainBoard = document.querySelector(".main-board");
let scene = document.querySelector(".scene");
let mainCube = document.querySelector(".main-cube");
let mainCubeFace = document.querySelectorAll(".main-cube-face");
let arrowRight = document.getElementById("rotateRight");
let arrowTop = document.getElementById("rotateTop");
let arrowLeft = document.getElementById("rotateLeft");
let arrowBottom = document.getElementById("rotateBottom");

//game variables
let totalMines;
let openedCubes;
let totalCubes;

arrowRight.addEventListener("mousedown",()=>{
    eventRotate(rotateY,-1,arrowRight);
});
arrowTop.addEventListener("mousedown",()=>{
    eventRotate(rotateX,-1,arrowTop);
});
arrowLeft.addEventListener("mousedown",()=>{
    eventRotate(rotateY,1,arrowLeft);
});
arrowBottom.addEventListener("mousedown",()=>{
    eventRotate(rotateX,1,arrowBottom);
});

function eventRotate(rotateFunction,direction,element){
    let smooth = setInterval(function(){
        rotateFunction(mainCube,ROTATE_INTERVAL*direction);
    },25);
    element.addEventListener("mouseout",()=>{
        clearInterval(smooth);
    },{
        once:true
    });
    element.addEventListener("mouseup",()=>{
        clearInterval(smooth);
    },{
        once:true
    });
}



function openCube(event, board) {
    let [plane, row, col] = event.currentTarget.id.slice(-3).split("");
    let currentCube = board[plane][row][col];

    if (currentCube.mined === true) {
        currentCube.showMine();
        // display menu
        endGame(board);
        //end game
        //play again 
        //menu
    } else {
        openedCubes++;
        currentCube.showNeighbourNumber();
        currentCube.opened = true;
        revealNeighbours(board, currentCube);
        if(openedCubes === totalCubes-totalMines){
            console.log("YOU WIN!!");
            //display menu 
            //play again
            // menu
        }
        if (currentCube.neighbourMineCount === 0) {
            console.log("I AM SAFE");
        }
    }

    

}

// play with the same size
function playAgain(){

}

//remove event listeners and delete small cubes
function endGame(board) {
    board.forEach(plane => {
        plane.forEach(row => {
            row.forEach(cube => {
                console.log("remove");
                cube.removeCube();
            });
        });
    });
}



//  "matrix3d(0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -100, 1)"
/*** test */
document.querySelector(".to-right").addEventListener('click', rotateRight);
document.querySelector(".to-left").addEventListener('click', rotateLeft);
document.querySelector(".to-top").addEventListener('click', rotateTop);
document.querySelector(".to-bottom").addEventListener('click', rotateBottom);
let boxRotation = {
    axesY: 0,
    axesX: 0
}

function rotateRight() {
    boxRotation.axesY = (boxRotation.axesY - 90) % 360;
    console.log(" translateZ(-100px) rotateY(" + boxRotation.axesY + "deg)" + " rotateX(" + boxRotation.axesX + "deg)");
    mainCube.style.transform = " translateZ(-100px) rotateY(" + boxRotation.axesY + "deg)" + " rotateX(" + boxRotation.axesX + "deg)";
}

function rotateLeft() {
    boxRotation.axesY = (boxRotation.axesY + 90) % 360;
    console.log(" translateZ(-100px) rotateY(" + boxRotation.axesY + "deg)" + " rotateX(" + boxRotation.axesX + "deg)");
    mainCube.style.transform = " translateZ(-100px) rotateY(" + boxRotation.axesY + "deg)" + " rotateX(" + boxRotation.axesX + "deg)";
}

function rotateTop() {
    boxRotation.axesX = (boxRotation.axesX - 90) % 360;
    console.log(" translateZ(-100px) rotateX(" + boxRotation.axesX + "deg)" + " rotateY(" + boxRotation.axesY + "deg)");
    mainCube.style.transform = " translateZ(-100px) rotateX(" + boxRotation.axesX + "deg)" + " rotateY(" + boxRotation.axesY + "deg)";
}

function rotateBottom() {
    boxRotation.axesX = (boxRotation.axesX + 90) % 360;
    console.log(" translateZ(-100px) rotateX(" + boxRotation.axesX + "deg)" + " rotateY(" + boxRotation.axesY + "deg)");
    mainCube.style.transform = " translateZ(-100px) rotateX(" + boxRotation.axesX + "deg)" + " rotateY(" + boxRotation.axesY + "deg)";
}








//create a cube board
// size(mandatory): size of cube
function createBoard(size, mines) {
    let cubeSize = SMALL_CUBE_SIZE + MARGIN_SMALL_CUBE;
    let totalDepth = size;
    defineMainCubeSize(size, cubeSize);
    //create empty array that represent the board
    let board = [];
    for (let z = 0; z < size; z++) {
        board.push([]); // add plane
        for (let y = 0; y < size; y++) {
            board[z].push([]); //add row
            for (let x = 0; x < size; x++) {
                board[z][y].push(new Cube(y, x, z, cubeSize, totalDepth));
            }
        }
    }
    insertMines(board, mines);
    assignNeighbourMineCount(board);

    totalMines = mines;
    totalCubes = size*size*size;
    openedCubes = 0;

    let smallCubes = document.querySelectorAll(".mini-cube");
    smallCubes.forEach(cube => {
        cube.addEventListener("click", (event) => {
            openCube(event, board);
        });
    });



    console.log(board);
    return board;

}


//creates one cube object and positionates it
function Cube(row, col, depth, cubeSize, totalDepth) {
    let smallCube = document.createElement("div");
    let idCube = "small-cube" + depth + "" + row + "" + col;
    smallCube.classList.add("mini-cube"); // class mini-cube is defined in the css and contains the real size of the cube
    smallCube.id = idCube;
    smallCube.style.transform += "translateX(" + col * cubeSize + "px)";
    smallCube.style.transform += "translateY(" + row * cubeSize + "px)";
    //smallCube.style.transform += "translateZ("+ (-totalDepth/2)+(cubeSize/2)+depth*cubeSize+"px)";
    let moveZ = (-totalDepth * cubeSize / 2) + (cubeSize / 2) + cubeSize * depth;
    console.log(moveZ);
    smallCube.style.transform += "translateZ(" + moveZ + "px)";


    CUBE_FACES.forEach((face) => {
        let newFace = document.createElement("div");
        newFace.className = ("small-cube-face " + "small-cube-face--" + face);
        smallCube.insertAdjacentElement("beforeend", newFace);
    });
    let myNumber = document.createElement("div");
    myNumber.className = ("small-cube-face " + "small-cube-face--center");
    smallCube.insertAdjacentElement("beforeend", myNumber);
    mainCube.insertAdjacentElement("beforeend", smallCube);
    let addedSmallCube = document.getElementById(idCube);
    this.row = row;
    this.col = col;
    this.depth = depth;
    this.mined = false;
    this.neighbourMineCount = 0;
    this.index = undefined;
    this.opened = false;
    this.showCube = function () {
        addedSmallCube.classList.remove("hide");
    }
    this.hideCube = function () {
        addedSmallCube.classList.add("hide");
    }
    this.showMine = function () {
        smallCube.classList.add("mine");
    }
    this.showId = function () {
        console.log(idCube);
    }
    this.showNeighbourNumber = function () {
        if (this.neighbourMineCount > 0) { // if ther are no bombs around do not display any number
            let myNumber = document.createElement("div");
            myNumber.textContent = this.neighbourMineCount;
            myNumber.className = ("small-cube-face " + "small-cube-face--center");
            addedSmallCube.insertAdjacentElement("beforeend", myNumber);
        }

        for (let i = 0; i < CUBE_FACES.length; i++) {
            addedSmallCube.children[i].style.display = "none";
        }

    }
    this.removeCube = function () {
        addedSmallCube.removeEventListener("click", openCube);
        addedSmallCube.remove();
    }
}

//by default squared
function defineMainCubeSize(size, cS) {
    let rows = size;
    let columns = size;
    let depth = size;
    //defineCubeSizes
    let cubeSize = (cS != undefined) ? cS : 55;
    //scene
    scene.style.width = columns * cubeSize + "px";
    scene.style.height = rows * cubeSize + "px";
    //scene.style.perspective = rows*2*cubeSize+"px";

    // put the front face at z=0;
    mainCube.style.transform = "translateZ(-" + (depth * cubeSize) / 2 + "px)";

    //main box faces
    mainCubeFace.forEach(face => {
        face.style.width = columns * cubeSize + "px";
        face.style.height = rows * cubeSize + "px";
        face.style.lineHeight = rows * cubeSize + "px";
        if (face.classList.contains("main-cube-face--front")) {
            face.style.transform = "rotateY(  0deg) translateZ(" + depth * cubeSize / 2 + "px)";
        } else if (face.classList.contains("main-cube-face--right")) {
            face.style.transform = "rotateY(  90deg) translateZ(" + columns * cubeSize / 2 + "px)";
        } else if (face.classList.contains("main-cube-face--back")) {
            face.style.transform = "rotateY(  180deg) translateZ(" + depth * cubeSize / 2 + "px)";
        } else if (face.classList.contains("main-cube-face--left")) {
            face.style.transform = "rotateY(  -90deg) translateZ(" + columns * cubeSize / 2 + "px)";
        } else if (face.classList.contains("main-cube-face--top")) {
            face.style.transform = "rotateX(  90deg) translateZ(" + rows * cubeSize / 2 + "px)";
        } else if (face.classList.contains("main-cube-face--bottom")) {
            face.style.transform = "rotateX(  -90deg) translateZ(" + rows * cubeSize / 2 + "px)";
        }
    });

}





// insert mines in the board
// board(mandatory): 3D square matrix with cube objects
function insertMines(board, mines) {
    let insertedMines = 0;
    let boardSize = board.length;
    let randomPos;
    //get random position
    while (insertedMines < mines) {
        //insert miine
        //get random position
        randomPos = [getRandom(0, boardSize), getRandom(0, boardSize), getRandom(0, boardSize)];
        if (board[randomPos[0]][randomPos[1]][randomPos[2]].mined === false) {
            board[randomPos[0]][randomPos[1]][randomPos[2]].mined = true;
            insertedMines++;
        }
    }

}

function getRandom(min, max) {
    return Math.floor((Math.random() * (max - min))) + min;

}








function rotateY(obj, degrees) {
    let [cosine, sine] = calculateCosSin(degrees);
    let rotationMatrix = [
        [cosine, 0, sine, 0],
        [0, 1, 0, 0],
        [-sine, 0, cosine, 0],
        [0, 0, 0, 1]
    ];
    let currentMatrix = getCurrentMatrix3D(obj);
    let rotatedMatrix = multiplyMatrices(currentMatrix, rotationMatrix);
    rotatedMatrix[3] = currentMatrix[3]; // to avoid changing the position(translation)
    obj.style.transform = "matrix3d(" + rotatedMatrix.join() + ")";
    // make sure that the transition is finished before next rotation;


    return rotatedMatrix;
}






function rotateX(obj, degrees) {
    let [cosine, sine] = calculateCosSin(degrees);
    let rotationMatrix = [
        [1, 0, 0, 0],
        [0, cosine, -sine, 0],
        [0, sine, cosine, 0],
        [0, 0, 0, 1]
    ];
    let currentMatrix = getCurrentMatrix3D(obj);
    let rotatedMatrix = multiplyMatrices(currentMatrix, rotationMatrix);
    rotatedMatrix[3] = currentMatrix[3]; // to avoid changing the position(translation)
    obj.style.transform = "matrix3d(" + rotatedMatrix.join() + ")";

    // make sure that the transition is finished before next rotation;


    return rotatedMatrix;
}



function calculateCosSin(degrees) {
    let angleRad = (degrees * Math.PI * 2) / 360;
    let cosine = parseFloat(Math.cos(angleRad));
    let sine = parseFloat(Math.sin(angleRad));
    return [cosine, sine];

}



function rotateZ(obj, degrees) {
    let [cosine, sine] = calculateCosSin(degrees);
    let rotationMatrix = [
        [cosine, -sine, 0, 0],
        [sine, cosine, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    let currentMatrix = getCurrentMatrix3D(obj);
    let rotatedMatrix = multiplyMatrices(currentMatrix, rotationMatrix);
    rotatedMatrix[3] = currentMatrix[3]; // to avoid changing the position(translation)
    obj.style.transform = "matrix3d(" + rotatedMatrix.join() + ")";

    // make sure that the transition is finished before next rotation;


    return rotatedMatrix;
}




//Returns the homogeneous matrix 4X4 of the entered 3D object
// obj (mandatory): elementHTML
function getCurrentMatrix3D(obj) {
    let matrixString = window.getComputedStyle(obj).transform;
    let matrixFloat = [
        [],
        [],
        [],
        []
    ];
    matrixString = matrixString.slice(9, -1);
    let nextComa = matrixString.indexOf(",");

    for (let m = 0; m < 4; m++) {
        for (let n = 0; n < 4; n++) {
            if (matrixString.indexOf(",") !== -1) {
                matrixFloat[m][n] = parseFloat(matrixString.slice(0, nextComa));
            } else {
                matrixFloat[m][n] = parseFloat(matrixString.slice(0));
            }
            matrixString = matrixString.slice(nextComa + 2); //delete read number
            nextComa = matrixString.indexOf(",");
        }
    }
    return matrixFloat;

}


//Returns the multiplication of two matrices
// both matrices must be passed as arrays where each element is an array that represent a row of the matrix
// the returned matrix will be in the same format
function multiplyMatrices(matrixA, matrixB) {
    if (matrixA[0].length !== matrixB.length) {
        console.log("Matrices can not be multiplied due to size incompatibility");
        return false;
    }

    let rows = matrixA.length;
    let columns = matrixB[0].length;
    let result = new Array(rows).fill(0).map(el => new Array(columns).fill(0));
    return result.map((row, index) => {
        return row.map((el, index1) => {
            let a = 0;
            matrixA[index].forEach((value, index2) => {
                a += value * matrixB[index2][index1];
            });
            return a;
        });
    });
}



function assignNeighbourMineCount(board) {
    let neighbours = [];

    board.forEach((plane) => {
        plane.forEach((row) => {
            row.forEach((element) => {
                if (element.mined === false) {
                    neighbours = getNeighbours(element, board);
                    neighbours.forEach(el => {
                        if (el !== undefined) {
                            for (let key in el) {
                                if ((el[key] !== null) && (el[key].mined === true)) {
                                    element.neighbourMineCount++;
                                    if (element.neighbourMineCount > 1) {
                                        console.log("bomb around!")
                                        element.showId();
                                        el[key].showId();
                                    }

                                }
                            }

                        }

                    });


                } else {
                    console.log("I AM A BOMB!!!")
                    element.showId();
                }
            });
        });
    });

}



function revealNeighbours(board, currentCube) {
    if (currentCube.neighbourMineCount === 0 &&
        currentCube.mined === false
    ) {
        let neighbours = getNeighbours(currentCube, board);
        neighbours.forEach(plane => {
            if (plane !== undefined) {
                for (let key in plane) {
                    if ((plane[key] !== null)) {
                        if (plane[key].mined === false && plane[key].opened === false) {
                            plane[key].opened = true;
                            plane[key].showNeighbourNumber();
                            openedCubes++;
                            revealNeighbours(board, plane[key]);
                        }

                    }
                }

            }

        });


    }
}

//Returns an array where each element is an object that contains the neighbours of one of the surrounding planes
//if such plane does not exist, then returns undefined for that position
function getNeighbours(element, board) {

    let currentPlane, planeBack, planeFront;
    let neighbours = [];
    let indexPlane = element.depth;
    let indexRow = element.row;
    let indexCol = element.col;
    let plane = board[indexPlane];

    currentPlane = surroundings(plane, indexRow, indexCol);
    if (board[indexPlane - 1] !== undefined) {
        planeBack = surroundings(board[indexPlane - 1], indexRow, indexCol);
        planeBack["center"] = board[indexPlane - 1][indexRow][indexCol];
    } else {
        planeBack = undefined;
    }
    if (board[indexPlane + 1] !== undefined) {
        planeFront = surroundings(board[indexPlane + 1], indexRow, indexCol);
        planeFront["center"] = board[indexPlane + 1][indexRow][indexCol];
    } else {
        planeFront = undefined;
    }
    neighbours[0] = currentPlane;
    neighbours[1] = planeBack;
    neighbours[2] = planeFront;

    return neighbours;

}


// returns the surrounding elements  of a bidimensional matrix
function surroundings(matrix, y, x) {
    // Directions are clockwise
    return {
        up: getCell(matrix, y - 1, x),
        upRight: getCell(matrix, y - 1, x + 1),
        right: getCell(matrix, y, x + 1),
        downRight: getCell(matrix, y + 1, x + 1),
        down: getCell(matrix, y + 1, x),
        downLeft: getCell(matrix, y + 1, x - 1),
        left: getCell(matrix, y, x - 1),
        upLeft: getCell(matrix, y - 1, x - 1)
    };
}

function getCell(matrix, y, x) {
    var NO_VALUE = null;
    var value, hasValue;

    try {
        hasValue = matrix[y][x] !== undefined;
        value = hasValue ? matrix[y][x] : NO_VALUE;
    } catch (e) {
        value = NO_VALUE;
    }
    return value;
}