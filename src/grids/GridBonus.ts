import Grid from "../Grid";

export default class GridBonus extends Grid {

  public level: number = 1;
  public type: string = 'bonus';

  typeOfBonus(x,y) {
    if (this.grid[y * this.cols + x] === 1 && typeof this.tiles[y * this.cols + x] !== "undefined")
    {
      return this.tiles[y * this.cols + x].bonus;
    }
  };

  bonusActiv(x,y) {
    if (this.grid[y * this.cols + x] === 1 && typeof this.tiles[y * this.cols + x] !== "undefined")
    {
      return this.tiles[y * this.cols + x].activ;
    }
    return false;
  };

  makeActiv(x,y) {
    if (this.grid[y * this.cols + x] === 1 && typeof this.tiles[y * this.cols + x] !== "undefined")
    {
      this.tiles[y * this.cols + x].activ = true;
    }
  };

  add(x, y, frame, bonus) {
    if (!this.check(x,y))
    {
    this.frame = frame || 0;
    this.grid[y * this.cols + x] = 1;
    this.tiles[y * this.cols + x] = new TileBonus(this, this.type, this.calculateTilePosition(x,y), new Vector2(x,y), this.frame, bonus);
    this.count++;
    }
  };

  makeAllActiv() {
    for (var i in this.tiles)
      {
        if (this.grid[i] === 1 && typeof this.tiles[i] !== "undefined")
          this.tiles[i].activ = true;
      }
      return false;
  };


  explode(x,y) {
    this.tiles[y * this.cols + x].trigger();
  };

}
