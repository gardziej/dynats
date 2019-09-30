import iSpriteDataCollection from "./interfaces/iSpriteDataCollection";
import iSpriteData from "./interfaces/iSpriteData";

class Sprites {

  public data: iSpriteDataCollection  = {};

  public totalSprites: number = 0;
  public spritesStillLoading: number = 0;

  loadSprites(spritesData: any) {
    this.data = this.processJsonData(spritesData);
  }

  processJsonData(spritesData: any) {
    const data: iSpriteDataCollection = {};
    for (let key in spritesData) {
      if (typeof spritesData[key] === 'string') {
        data[key] = this.prepareSprite(spritesData[key]);
      }
      else if (typeof spritesData[key] === 'object') {
        data[key] = this.processJsonData(spritesData[key]);
      }
    }
    return data;
  }

  prepareSprite(imageUrl: string): iSpriteData {
    const pathSplit = imageUrl.split('/');
    const fileName = pathSplit[pathSplit.length - 1];
    const fileSplit = fileName.split("/")[0].split(".")[0].split("@");
    const colRow = fileSplit[fileSplit.length - 1].split("x");
    let sheetRows = 1;
    const sheetColumns = parseInt(colRow[0]) || 1;
    if (colRow.length === 2) {
      sheetRows = parseInt(colRow[1]);
    }
  
    return {
      img : this.loadSprite('assets/sprites/' + imageUrl),
      cols : sheetColumns,
      rows : sheetRows
    };
  }
  
  loadSprite(imageUrl: string) {
    const image = new Image();
    image.src = imageUrl;
    this.spritesStillLoading += 1;
    this.totalSprites += 1;
    image.onload = function () {
      this.spritesStillLoading -= 1;
    }.bind(this);
    return image;
  }

  getSprite(name: string, subname: string = null, die: boolean = false): iSpriteData {
    if (subname) {
      if (die) {
        subname = subname + '_die';
      }
      return (this.data[name] as iSpriteDataCollection)[subname] as iSpriteData;
    } else {
      return this.data[name] as iSpriteData;
    }
  }

}

const sprites: Sprites = new Sprites();
export default sprites;