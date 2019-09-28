import Vector2 from "./system/Vector2";
import Tile from "./Tile";
import Game from "./Game";

export default class Grid {

  public grid: number[];
  public tiles: Tile[];
  public count: number = 0;
  public frame: number = 0;
  public type: any;

  constructor(
    public game: Game,
    public cols: number,
    public rows: number,
    public level: number = 0
  ) {

    this.grid = new Array(cols * rows);
    this.tiles = new Array(cols * rows);

  }

  calculateTilePosition(x: number, y: number): Vector2 {
    const wx = this.game.map.x + x * Tile.size.width;
    const wy = this.game.map.y + y * Tile.size.height;
    return new Vector2(wx, wy);
  };

  add(x: number, y: number, frame: number) {
    if (!this.check(x, y)) {
      this.frame = frame || 0;
      this.grid[y * this.cols + x] = 1;
      this.tiles[y * this.cols + x] = new Tile(this.game, this.type, this.calculateTilePosition(x, y), new Vector2(x, y), this.frame);
      this.count++;
    }
    this.addToPfGrid(x, y);
  };

  addToPfGrid(x: number, y: number) {
    if (this.level > 0) this.game.map.pfGrid.setWalkableAt(x, y, 'floor', false);
    if (this.level > 1) this.game.map.pfGrid.setWalkableAt(x, y, 'air', false);
  };

  removeFromPfGrid(x: number, y: number) {
    this.game.map.pfGrid.setWalkableAt(x, y, 'floor', true);
    this.game.map.pfGrid.setWalkableAt(x, y, 'air', true);
  };

  clearAll() {
    for (const i in this.tiles) {
      if (typeof this.tiles[i] !== "undefined") delete this.tiles[i];
    }
  };

  countActiv() {
    let count = 0;
    for (const i in this.tiles) {
      if (typeof this.tiles[i] !== "undefined" && this.tiles[i].exploded === false) {
        count++;
      }
    }
    return count;
  };

  remove(x: number, y: number) {
    this.grid[y * this.cols + x] = undefined;
    delete this.tiles[y * this.cols + x];
    this.count--;
    this.removeFromPfGrid(x, y);
  };

  check(x: number, y: number) {
    if (this.grid[y * this.cols + x] === 1)
      return true;
    return false;
  };

  update(delta: number): void {
    for (const i in this.tiles) {
      const y = Math.floor(Number(i) / this.cols);
      const x = Number(i) % this.cols;
      this.tiles[i].position = this.calculateTilePosition(x, y);
      this.tiles[i].update(delta);
    }
  };

  draw(delta: number): void {
    for (const i in this.tiles) {
      this.tiles[i].draw(delta);
    }
  };

}
