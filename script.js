//Constants
const MAX_CUBE_SIZE = 150;
const MIN_CUBE_SIZE = 50;
const CUBE_FACES =["front","back","right","left","top","bottom"];


let mainBoard = document.querySelector(".main-board");
let scene = document.querySelector(".scene");
let mainCube = document.querySelector(".main-cube");
let mainCubeFace = document.querySelectorAll(".main-cube-face");


//  "matrix3d(0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -100, 1)"
/*** test */
document.querySelector(".to-right").addEventListener('click',rotateRight);
document.querySelector(".to-left").addEventListener('click',rotateLeft);
document.querySelector(".to-top").addEventListener('click',rotateTop);
document.querySelector(".to-bottom").addEventListener('click',rotateBottom);
let boxRotation = {
 axesY:0,
 axesX:0
}
function rotateRight(){
    boxRotation.axesY = (boxRotation.axesY-90)%360;
    console.log(" translateZ(-100px) rotateY("+ boxRotation.axesY+"deg)"+  " rotateX("+ boxRotation.axesX+"deg)");
    mainCube.style.transform =" translateZ(-100px) rotateY("+ boxRotation.axesY+"deg)"+  " rotateX("+ boxRotation.axesX+"deg)";
}
function rotateLeft(){
    boxRotation.axesY = (boxRotation.axesY+90)%360;
    console.log(" translateZ(-100px) rotateY("+ boxRotation.axesY+"deg)" +" rotateX("+ boxRotation.axesX+"deg)");
    mainCube.style.transform =" translateZ(-100px) rotateY("+ boxRotation.axesY+"deg)" +" rotateX("+ boxRotation.axesX+"deg)";
}
function rotateTop(){
    boxRotation.axesX = (  boxRotation.axesX-90)%360;
    console.log(" translateZ(-100px) rotateX("+ boxRotation.axesX+"deg)" + " rotateY("+ boxRotation.axesY+"deg)");
    mainCube.style.transform =" translateZ(-100px) rotateX("+ boxRotation.axesX+"deg)" + " rotateY("+ boxRotation.axesY+"deg)";
}
function rotateBottom(){
    boxRotation.axesX = (  boxRotation.axesX+90)%360;
    console.log(" translateZ(-100px) rotateX("+ boxRotation.axesX+"deg)" +  " rotateY("+ boxRotation.axesY+"deg)");
    mainCube.style.transform =" translateZ(-100px) rotateX("+ boxRotation.axesX+"deg)" +  " rotateY("+ boxRotation.axesY+"deg)";
}


//creates one cube objecet
function Cube(row,col,depth,cubeSize){
let smallCube = document.createElement("div");
let idCube = "small-cube"+row+""+col+""+depth;
smallCube.classList.add("mini-cube");
smallCube.id = idCube;
smallCube.style.transform += "translateX("+col*cubeSize+"px)";
smallCube.style.transform += "translateY("+row*cubeSize+"px)";
smallCube.style.transform += "translateZ(75px)";


CUBE_FACES.forEach((face)=>{
    let newFace = document.createElement("div");
    newFace.className =("small-cube-face "+"small-cube-face--"+face);
    smallCube.insertAdjacentElement("beforeend",newFace);
});
mainCube.insertAdjacentElement("beforeend",smallCube);
let addedSmallCube = document.getElementById(idCube);
    this.row = row;
    this.col= col;
    this.depth = depth;
    this.mined = false;
    this.neighbourMineCount = 0;
    this.index = undefined;
    this.opened = false;
    this.showCube = function(){
        addedSmallCube.classList.remove("hide");
    }
    this.hideCube =function(){
        addedSmallCube.classList.add("hide");
    }
    this.insertMine = function(){
        this.mined = true;
    }
}

//by default squared
function defineMainCubeSize(rows,columns,depth){
    //defineCubeSizes
    let cubeSize = 50;
    //scene
    scene.style.width= columns*cubeSize+"px";
    scene.style.height = rows*cubeSize+"px";
    //scene.style.perspective = rows*2*cubeSize+"px";

    // put the front face at z=0;
    mainCube.style.transform = "translateZ(-"+(depth*cubeSize)/2+"px)";

    //main box faces
    mainCubeFace.forEach(face=>{
        face. style.width = columns*cubeSize+"px";
        face.style.height = rows*cubeSize+"px";
        face.style.lineHeight = rows*cubeSize+"px";
        if(face.classList.contains("main-cube-face--front")){
            face. style.width = columns*cubeSize+"px";
            face.style.height = rows*cubeSize+"px";
            face.style.transform = "rotateY(  0deg) translateZ("+depth*cubeSize/2+"px)";
        }else if(face.classList.contains("main-cube-face--right")){
            face.style.transform = "rotateY(  90deg) translateZ("+columns*cubeSize/2+"px)";
        }else if(face.classList.contains("main-cube-face--back")){
            face. style.width = columns*cubeSize+"px";
            face.style.height = rows*cubeSize+"px";
            face.style.transform = "rotateY(  180deg) translateZ("+depth*cubeSize/2+"px)";
        }else if(face.classList.contains("main-cube-face--left")){
            face.style.transform = "rotateY(  -90deg) translateZ("+columns*cubeSize/2+"px)";
        }else if(face.classList.contains("main-cube-face--top")){
            face.style.transform = "rotateX(  90deg) translateZ("+rows*cubeSize/2+"px)";
        }else if(face.classList.contains("main-cube-face--bottom")){
            face.style.transform = "rotateX(  -90deg) translateZ("+rows*cubeSize/2+"px)";
        }
    });

}

mainCube.addEventListener("click",myrotate);
function myrotate(event){
   mainCube.style.transform =" translateZ(-100px) rotateY( -90deg)";
}
function myrotate2(event){
    mainCube.style.transform =" translateZ(-100px) rotateY( 90deg)";
 }
function defineCubeSizes(rows,columns,depth){

}


function rotateY(obj,degrees){
    let [cosine, sine] = calculateCosSin(degrees);
    let rotationMatrix = [[cosine,0,sine,0],[0,1,0,0],[-sine,0,cosine,0],[0,0,0,1]];
    let currentMatrix = getCurrentMatrix3D(obj);
    let rotatedMatrix = multiplyMatrices( currentMatrix, rotationMatrix);
    rotatedMatrix[3] = currentMatrix[3]; // to avoid changing the position(translation)
    console.log(rotatedMatrix);
    obj.style.transform = "matrix3d(" + rotatedMatrix.join()+")";

    // make sure that the transition is finished before next rotation;


    return rotatedMatrix;
}


function rotateX(obj,degrees){
    let [cosine, sine] = calculateCosSin(degrees);
    let rotationMatrix = [[1,0,0,0],[0,cosine,-sine,0],[0,sine,cosine,0],[0,0,0,1]];
    let currentMatrix = getCurrentMatrix3D(obj);
    let rotatedMatrix = multiplyMatrices( currentMatrix, rotationMatrix);
    rotatedMatrix[3] = currentMatrix[3]; // to avoid changing the position(translation)
    console.log(rotatedMatrix);
    obj.style.transform = "matrix3d(" + rotatedMatrix.join()+")";

    // make sure that the transition is finished before next rotation;


    return rotatedMatrix;
}

function calculateCosSin(degrees){
    let angleRad = (degrees*Math.PI*2)/360;
    let cosine = parseFloat(Math.cos(angleRad).toFixed(2));
    let sine =parseFloat(Math.sin(angleRad).toFixed(2));
    return [cosine,sine];

}

function rotateZ(obj,degrees){
    let [cosine, sine] = calculateCosSin(degrees);
    let rotationMatrix = [[cosine,-sine,0,0],[sine,cosine,0,0],[0,0,1,0],[0,0,0,1]];
    let currentMatrix = getCurrentMatrix3D(obj);
    let rotatedMatrix = multiplyMatrices( currentMatrix, rotationMatrix);
    rotatedMatrix[3] = currentMatrix[3]; // to avoid changing the position(translation)
    obj.style.transform = "matrix3d(" + rotatedMatrix.join()+")";

    // make sure that the transition is finished before next rotation;


    return rotatedMatrix;
}

//Returns the homogeneous matrix 4X4 of the entered 3D object
// obj (mandatory): elementHTML
function getCurrentMatrix3D(obj){
    let matrixString = window.getComputedStyle(obj).transform;
    let matrixFloat=[[],[],[],[]];
    matrixString = matrixString.slice(9,-1);
    let nextComa = matrixString.indexOf(",");

    for(let m=0; m < 4; m++){
        for(let n=0; n < 4; n++){
            if(matrixString.indexOf(",")!==-1){
                matrixFloat[m][n] = parseFloat(matrixString.slice(0,nextComa));
            }else{
                matrixFloat[m][n] = parseFloat(matrixString.slice(0));
            }
            matrixString = matrixString.slice(nextComa+2); //delete read number
                nextComa = matrixString.indexOf(",");
        }
    }
    return matrixFloat;

}


//Returns the multiplication of two matrices
// both matrices must be passed as arrays where each element is an array that represent a row of the matrix
// the returned matrix will be in the same format
function multiplyMatrices(matrixA,matrixB){
        if(matrixA[0].length !== matrixB.length){
            console.log("Matrices can not be multiplied due to size incompatibility");
            return false;
        }

        let rows = matrixA.length;
        let columns = matrixB[0].length;
        let result = new Array(rows).fill(0).map(el=> new Array(columns).fill(0));
        return result.map((row,index)=>{
            return row.map((el,index1)=>{
                let a = 0;
                matrixA[index].forEach((value,index2)=>{
                    a += value*matrixB[index2][index1];
                });
                return a;
            });
        }
        );
}
