import TileBomb from "../tiles/TileBomb";
import Vector2 from "../system/Vector2";
import Grid from "../Grid";
import Player from "../Player";


export default class GridBombs extends Grid {

  public level: number = 1;
  public frame: number = 0;
  public type: string = 'bonus';
  public tiles: TileBomb[];

  addBomb(x: number, y: number, player: Player, life: number, area: number) {
    if (!this.check(x, y)) {
      this.frame = 0;
      this.grid[y * this.cols + x] = 1;
      this.tiles[y * this.cols + x] = new TileBomb(this.game, this, this.type, this.calculateTilePosition(x, y), new Vector2(x, y), this.frame, player, life, area);
      this.count++;
    }
    this.addToPfGrid(x, y);
  }

  activateAll() {
    for (let i in this.tiles) {
      this.grid[i] = 0;
      this.tiles[i].trigger();
    }
  }

  explode(x: number, y: number) {
    this.tiles[y * this.cols + x].trigger();
  }

}
