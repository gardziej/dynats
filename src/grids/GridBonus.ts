import Grid from "../Grid";
import TileBonus from "../tiles/TileBonus";
import Vector2 from "../system/Vector2";

export default class GridBonus extends Grid {

  public level: number = 1;
  public type: string = 'bonus';
  public tiles: TileBonus[];

  typeOfBonus(x: number, y: number) {
    if (this.grid[y * this.cols + x] === 1 && typeof this.tiles[y * this.cols + x] !== "undefined")
    {
      return this.tiles[y * this.cols + x].bonus;
    }
  };

  bonusActiv(x: number, y: number) {
    if (this.grid[y * this.cols + x] === 1 && typeof this.tiles[y * this.cols + x] !== "undefined")
    {
      return this.tiles[y * this.cols + x].activ;
    }
    return false;
  };

  makeActiv(x: number, y: number) {
    if (this.grid[y * this.cols + x] === 1 && typeof this.tiles[y * this.cols + x] !== "undefined")
    {
      this.tiles[y * this.cols + x].activ = true;
    }
  };

  addBonus(x: number, y: number, frame: number, bonus: string) {
    if (!this.check(x,y))
    {
    this.frame = frame || 0;
    this.grid[y * this.cols + x] = 1;
    this.tiles[y * this.cols + x] = new TileBonus(this.game, this, this.type, this.calculateTilePosition(x,y), new Vector2(x,y), this.frame, bonus);
    this.count++;
    }
  };

  makeAllActiv() {
    for (let i in this.tiles)
      {
        if (this.grid[i] === 1 && typeof this.tiles[i] !== "undefined")
          this.tiles[i].activ = true;
      }
      return false;
  };


  explode(x: number, y: number) {
    this.tiles[y * this.cols + x].trigger();
  };

}
