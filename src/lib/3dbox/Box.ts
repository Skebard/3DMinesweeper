import Move from "./Move.js"

export type BoxDimensions = {
  length: number
  width: number
  height: number
};

export type BoxInitialPosition = {
  translateX: number
  translateY: number
  translateZ: number
}

type BoxFaceStyles = {
  transform: string
  width: number
  height: number
  defaultBackground: string | null
  backgroundImage: string | null | undefined
  additionalStyles: string | null
}


export type BoxBackgroundImages = {
  front: string | null
  back: string | null
  left: string | null
  right: string | null
  top: string | null
  bottom: string | null
}


export default class Box extends Move{

  /*bgImages
  0-left
  1-top
  2-bottom
  3-front
  4-right
  5-back
  */
  boxDimensions: BoxDimensions;
  scene: HTMLDivElement;
  box: HTMLDivElement;
  bgImages: BoxBackgroundImages | null;




  /**
   * 
   * @param {int} length -Pixels
   * @param {int} width - Pixels
   * @param {int} height - Pixels
   */
  constructor(boxDimensions: BoxDimensions, bgImages: BoxBackgroundImages | null = {
    front: null,
    back: null,
    left: null,
    right: null,
    top: null,
    bottom: null
  },
  transformOrigin='center'
  ,translateZ=true
  ){
      super();
      this.boxDimensions = {
        length: boxDimensions.length,
        width: boxDimensions.width,
        height: boxDimensions.height
      }
      this.bgImages = bgImages;
      this.bgImages = bgImages;
      this.scene = this.createScene(10000);
      this.box = this.createBox(transformOrigin,translateZ);
      this.scene.appendChild(this.box);
      this.obj = this.box;

  }

  private createBox(transformOrigin: string, translateZ): HTMLDivElement{
    console.log(this.boxDimensions)
      let box: HTMLDivElement = document.createElement('div');
      let style = "height:"+this.boxDimensions.height+"px; width:"+this.boxDimensions.length+"px;   position: relative; transform-style: preserve-3d; transform-origin:"+transformOrigin+";";
      if(translateZ === true){
          style +="transform: translateZ("+Math.floor(-this.boxDimensions.width/2)+ "px);";
      }else{
          style +="transform: translateZ("+Math.floor(-translateZ/2)+"px);";
      }
      box.style  = style;
      box.append(this.createFront(),this.createBack(),this.createLeft(),this.createRight(),this.createTop(),this.createBottom());
      return box;
  }

  private createFront(){
    const styles = this.getBoxFaceStyles({
      transform: 'rotateY(  0deg) translateZ( '+ Math.floor(this.boxDimensions.width/2)+'px)',
      width: this.boxDimensions.length,
      height: this.boxDimensions.height,
      defaultBackground: 'hsla(  0, 100%, 50%, 0.7)',
      backgroundImage: this.bgImages?.front,
      additionalStyles: null,
    }); 
    return this.createFace(styles);
  }

  private createBack(){
    const styles = this.getBoxFaceStyles({
      transform: 'rotateY(  180deg) translateZ( '+ Math.floor(this.boxDimensions.width/2)+'px)',
      width: this.boxDimensions.length,
      height: this.boxDimensions.height,
      defaultBackground: 'hsla(120, 100%, 50%, 0.7)',
      backgroundImage: this.bgImages?.back,
      additionalStyles: null,
    }); 
    return this.createFace(styles);
  }

  private createLeft(){
    const styles = this.getBoxFaceStyles({
      transform: 'rotateY(  -90deg) translateZ( '+ Math.floor(this.boxDimensions.length/2)+'px)',
      width: this.boxDimensions.width,
      height: this.boxDimensions.height,
      defaultBackground: 'hsla(180, 100%, 50%, 0.7)',
      backgroundImage: this.bgImages?.left,
      additionalStyles: 'left:'+(this.boxDimensions.length-this.boxDimensions.width)/2+'px;',//center the face
    }); 
    return this.createFace(styles);
  }

  private createRight(){
    const styles = this.getBoxFaceStyles({
      transform: 'rotateY(  90deg) translateZ( '+ Math.floor(this.boxDimensions.length/2)+'px)',
      width: this.boxDimensions.width,
      height: this.boxDimensions.height,
      defaultBackground: 'hsla( 60, 100%, 50%, 0.7)',
      backgroundImage: this.bgImages?.right,
      additionalStyles: 'left:'+(this.boxDimensions.length-this.boxDimensions.width)/2+'px;',//center the face
    }); 
    return this.createFace(styles);
  }
  private createTop(){
    const styles = this.getBoxFaceStyles({
      transform: 'rotateX(  90deg) translateZ( '+ Math.floor(this.boxDimensions.height/2)+'px)',
      width: this.boxDimensions.length,
      height: this.boxDimensions.width,
      defaultBackground: 'hsla(240, 100%, 50%, 0.7)',
      backgroundImage: this.bgImages?.top,
      additionalStyles: 'top:'+(this.boxDimensions.height-this.boxDimensions.width)/2+'px;'//center the face
    }); 
    return this.createFace(styles);
  }
  private createBottom(){
    const styles = this.getBoxFaceStyles({
      transform: 'rotateX(  -90deg) translateZ( '+ Math.floor(this.boxDimensions.height/2)+'px)',
      width: this.boxDimensions.length,
      height: this.boxDimensions.width,
      defaultBackground: 'hsla(300, 100%, 50%, 0.7)',
      backgroundImage: this.bgImages?.bottom,
      additionalStyles: 'top:'+(this.boxDimensions.height-this.boxDimensions.width)/2+'px;'//center the face
    }); 
    return this.createFace(styles);
  }

  private getBoxFaceStyles(faceStyles: BoxFaceStyles): string {
    let styles = 'transform:' + faceStyles.transform + ";"
    styles += "width:"+faceStyles.width+"px;height:"+faceStyles.height+"px;";
    styles += " background-size:cover ; background-repeat:no-repeat;";
    if (faceStyles.defaultBackground) {
      styles += 'background:' + faceStyles.defaultBackground + ';';
    }
    if (faceStyles.backgroundImage) {
      styles += "background-image:url("+faceStyles.backgroundImage+");";
    }
    if (faceStyles.additionalStyles) {
      styles += faceStyles.additionalStyles;
    }
    return styles;
  }

  private createFace(styles: string): HTMLDivElement{
      let face = document.createElement('div');
      face.classList.add('box__face');
      face.style = styles;
      return face;
  }

  private createScene(perspective: number):HTMLDivElement {
      let scene = document.createElement('div');
      scene.style = "width:"+this.boxDimensions.length+"px;height:"+this.boxDimensions.height+"px;perspective:"+perspective+"px;transform-style: preserve-3d;";
      return scene;
  }
}