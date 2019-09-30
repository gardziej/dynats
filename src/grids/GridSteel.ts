import Grid from "../Grid";
import sprites from "../system/Sprites";
import Vector2 from "../system/Vector2";
import iSpriteData from "../system/interfaces/iSpriteData";
import Tile from "../Tile";
import Rectangle from "../system/Rectangle";
import iSpriteDataCollection from "../system/interfaces/iSpriteDataCollection";


export default class GridSteel extends Grid {

  public level: number = 2;
  public type: string = 'steel';

  draw(delta: number): void {
    super.draw(delta);

    for (let i in this.tiles) {
      let x = Number(i) % this.cols;
      let y = Math.floor(Number(i) / this.cols);
      let shadowPosition = this.calculateTilePosition(x, y + 1);
      this.game.canvas.drawImage((sprites.data.tiles as iSpriteDataCollection).grass as iSpriteData, shadowPosition, 0, Vector2.zero, new Rectangle(48, 0, Tile.size.width, Tile.size.height));
    }

  };

  fill(): void {

    for (let i = 1; i < this.cols - 1; i++) {
      for (let j = 1; j < this.rows - 1; j++) {
        if (i % 2 === 0 && j % 2 === 0) {
          this.add(i, j, 0);
        }
      }
    }

  };

}
