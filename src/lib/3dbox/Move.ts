import MatrixUtils, { Matrix } from "../mathUtils/matrix.js";

export default class Move {

  obj: HTMLElement;
  currentMatrix: Matrix | null = null;

  constructor(htmlElement: HTMLElement) {
    this.obj = htmlElement;
  }

  rotateY(degrees: number): void {
    let [cosine, sine] = calculateCosSin(degrees);
    let rotationMatrix = [
      [cosine, 0, sine, 0],
      [0, 1, 0, 0],
      [-sine, 0, cosine, 0],
      [0, 0, 0, 1],
    ];
    this.applyRotationMatrix(rotationMatrix);
  }

  rotateX(degrees: number): void {
    let [cosine, sine] = calculateCosSin(degrees);
    let rotationMatrix = [
      [1, 0, 0, 0],
      [0, cosine, -sine, 0],
      [0, sine, cosine, 0],
      [0, 0, 0, 1],
    ];
    this.applyRotationMatrix(rotationMatrix);
  }

  rotateZ(degrees: number): void {
    let [cosine, sine] = calculateCosSin(degrees);
    let rotationMatrix = [
      [cosine, -sine, 0, 0],
      [sine, cosine, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
    this.applyRotationMatrix(rotationMatrix)
  }

  translateXYZ(pixX = 0, pixY = 0, pixZ = 0) {
    let translationMatrix = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [pixX, pixY, pixZ, 1],
    ];
    let currentMatrix = MatrixUtils.getCurrentMatrix3D(this.obj);
    const translatedMatrix = MatrixUtils.multiplyMatrices(translationMatrix, currentMatrix);
    this.updateCurrentMatrix(translatedMatrix);
  }

  private getRotatedMatrix(rotationMatrix: Matrix): Matrix {
    let currentMatrix = this.currentMatrix
      ? this.currentMatrix
      : MatrixUtils.getCurrentMatrix3D(this.obj);
    let rotatedMatrix = MatrixUtils.multiplyMatrices(currentMatrix, rotationMatrix);
    rotatedMatrix[3] = currentMatrix[3]; // to avoid changing the position(translation)
    return rotatedMatrix;
  }

  private applyRotationMatrix(rotationMatrix: Matrix) {
    const rotatedMatrix: Matrix = this.getRotatedMatrix(rotationMatrix);
    this.updateCurrentMatrix(rotatedMatrix);
  }

  private updateCurrentMatrix(newMatrix: Matrix): void {
    this.currentMatrix = newMatrix;
    this.obj.style.transform =  "matrix3d(" + newMatrix.join() + ")";
  }
}


//todo ******* MATH OPERATIONS **************



function calculateCosSin(degrees: number): Array<number>{
  return [MatrixUtils.cosDegrees(degrees), MatrixUtils.sinDegrees(degrees)];
}

