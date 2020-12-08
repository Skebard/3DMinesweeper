//Constants
const MAX_CUBE_SIZE = 150;
const MIN_CUBE_SIZE = 50;
const CUBE_FACES = ["front", "back", "right", "left", "top", "bottom"];
const SMALL_CUBE_SIZE = 50; //the size of the small cubes is defined in the class small-cube-face in the css
const MARGIN_SMALL_CUBE = 2.5;
const ROTATE_INTERVAL = 2;
const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHECK_ICON = '<i class="far fa-check-circle my-check label-icon"></i>';
const CROSS_ICON = '<i class="far fa-times-circle my-cross label-icon"></i>';
const CSS_COLOR_NAMES= ["chartreuse","chocolate","darkgoldenrod","darkturquoise","red"];
//rebeccapurple nice color

//HTML elements
let mainBoard = document.querySelector(".main-board");
let scene = document.querySelector(".scene");
let mainCube = document.querySelector(".main-cube");
let mainCubeFace = document.querySelectorAll(".main-cube-face");
let arrowRight = document.getElementById("rotateRight");
let arrowTop = document.getElementById("rotateTop");
let arrowLeft = document.getElementById("rotateLeft");
let arrowBottom = document.getElementById("rotateBottom");
let registerForm = document.getElementById("registration-form");
let logInForm = document.getElementById("log-in-form");
let guestForm = document.getElementById("guest-form");
let selectRegister = document.getElementById("select-register");
let selectLogIn = document.getElementById("select-log-in");
let selectGuest = document.getElementById("select-guest");
let btnRegister = document.getElementById("btn-register");
let btnLogIn = document.getElementById("btn-logIn");
let btnGuest = document.getElementById("btn-guest");
let menuCube = document.querySelector(".main-menu-cube");
let btnModeNormal = document.getElementById("mode-normal");
let btnModeHard = document.getElementById("mode-hard");
let btnModeCustom = document.getElementById("mode-custom");
let selectSize = document.getElementById("board-size");
let selectMines = document.getElementById("total-mines");
let blockSelectSizeMines = document.querySelector(".game-settings .cover-siblings");
let btnStartGame = document.getElementById("btn-start-game");
let gameScreen = document.getElementById("game-screen");
let mainMenuScreen = document.getElementById("main-menu-screen");
let btnPlayAgain = document.getElementById("btn-play-again");
let btnNewGame = document.getElementById("btn-new-game");
let menuEnd = document.getElementById("menu-end");
let darkBackground = document.getElementById("dark-background-id");
let logInHeader = document.getElementById("user-profile");
let usernameHeader = document.getElementById("username-header");
let logInIcon = document.getElementById("log-in-icon");
let logOutIcon = document.getElementById("log-out-icon");
let rankingDisplay = document.querySelector("section.my-ranking");
let youWonMsg = document.getElementById("end-winning");
let youLostMsg = document.getElementById("end-losing");

//game variables
let totalMines;
let openedCubes;
let totalCubes;
let currentBoard;


//Users
let users = [];
let currentUser;

introMainCube();


setTimeout(() => {
    rankingDisplay.style.right = -rankingDisplay.offsetWidth + "px";
}, 200);
rankingDisplay.addEventListener("mouseover", rankingOver);
rankingDisplay.addEventListener("mouseout", rankingOut);
rankingDisplay.addEventListener("click", showRanking);

//todo set elements position



//todo DEFAULT USERS

users.push(new User(false, "Antonio", "1234asdfA", false));


//todo EVENT LISTENERS

//Start game
btnStartGame.addEventListener("click", startGame);


//Finishing game
btnPlayAgain.addEventListener("click", playAgain);
btnNewGame.addEventListener("click", newGame);

//log out 
logOutIcon.addEventListener("click", logOut);


// Forms management
selectRegister.addEventListener("click", () => {
    addClassToElement(selectRegister, "selected");
    removeClassElement(selectLogIn, "selected");
    removeClassElement(selectGuest, "selected");
    removeClassElement(registerForm, "hide");
    addClassToElement(logInForm, "hide");
    addClassToElement(guestForm, "hide");
});
selectLogIn.addEventListener("click", displayLogIn);
logInHeader.addEventListener("click", () => {
    displayLogIn();

    if (gameScreen.classList.contains("hide")) {
        menuCube.style.transform = "translateZ(-225px) rotateY(0)";
        users.pop();
    } else if (menuEnd.classList.contains("hide") === false) {
        if (currentUser.matches.lengh === 0) {
            users.pop()
        }

        showMainMenu();
    }


});
selectGuest.addEventListener("click", () => {
    removeClassElement(selectRegister, "selected");
    removeClassElement(selectLogIn, "selected");
    addClassToElement(selectGuest, "selected");
    removeClassElement(guestForm, "hide");
    addClassToElement(registerForm, "hide");
    addClassToElement(logInForm, "hide");
});

// Choosing game mode
btnModeNormal.addEventListener("click", () => {
    addClassToElement(btnModeNormal, "selected-mode");
    removeClassElement(btnModeHard, "selected-mode");
    removeClassElement(btnModeCustom, "selected-mode");
    selectSize.value = 5;
    selectMines.value = 10;
    removeClassElement(blockSelectSizeMines, "hide");
});
btnModeHard.addEventListener("click", () => {
    addClassToElement(btnModeHard, "selected-mode");
    removeClassElement(btnModeNormal, "selected-mode");
    removeClassElement(btnModeCustom, "selected-mode");
    selectSize.value = 8;
    selectMines.value = 25;
    removeClassElement(blockSelectSizeMines, "hide");
});
btnModeCustom.addEventListener("click", () => {
    addClassToElement(btnModeCustom, "selected-mode");
    removeClassElement(btnModeHard, "selected-mode");
    removeClassElement(btnModeNormal, "selected-mode");
    addClassToElement(blockSelectSizeMines, "hide");
});

// User menu
btnRegister.addEventListener("click", () => {
    let currentForm = document.querySelector("#registration-form > form");
    currentUser = checkFormInputs(currentForm);
});
btnLogIn.addEventListener("click", () => {
    let currentForm = document.querySelector("#log-in-form > form");
    currentUser = checkFormInputs(currentForm);
});
btnGuest.addEventListener("click", () => {
    currentUser = newGuest();
});


//Rotate cube
arrowRight.addEventListener("mousedown", (event) => {
    eventRotate(rotateY, -1, arrowRight,event);
});
arrowTop.addEventListener("mousedown", (event) => {
    eventRotate(rotateX, -1, arrowTop,event);
});
arrowLeft.addEventListener("mousedown", (event) => {
    eventRotate(rotateY, 1, arrowLeft,event);
});
arrowBottom.addEventListener("mousedown", (event) => {
    eventRotate(rotateX, 1, arrowBottom,event);
});


function introMainCube(durationSec, spins) {
    let fullSpins=1;
    let faceSize = 450;
    let interval;
    translateXYZ(menuCube,0,0,-faceSize*4*fullSpins);
    let positionZ = 0;
    
    let myTransition = setInterval(function () {
        translateXYZ(menuCube, 0, 0, faceSize / 30);
        rotateX(menuCube, 3);
        positionZ+=faceSize/30;
     
        if(positionZ===faceSize*4*fullSpins){
            clearInterval(myTransition);
            menuCube.style.transition = "all 1.5s"
        }

    }, 7); // 30 cicles per face 300ms/face 1200ms/spin


}









function rankingOver() {
    rankingDisplay.style.right = -rankingDisplay.offsetWidth + "px";
}

function rankingOut() {
    rankingDisplay.style.right = -rankingDisplay.offsetWidth + "px";
}

function showRanking() {
    darkBackground.classList.remove("hide");
    rankingDisplay.style.right = "0px";
    rankingDisplay.removeEventListener("mouseover", rankingOver);
    rankingDisplay.removeEventListener("mouseout", rankingOut);
    rankingDisplay.removeEventListener("click", showRanking);
    rankingDisplay.addEventListener("click", function hideRanking() {
        rankingDisplay.style.right = -rankingDisplay.offsetWidth + "px";
        rankingDisplay.removeEventListener("click", hideRanking);
        rankingDisplay.addEventListener("click", showRanking);
        rankingDisplay.addEventListener("mouseover", rankingOver);
        rankingDisplay.addEventListener("mouseout", rankingOut);
        darkBackground.classList.add("hide");

    });
}


function showMainMenu() {
    menuCube.style.transform = "translateZ(-225px) rotateY(0)";
    mainMenuScreen.classList.remove("hide");
    gameScreen.classList.add("hide");
    menuEnd.classList.add("hide");
    darkBackground.classList.add("hide");
}

function logOut() {
    logOutIcon.classList.add("hide");
    logInIcon.classList.remove("hide");
    usernameHeader.classList.add("hide");
    logInHeader.classList.remove("hide");
    showMainMenu();

}

function displayLogIn() {
    removeClassElement(selectRegister, "selected");
    addClassToElement(selectLogIn, "selected");
    removeClassElement(selectGuest, "selected");
    removeClassElement(logInForm, "hide");
    addClassToElement(registerForm, "hide");
    addClassToElement(guestForm, "hide");
}

function startGame() {
    // if mode custom check size and mines
    if ((selectSize.value === "") || (parseInt(selectSize.value) < 2) || (parseInt(selectSize.value) > 15)) {
        //error
        return false;
    } else {
        if ((parseInt(selectMines.value) >= Math.pow(parseInt(selectSize.value), 3)) || (selectMines.value === "") || (parseInt(selectMines.value) < 1)) {
            //error
           
            return false;
        }
    }
    
    createBoard(selectSize.value, selectMines.value);
    mainMenuScreen.classList.add("hide");
    gameScreen.classList.remove("hide");
    //pass to next screen
}




function addClassToElement(form, klass) {
    if (!form.classList.contains(klass)) {
        form.classList.add(klass);
    }
}

function removeClassElement(form, klass) {
    if (form.classList.contains(klass)) {
        form.classList.remove(klass);
    }
}






function showCurrentUser(user) {
    logInHeader.classList.add("hide");
    usernameHeader.innerHTML = user.username;
    usernameHeader.classList.remove("hide");
    logInIcon.classList.add("hide");
    logOutIcon.classList.remove("hide");
}












//check if the inputs of the form are correct and if so stores the information in a new user object
function checkFormInputs(form) {
    let verifiedFields = 0;
    let username;
    let password;
    let email;
    let inputs = form.querySelectorAll("input");
    let labels = form.querySelectorAll("label");
    if ((inputs[0].value.length > 4) && (USERNAME_REGEX.test(inputs[0].value))) {
        username = inputs[0].value;
        verifiedFields++;
        labels[0].innerHTML = "Choose your username" + CHECK_ICON;
    } else {
        //error
        labels[0].innerHTML = "Choose your username" + CROSS_ICON;
        
    }

    if (PASSWORD_REGEX.test(inputs[1].value)) {
        password = inputs[1].value;
        verifiedFields++;
        labels[1].innerHTML = "Password" + CHECK_ICON;
    } else {
        //error
        labels[1].innerHTML = "Password" + CROSS_ICON;
      
    }

    if (inputs[2] !== undefined) {
        if (password === inputs[2].value) {
            verifiedFields++; // if password is undefined it will enter but doesn't matter
            labels[2].innerHTML = "Confirm password" + CHECK_ICON;
        } else {
            //error  passwords do not match
            labels[2].innerHTML = "Confirm password" + CROSS_ICON;
          
        }
    }

    if (inputs[3] !== undefined) {
        if (EMAIL_REGEX.test(inputs[3].value)) {
            email = inputs[3].value;
            verifiedFields++;
            labels[3].innerHTML = "Email" + CHECK_ICON;

        } else {
            //error
            labels[3].innerHTML = "Email" + CROSS_ICON;
           
        }
    }

    if (inputs.length === verifiedFields) {
        let newUser;
      
        switch (inputs.length) {
            case 2: // log in
                
                if (logInUser(username, password) !== false) {
                    rotateY(menuCube, -90);
                   
                    showCurrentUser(logInUser(username, password));
                } else {
                    labels[0].innerHTML = "Choose your username" + CROSS_ICON;
                    labels[1].innerHTML = "Password" + CROSS_ICON;
                }
                return logInUser(username, password);
            case 4: //register new user
                let error = 0;
                users.forEach(user => {
                    if (user.username === username) {
                      

                        error++;
                    }
                    if (user.email === email) {
                      
                        error++;
                    }
                });
                if (error > 0) {
                    return false;
                }
                rotateY(menuCube, -90);
                newUser = new User(false, username, password, email);
                users.push(newUser);
               
                showCurrentUser(newUser);
                return newUser;
                break;
            default:
                break;
        }
    } else {
    
        return false;
    }
}

function logInUser(username, password) {
    let match = false;
    let foundUser;
    users.forEach((user) => {
        

        if (user.username === username) {
          
            if (user.verifyPassword(password)) {
              
                match = true;
                foundUser = user;
            }
        }
    });

    return (match === true) ? foundUser : false;
}

function newGuest() {
    rotateY(menuCube, -90);
    let newUser = new User(true, "A_" + new Date().getTime().toString().slice(-10));
    users.push(newUser);
  
    return newUser;

}



function updateRanking() {
    //get array with name an scores
    let matches = [];
    users.forEach(user => {
        user.matches.forEach(match => {
            matches.push({
                name: user.username,
                score: match.score
            });
        });
    });
    // ordenate games from higher score to lower
    matches.sort((gameA, gameB) => {
        return gameB.score - gameA.score;
    });


    let playerNames = document.querySelectorAll(".ranking dt");
    let playerScores = document.querySelectorAll(".ranking dd");
    //delete old records
    playerNames.forEach((name, index) => {
        if (index > 2) {
            name.remove();
            playerScores[index].remove();
        } else {
            name.querySelector("span").textContent = "";
            playerScores[index].textContent = "";
        }
    });
    let rankingList = document.querySelector(".ranking");
    playerNames = document.querySelectorAll(".ranking dt");
    playerScores = document.querySelectorAll(".ranking dd");
    matches.forEach((match, index) => {
        if (index < playerNames.length) {
            playerNames[index].querySelector("span").textContent = match.name;
            playerScores[index].textContent = match.score.toFixed(0);
        } else {
            let newPlayer = document.createElement("dt");
            newPlayer.innerHTML = `<i>${index+1}</i><span>${match.name}</span>`;
            newPlayer.classList.add("not-top-ranking");
            let newScore = document.createElement("dd");
            newScore.innerHTML = match.score.toFixed(0);
            rankingList.appendChild(newPlayer);
            rankingList.appendChild(newScore);
        }
    });
    rankingDisplay.style.right = -rankingDisplay.offsetWidth + "px";

}













function openCube(event, board) {
    let cubeIndex = event.currentTarget.id;
    cubeIndex = cubeIndex.replace("-", ""); // remove the slash from small-cube

    let currentDash = cubeIndex.indexOf("-");
    cubeIndex = cubeIndex.replace("-", "");
    let nextDash = cubeIndex.indexOf("-");
    let plane = cubeIndex.slice(currentDash, nextDash);

    currentDash = nextDash;
    cubeIndex = cubeIndex.replace("-", "");
    nextDash = cubeIndex.indexOf("-");
    let row = cubeIndex.slice(currentDash, nextDash);

    currentDash = nextDash;
    cubeIndex = cubeIndex.replace("-", "");
    let col = cubeIndex.slice(currentDash);

    //let [plane, row, col] = event.currentTarget.id.slice(-3).split(""); // only works with board of size 10 or smaller
    let currentCube = board[plane][row][col];
    let finishedGame = false;
    if (currentCube.mined === true) {
        currentCube.showMine();
      
        youWonMsg.classList.add("hide");
        youLostMsg.classList.remove("hide");
        showMines(currentBoard);
        finishedGame = true;
    } else {
        openedCubes++;
       
        currentCube.showNeighbourNumber();
        currentCube.opened = true;
        revealNeighbours(board, currentCube);
        if (openedCubes === totalCubes - totalMines) {
        
            currentUser.time = (new Date().getTime() - currentUser.time) / 1000;
            let lastMatch = new Match(board.length, totalMines, currentUser.time);
            currentUser.addMatch(lastMatch);
            finishedGame = true;
            updateRanking();
            youWonMsg.classList.remove("hide");
            youLostMsg.classList.add("hide");
            document.getElementById("score-end").textContent = lastMatch.score.toFixed(0);
            document.getElementById("time-end").textContent = lastMatch.time.toFixed(0)+" seconds";
        }
    }
    if (finishedGame) {
        //endGame(board);
        removeClassElement(menuEnd, "hide");
        //removeClassElement(darkBackground, "hide");
        //
        //update ranking
        openedCubes = 0;

    }
}

// play with the same size
function playAgain() {
    //delete old board and create a new one
    endGame(currentBoard);
    createBoard(currentBoard.length, totalMines);
    addClassToElement(menuEnd, "hide");
    addClassToElement(darkBackground, "hide");

}

function newGame() {
    endGame(currentBoard);
    addClassToElement(menuEnd, "hide");
    addClassToElement(darkBackground, "hide");
    removeClassElement(mainMenuScreen, "hide");
    addClassToElement(gameScreen, "hide");
}

//remove event listeners and delete small cubes
function endGame(board) {
    board.forEach(plane => {
        plane.forEach(row => {
            row.forEach(cube => {
            
                cube.removeCube();
            });
        });
    });
}

function showMines(board){
    board.forEach(plane => {
        plane.forEach(row => {
            row.forEach(cube => {
                if(cube.mined ===true){
                    cube.showMine();
                }
            });
        });
    });
}


//todo USER FUNCTIONS

//we supose that one user can make mor that on match
function User(guest, username, pass = undefined, email = undefined) {
    let password = pass;
    this.username = username;
    this.guest = guest;
    this.matches = [];
    this.email = email;
    this.time; // time of the current game
    this.setPassword = function (oldPassword, newPassword) {
        if (oldPassword === password) {
            password = newPassword;
            return true;
        } else {
            return false;
        }
    }
    this.verifyPassword = function (userPassword) {
        if (userPassword === password) {
            return true;
        } else {
            return false;
        }
    }
    this.addMatch = function (match) {
        this.matches.push(match);
    }
}

function Match(size, mines, time) {
    this.score = ((size / 3) * mines * 10000) / time;
    this.time = time;
    this.size = size;
    this.mines = mines;
}

//todo BOARD CREATION/ACTUALITZATION FUNCTIONS

//create a cube board
// size(mandatory): size of cube
function createBoard(size, mines) {
    if(currentBoard!==undefined){
        endGame(currentBoard);
    }
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
    totalCubes = size * size * size;
    openedCubes = 0;
    let smallCubes = document.querySelectorAll(".mini-cube");
    smallCubes.forEach(cube => {
        cube.addEventListener("click", (event) => {
            openCube(event, board);
        });
    });
    currentBoard = board;
 
    currentUser.time = new Date().getTime();
    return board;
}


//creates one cube object and positionates it
function Cube(row, col, depth, cubeSize, totalDepth) {
    let smallCube = document.createElement("div");
    let idCube = "small-cube" + "-" + depth + "-" + row + "-" + col;
    smallCube.classList.add("mini-cube"); // class mini-cube is defined in the css and contains the real size of the cube
    smallCube.id = idCube;
    smallCube.style.transform += "translateX(" + col * cubeSize + "px)";
    smallCube.style.transform += "translateY(" + row * cubeSize + "px)";
    //smallCube.style.transform += "translateZ("+ (-totalDepth/2)+(cubeSize/2)+depth*cubeSize+"px)";
    let moveZ = (-totalDepth * cubeSize / 2) + (cubeSize / 2) + cubeSize * depth;
  
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
            myNumber.style.color = CSS_COLOR_NAMES[(this.neighbourMineCount-1)%5];
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
                                       
                                        element.showId();
                                        el[key].showId();
                                    }
                                }
                            }
                        }
                    });
                } else {
                    
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

//todo ********* MATRIX ROTATIONS **********

function eventRotate(rotateFunction, direction, element,event) {
    if(event!==undefined){
        event.currentTarget.style.opacity = "0.5";
    }
    let smooth = setInterval(function () {
        rotateFunction(mainCube, ROTATE_INTERVAL * direction);
    }, 25);
    element.addEventListener("mouseout", (e) => {
        e.currentTarget.style.opacity = "1";
        clearInterval(smooth);
    }, {
        once: true
    });
    element.addEventListener("mouseup", (e) => {
        e.currentTarget.style.opacity = "1";
        clearInterval(smooth);
    }, {
        once: true
    });
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

function translateXYZ(obj, pixX = 0, pixY = 0, pixZ = 0) {
    let translationMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [pixX, pixY, pixZ, 1]
    ];
    let currentMatrix = getCurrentMatrix3D(obj);
    let translatedMatrix = multiplyMatrices(currentMatrix, translationMatrix);
    obj.style.transform = "matrix3d(" + translatedMatrix.join() + ")";
    return translatedMatrix;
}

//todo ******* MATH OPERATIONS **************

function getRandom(min, max) {
    return Math.floor((Math.random() * (max - min))) + min;

}

function calculateCosSin(degrees) {
    let angleRad = (degrees * Math.PI * 2) / 360;
    let cosine = parseFloat(Math.cos(angleRad));
    let sine = parseFloat(Math.sin(angleRad));
    return [cosine, sine];
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