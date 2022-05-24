const degreesToRad = function (degrees: number): number {
  return (degrees * Math.PI * 2) / 360;
};

export type Matrix = Array<Array<number>>;

export class InvalidOperationMatrixSizeError extends Error {
  matrixA: Matrix;
  matrixB: Matrix;

  constructor(matrixA: Matrix, matrixB: Matrix) {
    super("Matrices can not be multiplied due to size incompatibility");
    this.matrixA = matrixA;
    this.matrixB = matrixB;
  }
}

export default {
  cosDegrees(degrees: number): number {
    return Math.cos(degreesToRad(degrees));
  },

  sinDegrees(degrees: number): number {
    return Math.sin(degreesToRad(degrees));
  },

  degreesToRad,

  multiplyMatrices(matrixA: Matrix, matrixB: Matrix): Matrix {
    if (matrixA[0].length !== matrixB.length) {
      throw new InvalidOperationMatrixSizeError(matrixA, matrixB);
    }
    let rows = matrixA.length;
    let columns = matrixB[0].length;
    let result = new Array(rows)
      .fill(0)
      .map((el) => new Array(columns).fill(0));
    return result.map((row, index) => {
      return row.map((el, index1) => {
        let a = 0;
        matrixA[index].forEach((value, index2) => {
          a += value * matrixB[index2][index1];
        });
        return a;
      });
    });
  },

  getCurrentMatrix3D(obj: Element): Matrix {
    let matrixString: string = window.getComputedStyle(obj).transform;
    let matrixFloat: Matrix = [[], [], [], []];
    matrixString = matrixString.slice(9, -1);
    let nextComa: number = matrixString.indexOf(",");
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
  },
};