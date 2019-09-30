import Grid from "../Grid";
import Tile from "../Tile";
import Vector2 from "../system/Vector2";

export default class GridGrass extends Grid {

  public type: string = "grass";

  fill(): void {
    for (let i = 0, len = this.cols * this.rows; i < len; i++) {
      this.grid[i] = 1;
      let y = Math.floor(i / this.cols);
      let x = i % this.cols;
      this.tiles[i] = new Tile(this.game, this.type, this.calculateTilePosition(x, y), new Vector2(x, y));
    }
    this.count = this.cols * this.rows;
  }

}
